import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Crosshair, Sparkles, AlertTriangle, Layers, Activity, Sliders } from 'lucide-react';

interface KinematicsProps {
  onLearnMore?: () => void;
}

export const KinematicsSimulator: React.FC<KinematicsProps> = () => {
  // Arm link lengths (in canvas units)
  const L1 = 120; // Upper arm length
  const L2 = 100; // Forearm length
  const L3 = 50;  // End effector / gripper length

  // Origin point
  const origin = { x: 220, y: 320 };

  // Joint angles in degrees
  const [theta1, setTheta1] = useState<number>(45);
  const [theta2, setTheta2] = useState<number>(-45);
  const [theta3, setTheta3] = useState<number>(15);

  // Target coordinates for Inverse Kinematics
  const [target, setTarget] = useState<{ x: number; y: number }>({ x: 340, y: 190 });
  const [controlMode, setControlMode] = useState<'IK' | 'FK'>('IK');
  const [gripperClosed, setGripperClosed] = useState<boolean>(false);
  const [activeTask, setActiveTask] = useState<'manual' | 'pickAndPlace' | 'arcWeld'>('manual');
  const [taskStep, setTaskStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [payloadAttached, setPayloadAttached] = useState<boolean>(false);

  // Payload position
  const [payload, setPayload] = useState<{ x: number; y: number; placed: boolean }>({
    x: 120,
    y: 330,
    placed: false,
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDraggingTarget = useRef<boolean>(false);

  // Calculate Forward Kinematics given (t1, t2, t3) in degrees
  const computeFK = useCallback((t1: number, t2: number, t3: number) => {
    const rad1 = (t1 * Math.PI) / 180;
    const rad2 = ((t1 + t2) * Math.PI) / 180;
    const rad3 = ((t1 + t2 + t3) * Math.PI) / 180;

    const j1 = { x: origin.x, y: origin.y };
    const j2 = {
      x: j1.x + L1 * Math.cos(rad1),
      y: j1.y - L1 * Math.sin(rad1), // canvas y is inverted
    };
    const j3 = {
      x: j2.x + L2 * Math.cos(rad2),
      y: j2.y - L2 * Math.sin(rad2),
    };
    const ee = {
      x: j3.x + L3 * Math.cos(rad3),
      y: j3.y - L3 * Math.sin(rad3),
    };

    return { j1, j2, j3, ee };
  }, [origin.x, origin.y, L1, L2, L3]);

  // Analytical Inverse Kinematics solver for 2-link + tool orientation
  const solveIK = useCallback((tx: number, ty: number, desiredPhi = -20) => {
    // Relative to base
    const dx = tx - origin.x;
    const dy = origin.y - ty; // inverted canvas coordinates

    // Tool vector offset to find wrist (j3)
    const phiRad = (desiredPhi * Math.PI) / 180;
    const wx = dx - L3 * Math.cos(phiRad);
    const wy = dy - L3 * Math.sin(phiRad);

    const dSq = wx * wx + wy * wy;
    const d = Math.sqrt(dSq);

    // Reachable limit check
    const maxReach = L1 + L2;
    const minReach = Math.abs(L1 - L2);

    if (d > maxReach - 0.01) {
      // Clamped to reachable boundary
      const scale = (maxReach - 0.01) / d;
      const cwx = wx * scale;
      const cwy = wy * scale;
      return solveIK(origin.x + cwx + L3 * Math.cos(phiRad), origin.y - (cwy + L3 * Math.sin(phiRad)), desiredPhi);
    }

    if (d < minReach + 0.01) {
      return null;
    }

    // Law of cosines for elbow angle theta2
    const cosTheta2 = (dSq - L1 * L1 - L2 * L2) / (2 * L1 * L2);
    const clampedCos2 = Math.max(-1, Math.min(1, cosTheta2));
    const radTheta2 = -Math.acos(clampedCos2); // Elbow-up configuration

    // Base angle theta1
    const alpha = Math.atan2(wy, wx);
    const beta = Math.atan2(L2 * Math.sin(radTheta2), L1 + L2 * Math.cos(radTheta2));
    const radTheta1 = alpha - beta;

    // End effector orientation theta3
    const radTheta3 = phiRad - (radTheta1 + radTheta2);

    return {
      t1: (radTheta1 * 180) / Math.PI,
      t2: (radTheta2 * 180) / Math.PI,
      t3: (radTheta3 * 180) / Math.PI,
    };
  }, [origin.x, origin.y, L1, L2, L3]);

  // Update angles when in IK mode and target changes
  useEffect(() => {
    if (controlMode === 'IK') {
      const solution = solveIK(target.x, target.y);
      if (solution) {
        setTheta1(Math.round(solution.t1 * 10) / 10);
        setTheta2(Math.round(solution.t2 * 10) / 10);
        setTheta3(Math.round(solution.t3 * 10) / 10);
      }
    }
  }, [target, controlMode, solveIK]);

  // Calculate current positions
  const joints = computeFK(theta1, theta2, theta3);

  // Compute metrics: Distance to target, singularity metric
  const distToTarget = Math.round(
    Math.sqrt(Math.pow(joints.ee.x - target.x, 2) + Math.pow(joints.ee.y - target.y, 2))
  );

  // Approximate Jacobian determinant for 2-link planar: det(J) ~ L1 * L2 * sin(theta2)
  const jacobianSingularity = Math.abs(Math.sin((theta2 * Math.PI) / 180));
  const isNearSingularity = jacobianSingularity < 0.15;

  // Estimated motor torques (based on static gravity compensation)
  const torque1 = Math.round(Math.abs(Math.cos((theta1 * Math.PI) / 180) * 18 + (payloadAttached ? 8 : 0)));
  const torque2 = Math.round(Math.abs(Math.cos(((theta1 + theta2) * Math.PI) / 180) * 12 + (payloadAttached ? 6 : 0)));

  // Automated Task Sequence (Pick & Place / Arc Weld)
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      if (activeTask === 'pickAndPlace') {
        setTaskStep((prev) => {
          const next = (prev + 1) % 120;
          // Step sequence:
          // 0-30: Move to payload at (120, 330)
          // 30-40: Clamp gripper
          // 40-75: Move up and across to dropoff at (340, 330)
          // 75-85: Open gripper
          // 85-120: Return to neutral home
          if (next < 30) {
            const p = next / 30;
            setTarget({
              x: 220 + (120 - 220) * p,
              y: 200 + (325 - 200) * p,
            });
            setGripperClosed(false);
            setPayloadAttached(false);
          } else if (next >= 30 && next < 40) {
            setGripperClosed(true);
            setPayloadAttached(true);
          } else if (next >= 40 && next < 80) {
            const p = (next - 40) / 40;
            // Arc trajectory
            const currentX = 120 + (340 - 120) * p;
            const currentY = 325 - Math.sin(p * Math.PI) * 120;
            setTarget({ x: currentX, y: currentY });
            setPayload({ x: currentX, y: currentY + 12, placed: false });
          } else if (next >= 80 && next < 90) {
            setGripperClosed(false);
            setPayloadAttached(false);
            setPayload({ x: 340, y: 330, placed: true });
          } else {
            // Return home
            const p = (next - 90) / 30;
            setTarget({
              x: 340 + (260 - 340) * p,
              y: 330 + (180 - 330) * p,
            });
          }
          return next;
        });
      } else if (activeTask === 'arcWeld') {
        setTaskStep((prev) => {
          const next = (prev + 1) % 100;
          const angle = (next / 100) * Math.PI * 2;
          const centerX = 260;
          const centerY = 190;
          const radiusX = 80;
          const radiusY = 40;
          setTarget({
            x: centerX + Math.cos(angle) * radiusX,
            y: centerY + Math.sin(angle) * radiusY,
          });
          return next;
        });
      }
    }, 50);

    return () => clearInterval(interval);
  }, [isPlaying, activeTask]);

  // Sync payload position with end-effector if attached
  useEffect(() => {
    if (payloadAttached) {
      setPayload((prev) => ({ ...prev, x: joints.ee.x, y: joints.ee.y + 12 }));
    }
  }, [joints.ee, payloadAttached]);

  // Draw simulation on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Draw sleek grid background
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    const gridSize = 25;
    for (let x = 0; x < canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // 2. Draw ground platform
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, origin.y + 20, canvas.width, canvas.height - (origin.y + 20));
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, origin.y + 20);
    ctx.lineTo(canvas.width, origin.y + 20);
    ctx.stroke();

    // Work benches
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(90, origin.y + 5, 60, 15);
    ctx.fillRect(310, origin.y + 5, 60, 15);
    ctx.fillStyle = '#64748b';
    ctx.font = '10px monospace';
    ctx.fillText('STASI A', 100, origin.y + 16);
    ctx.fillText('STASI B', 320, origin.y + 16);

    // 3. Draw reachable workspace envelope (light transparent ring)
    ctx.beginPath();
    ctx.arc(origin.x, origin.y, L1 + L2 + L3, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.setLineDash([]);

    // 4. Draw trajectory guide if task is active
    if (activeTask === 'arcWeld') {
      ctx.beginPath();
      ctx.ellipse(260, 190, 80, 40, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(234, 179, 8, 0.4)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // 5. Draw target marker
    ctx.save();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(target.x, target.y, 10, 0, Math.PI * 2);
    ctx.stroke();
    // Crosshair lines
    ctx.beginPath();
    ctx.moveTo(target.x - 14, target.y);
    ctx.lineTo(target.x + 14, target.y);
    ctx.moveTo(target.x, target.y - 14);
    ctx.lineTo(target.x, target.y + 14);
    ctx.stroke();
    ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
    ctx.fill();
    ctx.restore();

    // 6. Draw Robot Arm Base
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.moveTo(origin.x - 35, origin.y + 20);
    ctx.lineTo(origin.x + 35, origin.y + 20);
    ctx.lineTo(origin.x + 20, origin.y);
    ctx.lineTo(origin.x - 20, origin.y);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Base Joint Turret
    ctx.beginPath();
    ctx.arc(joints.j1.x, joints.j1.y, 18, 0, Math.PI * 2);
    ctx.fillStyle = '#1e293b';
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.stroke();

    // 7. Draw Link 1 (Upper Arm)
    ctx.lineWidth = 14;
    ctx.strokeStyle = '#0284c7';
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(joints.j1.x, joints.j1.y);
    ctx.lineTo(joints.j2.x, joints.j2.y);
    ctx.stroke();

    // Inner highlight
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#38bdf8';
    ctx.beginPath();
    ctx.moveTo(joints.j1.x, joints.j1.y);
    ctx.lineTo(joints.j2.x, joints.j2.y);
    ctx.stroke();

    // Joint 2 (Shoulder/Elbow)
    ctx.beginPath();
    ctx.arc(joints.j2.x, joints.j2.y, 12, 0, Math.PI * 2);
    ctx.fillStyle = '#0f172a';
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.stroke();

    // 8. Draw Link 2 (Forearm)
    ctx.lineWidth = 10;
    ctx.strokeStyle = '#0369a1';
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(joints.j2.x, joints.j2.y);
    ctx.lineTo(joints.j3.x, joints.j3.y);
    ctx.stroke();

    ctx.lineWidth = 3;
    ctx.strokeStyle = '#7dd3fc';
    ctx.beginPath();
    ctx.moveTo(joints.j2.x, joints.j2.y);
    ctx.lineTo(joints.j3.x, joints.j3.y);
    ctx.stroke();

    // Joint 3 (Wrist)
    ctx.beginPath();
    ctx.arc(joints.j3.x, joints.j3.y, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#0f172a';
    ctx.fill();
    ctx.strokeStyle = '#e0f2fe';
    ctx.lineWidth = 2;
    ctx.stroke();

    // 9. Draw Link 3 & Gripper
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#475569';
    ctx.beginPath();
    ctx.moveTo(joints.j3.x, joints.j3.y);
    ctx.lineTo(joints.ee.x, joints.ee.y);
    ctx.stroke();

    // Gripper Claws
    const clawAngle = Math.atan2(joints.ee.y - joints.j3.y, joints.ee.x - joints.j3.x);
    const clawOffset = gripperClosed ? 4 : 10;
    const clawLen = 14;

    ctx.save();
    ctx.translate(joints.ee.x, joints.ee.y);
    ctx.rotate(clawAngle);

    ctx.strokeStyle = gripperClosed ? '#10b981' : '#f59e0b';
    ctx.lineWidth = 3;

    // Top jaw
    ctx.beginPath();
    ctx.moveTo(0, -clawOffset);
    ctx.lineTo(clawLen, -clawOffset);
    ctx.lineTo(clawLen + 4, -clawOffset + 4);
    ctx.stroke();

    // Bottom jaw
    ctx.beginPath();
    ctx.moveTo(0, clawOffset);
    ctx.lineTo(clawLen, clawOffset);
    ctx.lineTo(clawLen + 4, clawOffset - 4);
    ctx.stroke();

    ctx.restore();

    // 10. Draw Payload (Cylinder / Box)
    ctx.fillStyle = payload.placed ? '#10b981' : '#f59e0b';
    ctx.fillRect(payload.x - 10, payload.y - 10, 20, 20);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(payload.x - 10, payload.y - 10, 20, 20);

    // Laser spark if arc welding
    if (activeTask === 'arcWeld' && isPlaying) {
      ctx.beginPath();
      ctx.arc(joints.ee.x, joints.ee.y, Math.random() * 8 + 4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(250, 204, 21, 0.8)';
      ctx.fill();
    }
  }, [joints, target, origin, L1, L2, L3, gripperClosed, payload, activeTask, isPlaying]);

  // Mouse interaction for dragging target on canvas
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    // Check if clicked close to target
    const dist = Math.sqrt(Math.pow(mx - target.x, 2) + Math.pow(my - target.y, 2));
    if (dist < 30) {
      isDraggingTarget.current = true;
    } else {
      // Direct jump
      setControlMode('IK');
      setTarget({ x: Math.round(mx), y: Math.round(my) });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDraggingTarget.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = Math.max(30, Math.min(canvas.width - 30, e.clientX - rect.left));
    const my = Math.max(30, Math.min(origin.y + 15, e.clientY - rect.top));

    setControlMode('IK');
    setTarget({ x: Math.round(mx), y: Math.round(my) });
  };

  const handleMouseUp = () => {
    isDraggingTarget.current = false;
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-md">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Crosshair className="w-5 h-5" />
            </span>
            <h3 className="text-xl font-bold text-white tracking-wide">
              Simulasi Kinematika Lengan Robotik 3-DOF
            </h3>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Uji kendali Kinematika Maju (FK) dan Terbalik (IK), lintasan presisi, serta deteksi singularitas.
          </p>
        </div>

        {/* Mode switches */}
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => {
              setControlMode('IK');
              setActiveTask('manual');
              setIsPlaying(false);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              controlMode === 'IK' && activeTask === 'manual'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Kinematika Terbalik (IK)
          </button>
          <button
            onClick={() => {
              setControlMode('FK');
              setActiveTask('manual');
              setIsPlaying(false);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              controlMode === 'FK' && activeTask === 'manual'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Kinematika Maju (FK)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive Canvas Area */}
        <div className="lg:col-span-8 flex flex-col">
          <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-[#090d16] flex items-center justify-center">
            <canvas
              ref={canvasRef}
              width={480}
              height={360}
              className="cursor-crosshair max-w-full h-auto"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            />

            {/* In-canvas overlay badge */}
            <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-slate-300 font-mono">
                EE: ({Math.round(joints.ee.x)}, {Math.round(joints.ee.y)})
              </span>
              <span className="text-slate-500">|</span>
              <span className="text-cyan-400 font-mono">
                Target: ({target.x}, {target.y})
              </span>
            </div>

            {/* Singularity Warning HUD */}
            {isNearSingularity && (
              <div className="absolute bottom-4 left-4 bg-amber-500/20 border border-amber-500/40 text-amber-300 px-3 py-1.5 rounded-lg text-xs flex items-center gap-2 backdrop-blur-md animate-bounce">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Zona Singularitas Terdeteksi: det(J) mendekati 0!</span>
              </div>
            )}

            <div className="absolute bottom-4 right-4 text-[11px] text-slate-400 bg-slate-950/70 px-2 py-1 rounded border border-slate-800 pointer-events-none">
              Klik / Seret Target Biru di Ruang Kerja
            </div>
          </div>

          {/* Quick Preset Routine Controls */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" /> Rutinitas Otomatis:
              </span>
              <button
                onClick={() => {
                  setActiveTask('pickAndPlace');
                  setControlMode('IK');
                  setIsPlaying(true);
                  setTaskStep(0);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  activeTask === 'pickAndPlace' && isPlaying
                    ? 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                Pick & Place (Ambil Benda)
              </button>
              <button
                onClick={() => {
                  setActiveTask('arcWeld');
                  setControlMode('IK');
                  setIsPlaying(true);
                  setTaskStep(0);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  activeTask === 'arcWeld' && isPlaying
                    ? 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                Pengelasan Busur (Arc Welding)
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                title={isPlaying ? 'Jeda' : 'Jalankan'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-emerald-400" />}
              </button>
              <button
                onClick={() => {
                  setIsPlaying(false);
                  setActiveTask('manual');
                  setControlMode('IK');
                  setTarget({ x: 340, y: 190 });
                  setPayload({ x: 120, y: 330, placed: false });
                  setPayloadAttached(false);
                  setGripperClosed(false);
                }}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                title="Reset Posisi Awal"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Telemetry and Controls Panel */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Real-time Telemetry Card */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2 mb-3">
              <Activity className="w-4 h-4 text-cyan-400" /> Telemetri & Analisis Dinamik
            </h4>

            <div className="space-y-2.5 text-xs font-mono">
              <div className="flex justify-between items-center py-1 border-b border-slate-900">
                <span className="text-slate-400">Deviasi Target (Error):</span>
                <span className={`font-semibold ${distToTarget < 5 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {distToTarget} px {distToTarget < 5 ? '✓ Tercapai' : ''}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-900">
                <span className="text-slate-400">Determinan Jacobian |sin(θ₂)|:</span>
                <span className={`font-semibold ${isNearSingularity ? 'text-red-400' : 'text-cyan-400'}`}>
                  {jacobianSingularity.toFixed(3)}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-900">
                <span className="text-slate-400">Torsi Motor Sendi 1:</span>
                <span className="text-slate-200 font-semibold">{torque1} Nm</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-900">
                <span className="text-slate-400">Torsi Motor Sendi 2:</span>
                <span className="text-slate-200 font-semibold">{torque2} Nm</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-400">Status Gripper / Cengkeram:</span>
                <span className={`font-semibold ${gripperClosed ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {gripperClosed ? 'Tutup (Menjepit)' : 'Buka'}
                </span>
              </div>
            </div>

            {/* Gripper toggle button */}
            <button
              onClick={() => {
                const nextState = !gripperClosed;
                setGripperClosed(nextState);
                if (!nextState) setPayloadAttached(false);
              }}
              className={`w-full mt-3 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-2 ${
                gripperClosed
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              {gripperClosed ? 'Buka Capit Gripper' : 'Tutup Capit Gripper'}
            </button>
          </div>

          {/* Manual Joint Sliders (Active in FK mode) */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" /> Sudut Sendi (Joint Articulation)
              </h4>
              <span className="text-[10px] text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                {controlMode}
              </span>
            </div>

            {/* Slider 1 */}
            <div className="space-y-1 mb-3">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Sendi 1 (Basis / Bahu θ₁):</span>
                <span className="text-cyan-400 font-mono">{theta1}°</span>
              </div>
              <input
                type="range"
                min={-30}
                max={150}
                value={theta1}
                disabled={controlMode === 'IK'}
                onChange={(e) => {
                  setTheta1(Number(e.target.value));
                }}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 disabled:opacity-50"
              />
            </div>

            {/* Slider 2 */}
            <div className="space-y-1 mb-3">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Sendi 2 (Siku θ₂):</span>
                <span className="text-cyan-400 font-mono">{theta2}°</span>
              </div>
              <input
                type="range"
                min={-160}
                max={20}
                value={theta2}
                disabled={controlMode === 'IK'}
                onChange={(e) => {
                  setTheta2(Number(e.target.value));
                }}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 disabled:opacity-50"
              />
            </div>

            {/* Slider 3 */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Sendi 3 (Pergelangan θ₃):</span>
                <span className="text-cyan-400 font-mono">{theta3}°</span>
              </div>
              <input
                type="range"
                min={-90}
                max={90}
                value={theta3}
                disabled={controlMode === 'IK'}
                onChange={(e) => {
                  setTheta3(Number(e.target.value));
                }}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 disabled:opacity-50"
              />
            </div>

            {controlMode === 'IK' && (
              <p className="text-[11px] text-slate-500 mt-3 italic">
                *Slider dinonaktifkan di mode IK karena sudut sendi dihitung otomatis oleh trigonometri invers analitis saat target digeser.
              </p>
            )}
          </div>

          {/* Quick learning takeaway */}
          <div className="bg-cyan-950/20 border border-cyan-800/30 p-3 rounded-xl text-xs text-slate-300">
            <span className="font-semibold text-cyan-300 block mb-1">Konsep Robotika:</span>
            Kinematika Terbalik (IK) memecahkan teka-teki: &quot;Berapa sudut masing-masing sendi agar ujung tangan robot berada di koordinat (X, Y)?&quot;.
          </div>
        </div>
      </div>
    </div>
  );
};
