import React, { useState, useEffect, useRef } from 'react';
import { Eye, Filter, Cpu, Sliders, ShieldCheck, Zap, Info, Scan } from 'lucide-react';

type Scenario = 'warehouse' | 'autonomousCar' | 'robotArm';
type FilterMode = 'raw' | 'grayscale' | 'sobel' | 'heatmap' | 'depth';

interface DetectedObject {
  id: string;
  label: string;
  box: { x: number; y: number; w: number; h: number };
  confidence: number;
  depthMeters: number;
  color: string;
}

export const VisionAISimulator: React.FC = () => {
  const [scenario, setScenario] = useState<Scenario>('warehouse');
  const [activeFilter, setActiveFilter] = useState<FilterMode>('raw');
  const [showBoundingBoxes, setShowBoundingBoxes] = useState<boolean>(true);
  const [showDepthOverlay, setShowDepthOverlay] = useState<boolean>(false);
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(0.75);
  const [noiseLevel, setNoiseLevel] = useState<number>(0);
  const [inferenceFps, setInferenceFps] = useState<number>(58);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Scenarios objects dataset
  const scenarioData: Record<Scenario, { name: string; objects: DetectedObject[] }> = {
    warehouse: {
      name: 'Gudang Logistik Otomatis (Warehouse AGV)',
      objects: [
        { id: '1', label: 'Kotak Palet Rapuh', box: { x: 70, y: 150, w: 90, h: 100 }, confidence: 0.96, depthMeters: 1.8, color: '#38bdf8' },
        { id: '2', label: 'Pekerja Manusia', box: { x: 230, y: 90, w: 60, h: 160 }, confidence: 0.94, depthMeters: 3.2, color: '#f43f5e' },
        { id: '3', label: 'Robot AGV Otonom', box: { x: 330, y: 170, w: 110, h: 90 }, confidence: 0.89, depthMeters: 2.5, color: '#eab308' },
        { id: '4', label: 'Rambu Keselamatan', box: { x: 180, y: 50, w: 35, h: 35 }, confidence: 0.72, depthMeters: 4.5, color: '#10b981' }
      ]
    },
    autonomousCar: {
      name: 'Jalan Raya Kendaraan Otonom (Autonomous Highway)',
      objects: [
        { id: '1', label: 'Mobil di Depan', box: { x: 190, y: 120, w: 100, h: 70 }, confidence: 0.98, depthMeters: 8.4, color: '#38bdf8' },
        { id: '2', label: 'Truk Kontainer Kiri', box: { x: 40, y: 80, w: 110, h: 140 }, confidence: 0.95, depthMeters: 12.1, color: '#eab308' },
        { id: '3', label: 'Pejalan Kaki Seberang', box: { x: 340, y: 115, w: 30, h: 65 }, confidence: 0.82, depthMeters: 15.0, color: '#f43f5e' },
        { id: '4', label: 'Marka Garis Putus', box: { x: 210, y: 220, w: 60, h: 40 }, confidence: 0.68, depthMeters: 4.0, color: '#a855f7' }
      ]
    },
    robotArm: {
      name: 'Stasiun Perakitan Lengan Presisi (Assembly Workbench)',
      objects: [
        { id: '1', label: 'Baut M6 Baja', box: { x: 110, y: 170, w: 45, h: 35 }, confidence: 0.97, depthMeters: 0.35, color: '#38bdf8' },
        { id: '2', label: 'Papan PCB Hijau', box: { x: 190, y: 140, w: 120, h: 90 }, confidence: 0.99, depthMeters: 0.38, color: '#10b981' },
        { id: '3', label: 'Soket Konektor', box: { x: 235, y: 165, w: 35, h: 30 }, confidence: 0.91, depthMeters: 0.37, color: '#eab308' },
        { id: '4', label: 'Kabel Pita Fleksibel', box: { x: 340, y: 160, w: 70, h: 45 }, confidence: 0.74, depthMeters: 0.42, color: '#f43f5e' }
      ]
    }
  };

  const currentObjects = scenarioData[scenario].objects;
  const filteredObjects = currentObjects.filter((obj) => obj.confidence >= confidenceThreshold);

  // Slight jitter for realistic real-time FPS
  useEffect(() => {
    const timer = setInterval(() => {
      setInferenceFps(Math.round(55 + Math.random() * 6));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Draw scene & filter pipeline on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Draw base synthetic scenario background
    if (scenario === 'warehouse') {
      // Warehouse floors & walls
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grad.addColorStop(0, '#0c1524');
      grad.addColorStop(0.6, '#17223b');
      grad.addColorStop(1, '#0f172a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Shelves in background
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(20, 40, 120, 160);
      ctx.fillRect(340, 40, 120, 160);
      // Shelf beams
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(18, 90, 124, 6);
      ctx.fillRect(18, 140, 124, 6);
      ctx.fillRect(338, 90, 124, 6);
      ctx.fillRect(338, 140, 124, 6);

      // Floor tiles perspective lines
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(240, 130);
      ctx.lineTo(40, 320);
      ctx.moveTo(240, 130);
      ctx.lineTo(440, 320);
      ctx.moveTo(240, 130);
      ctx.lineTo(240, 320);
      ctx.stroke();

      // Render items
      // Box
      ctx.fillStyle = '#b45309';
      ctx.fillRect(75, 155, 80, 90);
      ctx.strokeStyle = '#d97706';
      ctx.strokeRect(75, 155, 80, 90);
      // Tape
      ctx.fillStyle = '#fef3c7';
      ctx.fillRect(110, 155, 10, 90);

      // Human
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(260, 110, 14, 0, Math.PI * 2); // Head
      ctx.fill();
      ctx.fillStyle = '#fbbf24'; // Vest
      ctx.fillRect(245, 126, 30, 60);
      ctx.fillStyle = '#1e293b'; // Pants
      ctx.fillRect(245, 186, 14, 60);
      ctx.fillRect(261, 186, 14, 60);

      // AGV Robot
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(335, 180, 100, 50);
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(350, 165, 70, 15);
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(385, 160, 6, 0, Math.PI * 2); // Beacon
      ctx.fill();
    } else if (scenario === 'autonomousCar') {
      // Highway horizon
      const skyGrad = ctx.createLinearGradient(0, 0, 0, 140);
      skyGrad.addColorStop(0, '#020617');
      skyGrad.addColorStop(1, '#1e293b');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, canvas.width, 140);

      // Road
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 140, canvas.width, canvas.height - 140);

      // Road lanes
      ctx.strokeStyle = '#e2e8f0';
      ctx.setLineDash([20, 15]);
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(240, 140);
      ctx.lineTo(240, 320);
      ctx.stroke();
      ctx.setLineDash([]);

      // Car in front
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(195, 130, 90, 50);
      ctx.fillStyle = '#000000';
      ctx.fillRect(205, 175, 18, 10);
      ctx.fillRect(257, 175, 18, 10);
      // Tail lights
      ctx.fillStyle = '#f87171';
      ctx.fillRect(200, 145, 15, 8);
      ctx.fillRect(265, 145, 15, 8);

      // Truck left
      ctx.fillStyle = '#2563eb';
      ctx.fillRect(45, 90, 100, 125);
    } else {
      // Robot arm workbench
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Workbench surface
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(40, 80, 400, 200);
      ctx.strokeStyle = '#475569';
      ctx.strokeRect(40, 80, 400, 200);

      // PCB board
      ctx.fillStyle = '#065f46';
      ctx.fillRect(195, 145, 110, 80);
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(210, 160, 25, 25); // Chip
      ctx.fillRect(250, 160, 35, 15);

      // Screws
      ctx.fillStyle = '#94a3b8';
      ctx.beginPath();
      ctx.arc(125, 185, 12, 0, Math.PI * 2);
      ctx.fill();
    }

    // 2. Apply Filters (Grayscale, Sobel edge, Heatmap, Depth)
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;
    const w = canvas.width;
    const h = canvas.height;

    if (activeFilter === 'grayscale') {
      for (let i = 0; i < data.length; i += 4) {
        const avg = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        data[i] = avg;
        data[i + 1] = avg;
        data[i + 2] = avg;
      }
      ctx.putImageData(imgData, 0, 0);
    } else if (activeFilter === 'sobel') {
      // 3x3 Sobel gradient simulation
      const copy = new Uint8ClampedArray(data);
      for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
          const idx = (y * w + x) * 4;
          // horizontal gradient Gx
          const left = (y * w + (x - 1)) * 4;
          const right = (y * w + (x + 1)) * 4;
          const top = ((y - 1) * w + x) * 4;
          const bottom = ((y + 1) * w + x) * 4;

          const gx = copy[right] - copy[left];
          const gy = copy[bottom] - copy[top];
          const edge = Math.min(255, Math.abs(gx) + Math.abs(gy)) * 2;

          data[idx] = edge > 60 ? 56 : 5;      // Cyan edge tint
          data[idx + 1] = edge > 60 ? 189 : 10;
          data[idx + 2] = edge > 60 ? 248 : 20;
        }
      }
      ctx.putImageData(imgData, 0, 0);
    } else if (activeFilter === 'heatmap') {
      // Feature activation map overlay
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const idx = (y * w + x) * 4;
          // Calculate distance to detected objects center
          let minDist = 999;
          filteredObjects.forEach((obj) => {
            const cx = obj.box.x + obj.box.w / 2;
            const cy = obj.box.y + obj.box.h / 2;
            const d = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
            if (d < minDist) minDist = d;
          });

          const heat = Math.max(0, 1 - minDist / 100);
          data[idx] = Math.min(255, data[idx] * 0.4 + heat * 255);
          data[idx + 1] = Math.min(255, data[idx + 1] * 0.4 + (1 - heat) * heat * 180);
          data[idx + 2] = Math.min(255, data[idx + 2] * 0.4);
        }
      }
      ctx.putImageData(imgData, 0, 0);
    } else if (activeFilter === 'depth' || showDepthOverlay) {
      // Depth estimation color mapping (near = red/amber, far = deep blue)
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const idx = (y * w + x) * 4;
          const depthRatio = y / h; // Perspective depth
          const r = Math.floor(depthRatio * 200);
          const g = Math.floor((1 - Math.abs(depthRatio - 0.5) * 2) * 150);
          const b = Math.floor((1 - depthRatio) * 220);

          data[idx] = (data[idx] * 0.3) + (r * 0.7);
          data[idx + 1] = (data[idx + 1] * 0.3) + (g * 0.7);
          data[idx + 2] = (data[idx + 2] * 0.3) + (b * 0.7);
        }
      }
      ctx.putImageData(imgData, 0, 0);
    }

    // 3. Add noise/blur if slider > 0
    if (noiseLevel > 0) {
      const noisyImg = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const ndata = noisyImg.data;
      for (let i = 0; i < ndata.length; i += 4) {
        if (Math.random() < noiseLevel / 100) {
          const noise = Math.random() * 255;
          ndata[i] = noise;
          ndata[i + 1] = noise;
          ndata[i + 2] = noise;
        }
      }
      ctx.putImageData(noisyImg, 0, 0);
    }

    // 4. Draw YOLO Bounding Boxes & Confidence tags
    if (showBoundingBoxes) {
      filteredObjects.forEach((obj) => {
        const { x, y, w, h } = obj.box;

        ctx.strokeStyle = obj.color;
        ctx.lineWidth = 2;
        ctx.setLineDash([]);
        ctx.strokeRect(x, y, w, h);

        // Corner accents for futuristic HUD
        const cornerSize = 8;
        ctx.lineWidth = 3;
        // Top-left
        ctx.beginPath();
        ctx.moveTo(x, y + cornerSize);
        ctx.lineTo(x, y);
        ctx.lineTo(x + cornerSize, y);
        ctx.stroke();
        // Top-right
        ctx.beginPath();
        ctx.moveTo(x + w - cornerSize, y);
        ctx.lineTo(x + w, y);
        ctx.lineTo(x + w, y + cornerSize);
        ctx.stroke();

        // Label tag
        const tagText = `${obj.label} ${(obj.confidence * 100).toFixed(0)}% [${obj.depthMeters}m]`;
        ctx.font = 'bold 10px monospace';
        const textWidth = ctx.measureText(tagText).width;

        ctx.fillStyle = obj.color;
        ctx.fillRect(x, Math.max(0, y - 18), textWidth + 8, 18);

        ctx.fillStyle = '#090d16';
        ctx.fillText(tagText, x + 4, Math.max(12, y - 5));
      });
    }

    // Target crosshair in center
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(w / 2 - 15, h / 2);
    ctx.lineTo(w / 2 + 15, h / 2);
    ctx.moveTo(w / 2, h / 2 - 15);
    ctx.lineTo(w / 2, h / 2 + 15);
    ctx.stroke();
  }, [scenario, activeFilter, showBoundingBoxes, showDepthOverlay, filteredObjects, noiseLevel]);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-pink-500/10 text-pink-400">
              <Eye className="w-5 h-5" />
            </span>
            <h3 className="text-xl font-bold text-white tracking-wide">
              Lab Visi AI & Persepsi Sensorik Robot
            </h3>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Simulasi bagaimana model neural network mengekstrak fitur spasial, konvolusi Sobel, deteksi objek YOLO, dan estimasi kedalaman 3D.
          </p>
        </div>

        {/* Scenario Selector */}
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400 px-2 font-medium">Skenario:</span>
          {(['warehouse', 'autonomousCar', 'robotArm'] as Scenario[]).map((s) => (
            <button
              key={s}
              onClick={() => setScenario(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                scenario === s
                  ? 'bg-pink-500 text-slate-950 shadow-md shadow-pink-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {s === 'warehouse' ? 'Gudang AGV' : s === 'autonomousCar' ? 'Mobil Otonom' : 'Perakitan Robotik'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Canvas Display */}
        <div className="lg:col-span-8 flex flex-col">
          <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-[#090d16] flex items-center justify-center">
            <canvas ref={canvasRef} width={480} height={320} className="max-w-full h-auto" />

            {/* Live Camera HUD Telemetry */}
            <div className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-pink-400 font-mono">
                <Scan className="w-3.5 h-3.5 animate-pulse" /> REC RGB-D
              </span>
              <span className="text-slate-400 font-mono">{inferenceFps} FPS</span>
              <span className="text-slate-500">|</span>
              <span className="text-emerald-400 font-mono">
                {filteredObjects.length} Objek Terdeteksi
              </span>
            </div>

            {/* Filter Indicator Badge */}
            <div className="absolute top-3 right-3 bg-slate-950/85 backdrop-blur-md px-2.5 py-1 rounded border border-slate-800 text-[11px] text-slate-300 font-mono uppercase">
              Filter: {activeFilter}
            </div>

            {/* Active scene label */}
            <div className="absolute bottom-3 left-3 text-[11px] text-slate-400 bg-slate-950/80 px-2.5 py-1 rounded border border-slate-800">
              {scenarioData[scenario].name}
            </div>
          </div>

          {/* Filter Pipeline Toggle Bar */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 mr-1">
                <Filter className="w-3.5 h-3.5 text-pink-400" /> Pipeline Visi:
              </span>
              {[
                { id: 'raw', label: '1. Sensor Asli (RGB)' },
                { id: 'grayscale', label: '2. Grayscale' },
                { id: 'sobel', label: '3. Deteksi Tepi Sobel' },
                { id: 'heatmap', label: '4. Atensi Spasial' },
                { id: 'depth', label: '5. Estimasi Jarak 3D' }
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id as FilterMode)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                    activeFilter === f.id
                      ? 'bg-pink-500/20 border-pink-500/50 text-pink-300 shadow-sm'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Neural Network Hyperparameters & Detections */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Controls Card */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2 mb-3">
              <Sliders className="w-4 h-4 text-pink-400" /> Parameter Model Inferensi
            </h4>

            {/* Confidence Slider */}
            <div className="space-y-1 mb-4">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Ambang Keyakinan (Confidence):</span>
                <span className="text-pink-400 font-mono">{(confidenceThreshold * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min={0.5}
                max={0.98}
                step={0.01}
                value={confidenceThreshold}
                onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-pink-400"
              />
              <span className="text-[10px] text-slate-500">
                Nilai lebih tinggi mengurangi false positive (deteksi keliru).
              </span>
            </div>

            {/* Noise / Blur Simulator */}
            <div className="space-y-1 mb-4">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Gangguan Kabut / Noise Sensor:</span>
                <span className="text-yellow-400 font-mono">{noiseLevel}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={40}
                value={noiseLevel}
                onChange={(e) => setNoiseLevel(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-yellow-400"
              />
            </div>

            {/* Toggle bounding boxes */}
            <div className="pt-2 border-t border-slate-900 flex items-center justify-between">
              <span className="text-xs text-slate-300">Tampilkan Kotak Bounding YOLO:</span>
              <button
                onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
                className={`px-3 py-1 rounded text-xs font-semibold ${
                  showBoundingBoxes
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {showBoundingBoxes ? 'Aktif' : 'Nonaktif'}
              </button>
            </div>
          </div>

          {/* Detections List */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between mb-3">
              <span className="flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-cyan-400" /> Hasil Klasifikasi Spasial
              </span>
              <span className="text-[11px] font-mono text-cyan-400">
                {filteredObjects.length} / {currentObjects.length}
              </span>
            </h4>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {filteredObjects.map((obj) => (
                <div
                  key={obj.id}
                  className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 text-xs flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: obj.color }} />
                    <span className="text-slate-200 font-medium">{obj.label}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-pink-400 font-semibold">{(obj.confidence * 100).toFixed(0)}%</span>
                    <span className="text-slate-500">|</span>
                    <span className="text-emerald-400">{obj.depthMeters} m</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 pt-3 border-t border-slate-900 text-[11px] text-slate-400 flex items-start gap-2">
              <Info className="w-3.5 h-3.5 text-pink-400 shrink-0 mt-0.5" />
              <span>
                Algoritma menggabungkan pemindaian konvolusi kedalaman (Depth-wise Separable Convolutions) untuk menentukan koordinat navigasi robotik.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
