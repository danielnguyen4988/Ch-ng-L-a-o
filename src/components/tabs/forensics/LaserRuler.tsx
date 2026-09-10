import React from 'react';
import { Ruler, ArrowUp, ArrowDown } from 'lucide-react';

interface LaserRulerProps {
  yPercent: number;
  onYPercentChange: (val: number) => void;
  tiltAngle: number;
  onTiltAngleChange: (angle: number) => void;
  isActive: boolean;
  onToggleActive: () => void;
  isAiEditedSample?: boolean;
}

export const LaserRuler: React.FC<LaserRulerProps> = ({
  yPercent,
  onYPercentChange,
  tiltAngle,
  onTiltAngleChange,
  isActive,
  onToggleActive,
  isAiEditedSample,
}) => {
  if (!isActive) {
    return (
      <button
        onClick={onToggleActive}
        className="px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-teal-400 border border-teal-500/30 text-xs transition-all cursor-pointer shadow-sm"
        title="Bật thước laser đo độ lệch trục chân chữ (Baseline Alignment)"
      >
        <Ruler className="w-3.5 h-3.5" />
        <span>Bật Thước Laser Baseline</span>
      </button>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2 bg-slate-950 p-2 rounded-xl border border-teal-500/40 text-xs">
      <div className="flex items-center gap-1 text-teal-400 font-mono font-bold">
        <Ruler className="w-4 h-4" />
        <span>THƯỚC LASER ĐO BASELINE:</span>
      </div>

      {/* Position controls */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onYPercentChange(Math.max(5, yPercent - 0.5))}
          className="p-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-200 cursor-pointer"
          title="Nâng thước lên"
        >
          <ArrowUp className="w-3 h-3" />
        </button>
        <span className="font-mono text-slate-300 px-1.5">{yPercent.toFixed(1)}%</span>
        <button
          onClick={() => onYPercentChange(Math.min(95, yPercent + 0.5))}
          className="p-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-200 cursor-pointer"
          title="Hạ thước xuống"
        >
          <ArrowDown className="w-3 h-3" />
        </button>
      </div>

      {/* Tilt Angle */}
      <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-400 pl-2 border-l border-slate-800">
        <span>Góc nghiêng:</span>
        <button
          onClick={() => onTiltAngleChange(tiltAngle - 0.2)}
          className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-300 hover:bg-slate-700"
        >
          -
        </button>
        <span className={tiltAngle !== 0 ? 'text-amber-400 font-bold' : 'text-slate-300'}>
          {tiltAngle > 0 ? `+${tiltAngle.toFixed(1)}°` : `${tiltAngle.toFixed(1)}°`}
        </span>
        <button
          onClick={() => onTiltAngleChange(tiltAngle + 0.2)}
          className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-300 hover:bg-slate-700"
        >
          +
        </button>
        <button
          onClick={() => onTiltAngleChange(0)}
          className="text-[10px] text-slate-500 hover:text-slate-300 underline"
        >
          Reset 0°
        </button>
      </div>

      {/* Verdict badge */}
      {isAiEditedSample && tiltAngle !== 0 ? (
        <span className="text-[10px] bg-red-500/20 text-red-300 border border-red-500/30 px-2 py-0.5 rounded font-mono">
          ⚠️ Phát hiện số "5" lệch baseline 1.9px so với số "0"
        </span>
      ) : (
        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-mono">
          ✅ Baseline thẳng hàng chuẩn (Sai số 0.0px)
        </span>
      )}

      <button
        onClick={onToggleActive}
        className="ml-auto text-[11px] text-slate-400 hover:text-red-400 cursor-pointer px-2"
      >
        Tắt Thước
      </button>
    </div>
  );
};
