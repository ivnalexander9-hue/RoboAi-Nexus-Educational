import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Compass, Navigation, Radio, Plus, Trash2, RotateCcw, Play, Pause, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface Obstacle {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export const SlamRoverSimulator: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Arena dimensions
  const arenaWidth = 480;
  const arenaHeight = 340;

  // Rover state
  const [rover, setRover] = useState({
    x: 70,
    y: 70,
    heading: 0, // in radians
    speed: 0,
    angularSpeed: 0,
  });

  // Goal target position
  const [goal, setGoal] = useState<{ x: number; y: number }>({ x: 410, y: 270 });

  // Mode: Autonomous Navigation vs Manual Teleop
  const [mode, setMode] = useState<'auto' | 'manual'>('auto');
  const [isRunning, setIsRunning] = useState<boolean>(true);

  // Obstacles list
  const [obstacles, setObstacles] = useState<Obstacle[]>([
    { id: 'obs-1', x: 160, y: 30, w: 30, h: 140 },
    { id: 'obs-2', x: 280, y: 170, w: 30, h: 140 },
    { id: 'obs-3', x: 160, y: 220, w: 80, h: 30 },
    { id: 'obs-4', x: 330, y: 80, w: 50, h: 50 },
  ]);

  // Telemetry metrics
  const [closestObstacleDist, setClosestObstacleDist] = useState<number>(100);
  const [lidarPointsCount, setLidarPointsCount] = useState<number>(64);
  const [pathProgress, setPathProgress] = useState<number>(0);

  // LiDAR ray casting function
  const numRays = 64;
  const maxLidarRange = 160;

  const castRay = useCallback((originX: number, originY: number, angle: number) => {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    let minDistance = maxLidarRange;
    let hitX = originX + cos * maxLidarRange;
    let hitY = originY + sin * maxLidarRange;

    // Check arena boundary hits
    if (cos > 0) {
      const d = (arenaWidth - originX) / cos;
      if (d > 0 && d < minDistance) minDistance = d;
    } else if (cos < 0) {
      const d = (0 - originX) / cos;
      if (d > 0 && d < minDistance) minDistance = d;
    }

    if (sin > 0) {
      const d = (arenaHeight - originY) / sin;
      if (d > 0 && d < minDistance) minDistance = d;
    } else if (sin < 0) {
      const d = (0 - originY) / sin;
      if (d > 0 && d < minDistance) minDistance = d;
    }

    // Check obstacle boundary hits
    for (const obs of obstacles) {
      // Test 4 lines of rectangle
      const lines = [
        { x1: obs.x, y1: obs.y, x2: obs.x + obs.w, y2: obs.y },
        { x1: obs.x + obs.w, y1: obs.y, x2: obs.x + obs.w, y2: obs.y + obs.h },
        { x1: obs.x + obs.w, y1: obs.y + obs.h, x2: obs.x, y2: obs.y + obs.h },
        { x1: obs.x, y1: obs.y + obs.h, x2: obs.x, y2: obs.y },
      ];

      for (const line of lines) {
        // Ray-segment intersection
        const x1 = line.x1;
        const y1 = line.y1;
        const x2 = line.x2;
        const y2 = line.y2;

        const x3 = originX;
        const y3 = originY;
        const x4 = originX + cos;
        const y4 = originY + sin;

        const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
        if (Math.abs(den) < 0.0001) continue;

        const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
        const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;

        if (t >= 0 && t <= 1 && u > 0) {
          if (u < minDistance) {
            minDistance = u;
          }
        }
      }
    }

    hitX = originX + cos * minDistance;
    hitY = originY + sin * minDistance;

    return { hitX, hitY, distance: minDistance };
  }, [obstacles, arenaWidth, arenaHeight, maxLidarRange]);

  // Main Simulation Loop
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setRover((prev) => {
        let nextX = prev.x;
        let nextY = prev.y;
        let nextHeading = prev.heading;
        let nextSpeed = prev.speed;
        let nextAngular = prev.angularSpeed;

        if (mode === 'auto') {
          // Autonomous Potential Field Navigation
          const dx = goal.x - prev.x;
          const dy = goal.y - prev.y;
          const distToGoal = Math.sqrt(dx * dx + dy * dy);

          // Goal reached check
          if (distToGoal < 15) {
            return { ...prev, speed: 0, angularSpeed: 0 };
          }

          // Attractive force towards goal
          const targetAngle = Math.atan2(dy, dx);
          let attractiveForceX = Math.cos(targetAngle);
          let attractiveForceY = Math.sin(targetAngle);

          // Repulsive force from obstacles using LiDAR rays
          let repulsiveForceX = 0;
          let repulsiveForceY = 0;
          let closest = maxLidarRange;

          for (let i = 0; i < 16; i++) {
            const rayAngle = prev.heading + (i / 16) * Math.PI * 2;
            const res = castRay(prev.x, prev.y, rayAngle);
            if (res.distance < closest) closest = res.distance;

            if (res.distance < 45) {
              const strength = (45 - res.distance) / 45;
              repulsiveForceX -= Math.cos(rayAngle) * strength * 2.2;
              repulsiveForceY -= Math.sin(rayAngle) * strength * 2.2;
            }
          }

          setClosestObstacleDist(Math.round(closest));

          // Net steering direction
          const totalForceX = attractiveForceX + repulsiveForceX;
          const totalForceY = attractiveForceY + repulsiveForceY;
          const desiredHeading = Math.atan2(totalForceY, totalForceX);

          // Angle difference wrapped to [-PI, PI]
          let angleDiff = desiredHeading - prev.heading;
          while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
          while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

          nextAngular = Math.max(-0.08, Math.min(0.08, angleDiff * 0.4));
          nextHeading += nextAngular;

          // Slow down if turning sharply or near obstacle
          const turnSlowdown = Math.max(0.3, 1 - Math.abs(angleDiff));
          nextSpeed = Math.min(2.2, 1.8 * turnSlowdown);

          // Proposed movement
          const moveX = Math.cos(nextHeading) * nextSpeed;
          const moveY = Math.sin(nextHeading) * nextSpeed;

          // Simple circular collision radius check
          const radius = 14;
          let collision = false;
          for (const obs of obstacles) {
            if (
              nextX + moveX + radius > obs.x &&
              nextX + moveX - radius < obs.x + obs.w &&
              nextY + moveY + radius > obs.y &&
              nextY + moveY - radius < obs.y + obs.h
            ) {
              collision = true;
              break;
            }
          }

          if (!collision) {
            nextX = Math.max(radius, Math.min(arenaWidth - radius, nextX + moveX));
            nextY = Math.max(radius, Math.min(arenaHeight - radius, nextY + moveY));
          }
        } else {
          // Manual control step
          nextHeading += prev.angularSpeed;
          const moveX = Math.cos(nextHeading) * prev.speed;
          const moveY = Math.sin(nextHeading) * prev.speed;

          const radius = 14;
          let collision = false;
          for (const obs of obstacles) {
            if (
              nextX + moveX + radius > obs.x &&
              nextX + moveX - radius < obs.x + obs.w &&
              nextY + moveY + radius > obs.y &&
              nextY + moveY - radius < obs.y + obs.h
            ) {
              collision = true;
              break;
            }
          }

          if (!collision) {
            nextX = Math.max(radius, Math.min(arenaWidth - radius, nextX + moveX));
            nextY = Math.max(radius, Math.min(arenaHeight - radius, nextY + moveY));
          }
        }

        return {
          x: nextX,
          y: nextY,
          heading: nextHeading,
          speed: nextSpeed,
          angularSpeed: nextAngular,
        };
      });
    }, 40);

    return () => clearInterval(interval);
  }, [isRunning, mode, goal, castRay, obstacles, arenaWidth, arenaHeight, maxLidarRange]);

  // Distance to goal metric
  const currentDistToGoal = Math.round(
    Math.sqrt(Math.pow(rover.x - goal.x, 2) + Math.pow(rover.y - goal.y, 2))
  );

  // Render canvas frame
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Draw arena floor grid
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // 2. Draw obstacles
    obstacles.forEach((obs) => {
      // Barrier fill
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(obs.x, obs.y, obs.w, obs.h);

      // Warning hazard stripes
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
      ctx.lineWidth = 2;
      for (let s = -obs.h; s < obs.w; s += 12) {
        ctx.beginPath();
        ctx.moveTo(Math.max(obs.x, obs.x + s), obs.y);
        ctx.lineTo(Math.min(obs.x + obs.w, obs.x + s + obs.h), obs.y + obs.h);
        ctx.stroke();
      }
    });

    // 3. Cast and draw 360-degree LiDAR rays & point cloud
    const hits: { x: number; y: number }[] = [];
    for (let i = 0; i < numRays; i++) {
      const angle = rover.heading + (i / numRays) * Math.PI * 2;
      const res = castRay(rover.x, rover.y, angle);

      // Draw faint scan beam
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.08)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(rover.x, rover.y);
      ctx.lineTo(res.hitX, res.hitY);
      ctx.stroke();

      hits.push({ x: res.hitX, y: res.hitY });
    }

    // Draw LiDAR Point Cloud returns
    hits.forEach((pt) => {
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 2, 0, Math.PI * 2);
      ctx.fill();
    });

    // 4. Draw Goal Flag
    ctx.save();
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(goal.x, goal.y, 12, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = 'rgba(234, 179, 8, 0.25)';
    ctx.fill();

    // Flag pole & pennant
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(goal.x, goal.y + 10);
    ctx.lineTo(goal.x, goal.y - 12);
    ctx.lineTo(goal.x + 10, goal.y - 7);
    ctx.lineTo(goal.x, goal.y - 2);
    ctx.fillStyle = '#eab308';
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // 5. Draw Autonomous Path Guide Line
    if (mode === 'auto') {
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
      ctx.setLineDash([5, 5]);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(rover.x, rover.y);
      ctx.lineTo(goal.x, goal.y);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // 6. Draw AMR Rover Body
    ctx.save();
    ctx.translate(rover.x, rover.y);
    ctx.rotate(rover.heading);

    // Wheels
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-12, -15, 8, 6);
    ctx.fillRect(4, -15, 8, 6);
    ctx.fillRect(-12, 9, 8, 6);
    ctx.fillRect(4, 9, 8, 6);

    // Chassis
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.roundRect(-14, -11, 28, 22, 4);
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Direction arrow
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(10, 0);
    ctx.lineTo(2, -5);
    ctx.lineTo(2, 5);
    ctx.closePath();
    ctx.fill();

    // LiDAR Turret Puck in center
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }, [rover, goal, obstacles, castRay, numRays, mode]);

  // Click on canvas to relocate Goal or spawn obstacle
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = Math.round(e.clientX - rect.left);
    const clickY = Math.round(e.clientY - rect.top);

    // If shift key or button says spawn obstacle
    if (e.shiftKey) {
      setObstacles((prev) => [
        ...prev,
        { id: `obs-${Date.now()}`, x: clickX - 20, y: clickY - 20, w: 40, h: 40 },
      ]);
    } else {
      // Relocate destination goal
      setGoal({ x: clickX, y: clickY });
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Compass className="w-5 h-5" />
            </span>
            <h3 className="text-xl font-bold text-white tracking-wide">
              Simulasi Rover Otonom & SLAM LiDAR 360°
            </h3>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Eksplorasi pemetaan lingkungan berbasis sensor laser (LiDAR), penghindaran rintangan dinamis, dan navigasi titik koordinat.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => {
              setMode('auto');
              setRover((prev) => ({ ...prev, speed: 1.5, angularSpeed: 0 }));
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              mode === 'auto'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Otonom (Potential Field)
          </button>
          <button
            onClick={() => {
              setMode('manual');
              setRover((prev) => ({ ...prev, speed: 0, angularSpeed: 0 }));
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              mode === 'manual'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Kemudi Manual (Teleoperasi)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Arena Canvas */}
        <div className="lg:col-span-8 flex flex-col">
          <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-[#090d16] flex items-center justify-center">
            <canvas
              ref={canvasRef}
              width={arenaWidth}
              height={arenaHeight}
              onClick={handleCanvasClick}
              className="cursor-pointer max-w-full h-auto"
            />

            {/* HUD Overlay */}
            <div className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-emerald-400 font-mono">
                <Radio className="w-3.5 h-3.5 animate-pulse" /> LiDAR 64-Beam
              </span>
              <span className="text-slate-500">|</span>
              <span className="text-slate-300 font-mono">
                Jarak Target: {currentDistToGoal} px
              </span>
            </div>

            <div className="absolute bottom-3 left-3 text-[11px] text-slate-400 bg-slate-950/80 px-2.5 py-1 rounded border border-slate-800">
              💡 Klik di mana saja untuk memindahkan Target Kuning | Shift+Klik untuk menambah balok halangan
            </div>
          </div>

          {/* Quick Obstacle Actions */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setObstacles((prev) => [
                    ...prev,
                    {
                      id: `obs-${Date.now()}`,
                      x: Math.round(100 + Math.random() * 250),
                      y: Math.round(50 + Math.random() * 200),
                      w: 40,
                      h: 40,
                    },
                  ]);
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 text-xs font-medium flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5 text-cyan-400" /> Tambah Rintangan
              </button>
              <button
                onClick={() => setObstacles([])}
                className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 text-xs font-medium flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-400" /> Bersihkan Arena
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
              >
                {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-emerald-400" />}
              </button>
              <button
                onClick={() => {
                  setRover({ x: 70, y: 70, heading: 0, speed: 0, angularSpeed: 0 });
                  setGoal({ x: 410, y: 270 });
                }}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
                title="Reset Posisi Rover"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Telemetry and Manual Controller */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Telemetry */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2 mb-3">
              <Navigation className="w-4 h-4 text-emerald-400" /> Status Odometri & Laser
            </h4>

            <div className="space-y-2.5 text-xs font-mono">
              <div className="flex justify-between items-center py-1 border-b border-slate-900">
                <span className="text-slate-400">Posisi Rover (X, Y):</span>
                <span className="text-cyan-400 font-semibold">
                  ({Math.round(rover.x)}, {Math.round(rover.y)})
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-900">
                <span className="text-slate-400">Arah Hadap (Heading θ):</span>
                <span className="text-slate-200">
                  {Math.round((rover.heading * 180) / Math.PI % 360)}°
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-900">
                <span className="text-slate-400">Halangan Terdekat:</span>
                <span
                  className={`font-semibold ${
                    closestObstacleDist < 35 ? 'text-red-400 animate-pulse' : 'text-emerald-400'
                  }`}
                >
                  {closestObstacleDist} px {closestObstacleDist < 35 ? '⚠️ WASPADA' : 'Aman'}
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-400">Mode Navigasi:</span>
                <span className="text-emerald-300 font-semibold uppercase">{mode}</span>
              </div>
            </div>
          </div>

          {/* Manual Teleop Keypad */}
          {mode === 'manual' ? (
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col items-center">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 w-full text-center">
                Gamepad Kemudi Virtual
              </h4>

              <div className="grid grid-cols-3 gap-2 w-48">
                <div></div>
                <button
                  onMouseDown={() => setRover((prev) => ({ ...prev, speed: 2.2 }))}
                  onMouseUp={() => setRover((prev) => ({ ...prev, speed: 0 }))}
                  className="p-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 flex items-center justify-center active:bg-cyan-500 active:text-slate-950 transition-all"
                  title="Maju"
                >
                  <ChevronUp className="w-5 h-5" />
                </button>
                <div></div>

                <button
                  onMouseDown={() => setRover((prev) => ({ ...prev, angularSpeed: -0.08 }))}
                  onMouseUp={() => setRover((prev) => ({ ...prev, angularSpeed: 0 }))}
                  className="p-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 flex items-center justify-center active:bg-cyan-500 active:text-slate-950 transition-all"
                  title="Putar Kiri"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setRover((prev) => ({ ...prev, speed: 0, angularSpeed: 0 }))}
                  className="p-3 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 text-[10px] font-bold"
                  title="Rem Berhenti"
                >
                  REM
                </button>
                <button
                  onMouseDown={() => setRover((prev) => ({ ...prev, angularSpeed: 0.08 }))}
                  onMouseUp={() => setRover((prev) => ({ ...prev, angularSpeed: 0 }))}
                  className="p-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 flex items-center justify-center active:bg-cyan-500 active:text-slate-950 transition-all"
                  title="Putar Kanan"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                <div></div>
                <button
                  onMouseDown={() => setRover((prev) => ({ ...prev, speed: -1.6 }))}
                  onMouseUp={() => setRover((prev) => ({ ...prev, speed: 0 }))}
                  className="p-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 flex items-center justify-center active:bg-cyan-500 active:text-slate-950 transition-all"
                  title="Mundur"
                >
                  <ChevronDown className="w-5 h-5" />
                </button>
                <div></div>
              </div>

              <p className="text-[11px] text-slate-500 mt-3 text-center">
                Tekan dan tahan tombol untuk melajukan atau membelokkan rover.
              </p>
            </div>
          ) : (
            <div className="bg-emerald-950/20 border border-emerald-800/30 p-4 rounded-xl text-xs text-slate-300">
              <span className="font-semibold text-emerald-300 block mb-1">Algoritma Medan Potensial (Potential Field):</span>
              Robot tertarik pada titik target tujuan (gaya tarik gravitasi semu) dan tertolak secara kuadratik dari rintangan yang dipantulkan sensor LiDAR.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
