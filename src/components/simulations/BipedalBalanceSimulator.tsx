import React, { useState, useEffect, useRef } from 'react';
import { Shield, RefreshCw, Activity, Zap, Play, Pause, AlertOctagon } from 'lucide-react';

export const BipedalBalanceSimulator: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // PID Parameters
  const [kp, setKp] = useState<number>(45); // Proportional
  const [ki, setKi] = useState<number>(0.8); // Integral
  const [kd, setKd] = useState<number>(14); // Derivative

  // Physics state
  const [theta, setTheta] = useState<number>(0); // Angle in radians
  const [thetaDot, setThetaDot] = useState<number>(0); // Angular velocity
  const [integralErr, setIntegralErr] = useState<number>(0);
  const [appliedForce, setAppliedForce] = useState<number>(0);
  const [isFallen, setIsFallen] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(true);

  // Real-time oscillation history for chart
  const historyRef = useRef<number[]>(new Array(100).fill(0));

  // Presets
  const applyPreset = (type: 'ideal' | 'oscillate' | 'stiff' | 'weak') => {
    if (type === 'ideal') {
      setKp(48);
      setKi(0.5);
      setKd(16);
    } else if (type === 'oscillate') {
      setKp(80);
      setKi(0.1);
      setKd(2);
    } else if (type === 'stiff') {
      setKp(30);
      setKi(0.1);
      setKd(35);
    } else {
      setKp(10);
      setKi(0);
      setKd(1);
    }
    // Give a slight nudge to demonstrate
    setTheta(0.15);
    setThetaDot(0);
    setIntegralErr(0);
    setIsFallen(false);
  };

  // Push disturbance
  const triggerDisturbance = (magnitude: number) => {
    setThetaDot((prev) => prev + magnitude);
    setAppliedForce(magnitude * 100);
    setTimeout(() => setAppliedForce(0), 200);
  };

  // Physics Integration Loop
  useEffect(() => {
    if (!isRunning) return;

    const dt = 0.03; // 30ms time step
    const g = 9.81;
    const L = 1.0; // Inverted pendulum length (meters)
    const m = 50; // Mass (kg)

    const interval = setInterval(() => {
      setTheta((curTheta) => {
        // Fall threshold: |theta| > 60 degrees (1.05 rad)
        if (Math.abs(curTheta) > 1.05) {
          setIsFallen(true);
          return curTheta;
        }

        // PID calculation
        const error = -curTheta; // Want theta = 0
        const pTerm = kp * error;

        let nextIntegral = integralErr + error * dt;
        // Clamp anti-windup
        nextIntegral = Math.max(-5, Math.min(5, nextIntegral));
        setIntegralErr(nextIntegral);
        const iTerm = ki * nextIntegral;

        const dTerm = -kd * thetaDot; // derivative of error = -thetaDot

        const restoringTorque = pTerm + iTerm + dTerm;

        // Dynamics: theta'' = (g / L) * sin(theta) + restoringTorque / (m * L^2) - damping
        const angularAccel = (g / L) * Math.sin(curTheta) + restoringTorque / (m * L * L) - thetaDot * 0.2;

        const nextThetaDot = thetaDot + angularAccel * dt;
        setThetaDot(nextThetaDot);

        const nextTheta = curTheta + nextThetaDot * dt;

        // Record history for graph
        historyRef.current.shift();
        historyRef.current.push(nextTheta * (180 / Math.PI));

        return nextTheta;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [isRunning, kp, ki, kd, thetaDot, integralErr]);

  // Render Humanoid Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const baseCenterX = 180;
    const baseCenterY = 250;
    const pendulumLen = 140;

    // Floor
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(30, baseCenterY + 15);
    ctx.lineTo(canvas.width - 30, baseCenterY + 15);
    ctx.stroke();

    // Foot Support Polygon
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(baseCenterX - 35, baseCenterY + 5, 70, 10);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(baseCenterX - 35, baseCenterY + 5, 70, 10);

    // Support Polygon limits
    ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
    ctx.fillRect(baseCenterX - 35, 0, 70, baseCenterY + 5);

    // Humanoid Torso / Pendulum Rod
    const torsoX = baseCenterX + pendulumLen * Math.sin(theta);
    const torsoY = baseCenterY - pendulumLen * Math.cos(theta);

    // Pelvis pivot joint
    ctx.beginPath();
    ctx.arc(baseCenterX, baseCenterY, 12, 0, Math.PI * 2);
    ctx.fillStyle = '#1e293b';
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Legs / Backbone
    ctx.lineWidth = 8;
    ctx.strokeStyle = '#0284c7';
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(baseCenterX, baseCenterY);
    ctx.lineTo(torsoX, torsoY);
    ctx.stroke();

    // Center of Mass (CoM) Torso Body
    ctx.save();
    ctx.translate(torsoX, torsoY);
    ctx.rotate(theta);

    // Torso block
    ctx.fillStyle = isFallen ? '#ef4444' : '#0369a1';
    ctx.fillRect(-22, -35, 44, 40);
    ctx.strokeStyle = isFallen ? '#f87171' : '#38bdf8';
    ctx.lineWidth = 2;
    ctx.strokeRect(-22, -35, 44, 40);

    // Head
    ctx.beginPath();
    ctx.arc(0, -50, 12, 0, Math.PI * 2);
    ctx.fillStyle = '#38bdf8';
    ctx.fill();

    // Visual visor
    ctx.fillStyle = '#090d16';
    ctx.fillRect(-8, -54, 16, 5);

    ctx.restore();

    // CoM projection line (Gravity vector)
    ctx.strokeStyle = isFallen ? 'rgba(239, 68, 68, 0.6)' : 'rgba(16, 185, 129, 0.6)';
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(torsoX, torsoY);
    ctx.lineTo(torsoX, baseCenterY + 15);
    ctx.stroke();
    ctx.setLineDash([]);

    // CoM ground marker
    ctx.fillStyle = isFallen ? '#ef4444' : '#10b981';
    ctx.beginPath();
    ctx.arc(torsoX, baseCenterY + 15, 4, 0, Math.PI * 2);
    ctx.fill();

    // Push force arrow if active
    if (appliedForce !== 0) {
      ctx.save();
      ctx.strokeStyle = '#f59e0b';
      ctx.fillStyle = '#f59e0b';
      ctx.lineWidth = 3;
      const arrowDir = appliedForce > 0 ? 1 : -1;
      const startX = torsoX - arrowDir * 60;
      ctx.beginPath();
      ctx.moveTo(startX, torsoY);
      ctx.lineTo(torsoX - arrowDir * 10, torsoY);
      ctx.stroke();
      // Arrowhead
      ctx.beginPath();
      ctx.moveTo(torsoX, torsoY);
      ctx.lineTo(torsoX - arrowDir * 14, torsoY - 8);
      ctx.lineTo(torsoX - arrowDir * 14, torsoY + 8);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  }, [theta, isFallen, appliedForce]);

  // Render Real-time Oscillation Chart
  useEffect(() => {
    const canvas = chartCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const w = canvas.width;
    const h = canvas.height;
    const midY = h / 2;

    // Grid lines
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, midY);
    ctx.lineTo(w, midY);
    ctx.stroke();

    // 0 degree zero reference line
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
    ctx.setLineDash([3, 3]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Plot angular error history
    const history = historyRef.current;
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < history.length; i++) {
      const x = (i / (history.length - 1)) * w;
      // Scale: 30 deg = midY
      const y = midY - (history[i] / 30) * (midY - 10);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }, [theta]);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Shield className="w-5 h-5" />
            </span>
            <h3 className="text-xl font-bold text-white tracking-wide">
              Simulasi Keseimbangan Humanoid & Kontroler PID
            </h3>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Uji respons kontroler Proportional-Integral-Derivative pada pendulum terbalik robot humanoid saat menahan gaya dorong eksternal.
          </p>
        </div>

        {/* Quick Tuning Presets */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 flex-wrap">
          <span className="text-xs text-slate-400 px-1 font-medium">Preset:</span>
          <button
            onClick={() => applyPreset('ideal')}
            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30"
          >
            Stabil Ideal
          </button>
          <button
            onClick={() => applyPreset('oscillate')}
            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 hover:bg-yellow-500/30"
          >
            Osilasi Liar
          </button>
          <button
            onClick={() => applyPreset('stiff')}
            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white"
          >
            Kaku (Overdamped)
          </button>
          <button
            onClick={() => applyPreset('weak')}
            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-red-500/20 text-red-300 border border-red-500/40 hover:bg-red-500/30"
          >
            Lemah (Roboh)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Visual Simulation Canvas */}
        <div className="lg:col-span-6 flex flex-col">
          <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-[#090d16] flex items-center justify-center p-2">
            <canvas ref={canvasRef} width={360} height={290} className="max-w-full h-auto" />

            {/* Fallen alert */}
            {isFallen && (
              <div className="absolute inset-0 bg-red-950/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-4">
                <AlertOctagon className="w-10 h-10 text-red-400 mb-2 animate-bounce" />
                <h4 className="text-base font-bold text-white">Robot Kehilangan Keseimbangan!</h4>
                <p className="text-xs text-red-200 mt-1 max-w-xs">
                  Proyeksi Pusat Massa (CoM) keluar jauh dari batas poligon kaki.
                </p>
                <button
                  onClick={() => {
                    setTheta(0);
                    setThetaDot(0);
                    setIntegralErr(0);
                    setIsFallen(false);
                  }}
                  className="mt-3 px-4 py-1.5 rounded-lg bg-red-500 text-white text-xs font-bold shadow-lg hover:bg-red-600 flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Berdirikan Robot Kembali
                </button>
              </div>
            )}

            <div className="absolute top-3 left-3 bg-slate-950/80 px-2.5 py-1 rounded text-[11px] font-mono text-cyan-400 border border-slate-800">
              Sudut Miring: {((theta * 180) / Math.PI).toFixed(1)}°
            </div>
          </div>

          {/* Disturbance Push Buttons */}
          <div className="mt-3 bg-slate-950/70 p-3 rounded-xl border border-slate-800 flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-yellow-400" /> Beri Gaya Dorong:
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => triggerDisturbance(-0.35)}
                className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 text-xs font-mono font-medium"
              >
                ← Dorong Kiri (-35N)
              </button>
              <button
                onClick={() => triggerDisturbance(0.35)}
                className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 text-xs font-mono font-medium"
              >
                Dorong Kanan (+35N) →
              </button>
              <button
                onClick={() => triggerDisturbance(0.75)}
                className="px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 text-xs font-mono font-medium"
              >
                Tumbukan Kuat (+75N)
              </button>
            </div>
          </div>
        </div>

        {/* Real-time Oscillogram & PID Sliders */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          {/* Oscillogram Chart */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" /> Osilogram Sudut Miring Error θ(t)
              </h4>
              <span className="text-[10px] text-slate-500 font-mono">Rentang ±30°</span>
            </div>
            <div className="relative rounded-lg overflow-hidden border border-slate-900 bg-[#090d16] p-1">
              <canvas ref={chartCanvasRef} width={400} height={100} className="w-full h-auto" />
            </div>
          </div>

          {/* PID Gain Sliders */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Tuning Parameter PID (Kontrol Torsi)
            </h4>

            {/* Kp Slider */}
            <div className="space-y-1 mb-3">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Gain Proporsional (Kp):</span>
                <span className="text-cyan-400 font-mono">{kp}</span>
              </div>
              <input
                type="range"
                min={5}
                max={100}
                value={kp}
                onChange={(e) => setKp(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <span className="text-[10px] text-slate-500">
                Memberikan gaya pemulih sebanding dengan besar simpangan miring.
              </span>
            </div>

            {/* Ki Slider */}
            <div className="space-y-1 mb-3">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Gain Integral (Ki):</span>
                <span className="text-emerald-400 font-mono">{ki}</span>
              </div>
              <input
                type="range"
                min={0}
                max={3}
                step={0.1}
                value={ki}
                onChange={(e) => setKi(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
              <span className="text-[10px] text-slate-500">
                Menghapus offset kemiringan permanen (steady-state error).
              </span>
            </div>

            {/* Kd Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Gain Derivatif / Redaman (Kd):</span>
                <span className="text-yellow-400 font-mono">{kd}</span>
              </div>
              <input
                type="range"
                min={1}
                max={40}
                value={kd}
                onChange={(e) => setKd(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-yellow-400"
              />
              <span className="text-[10px] text-slate-500">
                Meredam osilasi liar dengan mengantisipasi laju perubahan sudut.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
