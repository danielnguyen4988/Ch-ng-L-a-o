import React, { useState } from 'react';
import { Split, ShieldCheck, AlertTriangle, ArrowRightLeft } from 'lucide-react';
import { BILL_TEMPLATES, BillTemplate } from '../../../data/billTemplates';

interface ComparisonSliderProps {
  currentImageSrc: string;
  currentLabel: string;
  initialBenchmarkId?: string;
}

export const ComparisonSlider: React.FC<ComparisonSliderProps> = ({
  currentImageSrc,
  currentLabel,
  initialBenchmarkId = 'techcombank_authentic',
}) => {
  // Available authentic ground-truth benchmark templates
  const authenticBenchmarks = BILL_TEMPLATES.filter((t) => t.type === 'authentic');

  // Benchmark selection state
  const [selectedBenchmarkId, setSelectedBenchmarkId] = useState<string>(() => {
    // If currentLabel has Techcombank, default to techcombank_authentic
    const lowerLabel = currentLabel.toLowerCase();
    if (lowerLabel.includes('tech') || lowerLabel.includes('v-green')) {
      return 'techcombank_authentic';
    }
    if (lowerLabel.includes('biz') || lowerLabel.includes('doanh nghiệp') || lowerLabel.includes('hto')) {
      return 'biz_mb_authentic';
    }
    if (lowerLabel.includes('mb')) {
      return 'mb_authentic';
    }
    const match = authenticBenchmarks.find((b) => b.id === initialBenchmarkId);
    return match ? match.id : authenticBenchmarks[0]?.id || 'techcombank_authentic';
  });

  const activeBenchmark: BillTemplate =
    authenticBenchmarks.find((b) => b.id === selectedBenchmarkId) || authenticBenchmarks[0];

  const benchmarkImageSrc = activeBenchmark.generateSvgDataUrl();

  const [sliderPos, setSliderPos] = useState<number>(50); // percentage 0 - 100

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPos(Number(e.target.value));
  };

  return (
    <div className="space-y-4 bg-slate-950 p-4 sm:p-5 rounded-2xl border border-teal-500/40 shadow-2xl">
      {/* HEADER & BENCHMARK SELECTOR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2 text-teal-400 font-bold text-sm">
            <Split className="w-5 h-5 text-teal-400" />
            <span>SO SÁNH ĐỐI CHIẾU A/B: BIÊN LAI THẬT CHUẨN VS ẢNH ĐANG SOI</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Kéo thanh trượt ngang để soi độ sai lệch font chữ, căn lề baseline và dải màu nền so với chuẩn gốc của ngân hàng.
          </p>
        </div>

        {/* BENCHMARK PICKER BUTTONS */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-bold text-slate-400 uppercase font-mono mr-1">Mẫu Chuẩn:</span>
          {authenticBenchmarks.map((bench) => {
            const isSelected = bench.id === selectedBenchmarkId;
            return (
              <button
                key={bench.id}
                onClick={() => setSelectedBenchmarkId(bench.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 border ${
                  isSelected
                    ? 'bg-teal-500 text-slate-950 border-teal-400 shadow-md font-black'
                    : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span>{bench.bankName}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* LEGEND BAR */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-slate-900/80 rounded-xl border border-slate-800 text-xs font-mono">
        <span className="text-emerald-400 flex items-center gap-1.5 font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>BÊN TRÁI: Chuẩn Thật 100% ({activeBenchmark.bankName})</span>
        </span>
        <span className="text-slate-500 hidden sm:inline">⇄</span>
        <span className="text-amber-400 flex items-center gap-1.5 font-bold">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>BÊN PHẢI: {currentLabel}</span>
        </span>
      </div>

      {/* COMPARISON VIEWPORT */}
      <div className="relative w-full max-w-lg mx-auto aspect-[3/4.6] max-h-[520px] rounded-xl overflow-hidden border border-slate-700 shadow-2xl select-none bg-slate-900">
        {/* Right side image: Current inspected image (user upload or chosen sample) */}
        <img
          src={currentImageSrc}
          alt={currentLabel}
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
        />

        {/* Left side image: Selected Authentic Benchmark with clipping */}
        <div
          style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
          className="absolute inset-0 w-full h-full pointer-events-none"
        >
          <img
            src={benchmarkImageSrc}
            alt={activeBenchmark.title}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Vertical divider line */}
        <div
          style={{ left: `${sliderPos}%` }}
          className="absolute top-0 bottom-0 w-0.5 bg-teal-400 shadow-[0_0_14px_rgba(45,212,191,1)] pointer-events-none"
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-teal-500 border-2 border-white shadow-2xl flex items-center justify-center text-slate-950 text-xs font-black">
            <ArrowRightLeft className="w-3.5 h-3.5 text-slate-950" />
          </div>
        </div>

        {/* Floating Badges */}
        <div className="absolute top-3 left-3 bg-emerald-950/95 text-emerald-300 border border-emerald-500/60 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold shadow-lg">
          CHUẨN THẬT: {activeBenchmark.bankName.toUpperCase()}
        </div>
        <div className="absolute top-3 right-3 bg-slate-950/95 text-amber-300 border border-amber-500/60 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold shadow-lg">
          {currentLabel.toUpperCase().slice(0, 26)}
        </div>
      </div>

      {/* Range Input slider */}
      <div className="max-w-lg mx-auto flex items-center gap-3 pt-1">
        <span className="text-xs text-emerald-400 font-bold font-mono whitespace-nowrap">
          100% {activeBenchmark.bankName.toUpperCase()} THẬT
        </span>
        <input
          type="range"
          min={0}
          max={100}
          value={sliderPos}
          onChange={handleSliderChange}
          className="flex-1 accent-teal-400 cursor-ew-resize h-2.5 bg-slate-800 rounded-lg"
        />
        <span className="text-xs text-amber-400 font-bold font-mono whitespace-nowrap">
          100% ẢNH ĐANG SOI
        </span>
      </div>

      <div className="text-[11px] text-slate-400 text-center font-mono bg-slate-900/50 p-2.5 rounded-lg border border-slate-800/80">
        💡 <span className="text-teal-300 font-semibold">Mẹo chuyên viên:</span> Khi soi bill Techcombank, chọn mẫu chuẩn <strong className="text-white">Techcombank</strong> để đối chiếu số tiền màu xanh và mã FT. Khi soi bill MB Doanh nghiệp, chọn mẫu chuẩn <strong className="text-white">BIZ MBBank</strong> để kiểm tra hóa đơn pháp nhân.
      </div>
    </div>
  );
};

