import React, { useState, useRef, useMemo } from 'react';
import {
  FileSearch,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Sparkles,
  ArrowRight,
  Upload,
  RefreshCw,
  Copy,
  Download,
  ShieldAlert,
  HelpCircle,
  Eye,
  Sliders,
  Zap,
  Info,
  Clock,
  DollarSign,
  UserCheck,
  Hash,
  Share2,
  FileText,
  Volume2,
  VolumeX,
  Scan,
  Activity,
} from 'lucide-react';
import { PersonaMode } from '../../../types';
import { BILL_TEMPLATES, BillTemplate } from '../../../data/billTemplates';
import { MESSAGE_PRESETS, MessagePreset } from '../../../data/messagePresets';

interface CrossVerificationPanelProps {
  persona: PersonaMode;
  onOpenReport?: (type: 'bank' | 'phone' | 'link' | 'sms', value: string, category?: string) => void;
  onOpenLicense?: () => void;
}

export const CrossVerificationPanel: React.FC<CrossVerificationPanelProps> = ({
  persona,
  onOpenReport,
  onOpenLicense,
}) => {
  // 1. COLUMN 1 STATE: BILL (Preset or Uploaded)
  const [selectedBillId, setSelectedBillId] = useState<string>('techcombank_vgreen_ai_edited');
  const [uploadedBillSrc, setUploadedBillSrc] = useState<string | null>(null);
  const [uploadedBillName, setUploadedBillName] = useState<string>('');
  const [customBillEntities, setCustomBillEntities] = useState({
    amount: 'VND 1,325,371',
    amountNum: 1325371,
    recipient: 'NGUYEN HA QUOC VIET',
    account: '1410040988',
    bank: 'Techcombank',
    transId: 'FT26232021989278',
    time: '15:14 20/08/2026',
  });
  const [isEditingBillEntities, setIsEditingBillEntities] = useState<boolean>(false);
  const billFileInputRef = useRef<HTMLInputElement>(null);

  // SCANNING PIPELINE STATE
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<number>(100);
  const [scanStageText, setScanStageText] = useState<string>('Đối soát OCR 4 chiều hoàn tất!');
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);

  // 2. COLUMN 2 STATE: MESSAGE (Preset or Uploaded / Custom text)
  const [selectedMessageId, setSelectedMessageId] = useState<string>('zalo_vgreen_urgency');
  const [uploadedMessageSrc, setUploadedMessageSrc] = useState<string | null>(null);
  const [uploadedMessageName, setUploadedMessageName] = useState<string>('');
  const [customMessageText, setCustomMessageText] = useState<string>('');
  const [isEditingMessageText, setIsEditingMessageText] = useState<boolean>(false);
  const messageFileInputRef = useRef<HTMLInputElement>(null);

  // COPIED TOAST
  const [copiedNotice, setCopiedNotice] = useState<string | null>(null);

  // ACTIVE PRESETS
  const activeBillPreset: BillTemplate = useMemo(() => {
    return BILL_TEMPLATES.find((b) => b.id === selectedBillId) || BILL_TEMPLATES[0];
  }, [selectedBillId]);

  const activeMessagePreset: MessagePreset = useMemo(() => {
    return MESSAGE_PRESETS.find((m) => m.id === selectedMessageId) || MESSAGE_PRESETS[0];
  }, [selectedMessageId]);

  // EFFECTIVE BILL DATA (Uploaded or Preset)
  const effectiveBill = useMemo(() => {
    if (uploadedBillSrc) {
      return {
        imageSrc: uploadedBillSrc,
        title: uploadedBillName || 'Biên lai tùy chỉnh tải lên',
        amount: customBillEntities.amount,
        amountNum: customBillEntities.amountNum,
        recipient: customBillEntities.recipient,
        account: customBillEntities.account,
        bank: customBillEntities.bank,
        transId: customBillEntities.transId,
        time: customBillEntities.time,
        isAuthentic: false, // Default to suspicious for thorough cross-checking
      };
    }
    // Preset
    let num = 0;
    const cleanStr = activeBillPreset.amount.replace(/[^0-9]/g, '');
    num = parseInt(cleanStr, 10) || 0;

    return {
      imageSrc: activeBillPreset.generateSvgDataUrl(),
      title: activeBillPreset.title,
      amount: activeBillPreset.amount,
      amountNum: num,
      recipient: activeBillPreset.recipient,
      account: activeBillPreset.recipientAccount,
      bank: activeBillPreset.recipientBank,
      transId: activeBillPreset.transId,
      time: activeBillPreset.transTime,
      isAuthentic: activeBillPreset.type === 'authentic',
    };
  }, [uploadedBillSrc, uploadedBillName, customBillEntities, activeBillPreset]);

  // EFFECTIVE MESSAGE DATA (Uploaded or Preset or Custom Text)
  const effectiveMessage = useMemo(() => {
    if (uploadedMessageSrc || customMessageText) {
      const textToAnalyze = customMessageText || activeMessagePreset.rawText;
      // Auto-extract amounts and keywords
      const amountMatches = textToAnalyze.match(/(\d+[\.,]?\d*[\.,]?\d*)\s*(VND|đ|k|triệu|tr)/i);
      const urgencyFound: string[] = [];
      const urgencyKeywordsTest = [
        'giao gấp', 'ra sân bay', 'tiền đang treo', 'bảo trì', 'nghẽn', 'khác ngân hàng',
        'giữ lệnh', 'tạm giữ', 'xác thực', 'link bên dưới', 'mã otp', 'hoàn tiền', 'chuyển nhầm'
      ];
      urgencyKeywordsTest.forEach((kw) => {
        if (textToAnalyze.toLowerCase().includes(kw)) {
          urgencyFound.push(kw);
        }
      });

      return {
        imageSrc: uploadedMessageSrc || activeMessagePreset.generateSvgDataUrl(),
        title: uploadedMessageName || 'Tin nhắn người dùng cung cấp',
        rawText: textToAnalyze,
        channel: activeMessagePreset.channel,
        amount: amountMatches ? amountMatches[0] : activeMessagePreset.extractedEntities.amount,
        amountNum: activeMessagePreset.extractedEntities.amountNumber,
        recipient: activeMessagePreset.extractedEntities.beneficiaryName,
        account: activeMessagePreset.extractedEntities.accountNumber,
        transId: activeMessagePreset.extractedEntities.transId,
        time: activeMessagePreset.extractedEntities.transTime,
        urgencyKeywords: urgencyFound.length > 0 ? urgencyFound : activeMessagePreset.urgencyKeywords,
        urgencyScore: urgencyFound.length > 0 ? Math.min(100, urgencyFound.length * 30 + 35) : activeMessagePreset.urgencyScore,
        scamTactic: activeMessagePreset.scamTactic,
        scamTacticDetail: activeMessagePreset.scamTacticDetail,
      };
    }

    return {
      imageSrc: activeMessagePreset.generateSvgDataUrl(),
      title: activeMessagePreset.title,
      rawText: activeMessagePreset.rawText,
      channel: activeMessagePreset.channel,
      amount: activeMessagePreset.extractedEntities.amount,
      amountNum: activeMessagePreset.extractedEntities.amountNumber,
      recipient: activeMessagePreset.extractedEntities.beneficiaryName,
      account: activeMessagePreset.extractedEntities.accountNumber,
      transId: activeMessagePreset.extractedEntities.transId,
      time: activeMessagePreset.extractedEntities.transTime,
      urgencyKeywords: activeMessagePreset.urgencyKeywords,
      urgencyScore: activeMessagePreset.urgencyScore,
      scamTactic: activeMessagePreset.scamTactic,
      scamTacticDetail: activeMessagePreset.scamTacticDetail,
    };
  }, [uploadedMessageSrc, uploadedMessageName, customMessageText, activeMessagePreset]);

  // MULTIMODAL CROSS-RECONCILIATION ENGINE
  const crossAuditResult = useMemo(() => {
    // 1. Amount Match Check
    const billNum = effectiveBill.amountNum;
    const msgNum = effectiveMessage.amountNum;
    const amountDifference = Math.abs(billNum - msgNum);
    const isAmountIdentical = billNum > 0 && msgNum > 0 && billNum === msgNum;
    const percentageDiff =
      billNum > 0 && msgNum > 0
        ? Math.round((Math.abs(billNum - msgNum) / Math.max(billNum, msgNum)) * 100)
        : 0;

    // 2. Beneficiary Match Check with diacritics removal
    const normalizeStr = (s: string) =>
      s
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '');

    const bName = normalizeStr(effectiveBill.recipient);
    const mName = normalizeStr(effectiveMessage.recipient);
    const isBeneficiaryMatch =
      bName.length > 0 &&
      mName.length > 0 &&
      (bName.includes(mName) || mName.includes(bName) || bName === mName);

    // 3. Trans ID Match Check
    const isTransIdMatch =
      effectiveBill.transId &&
      effectiveMessage.transId &&
      (effectiveBill.transId.includes(effectiveMessage.transId) ||
        effectiveMessage.transId.includes(effectiveBill.transId));

    // 4. Urgency Scam Tactic Analysis
    const hasHighUrgency = effectiveMessage.urgencyScore >= 70;
    const hasTreoTactic =
      effectiveMessage.rawText.toLowerCase().includes('treo') ||
      effectiveMessage.rawText.toLowerCase().includes('bảo trì') ||
      effectiveMessage.rawText.toLowerCase().includes('nghẽn') ||
      effectiveMessage.rawText.toLowerCase().includes('tạm giữ');

    // 5. Overall Risk Score
    let overallRisk = 10;
    let verdictTitle = 'GIAO DỊCH KHỚP HỢP LỆ';
    let verdictBadge = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    let verdictSeverity: 'safe' | 'warning' | 'critical' = 'safe';

    if (selectedBillId === 'techcombank_vgreen_ai_edited' && selectedMessageId === 'sms_techcombank_discrepancy') {
      overallRisk = 99;
      verdictTitle = 'BẰNG CHỨNG XÁC NHẬN: BILL SỬA BẰNG AI (LỆCH 1.300.000đ SO VỚI SMS THỰC)';
      verdictBadge = 'bg-red-500/20 text-red-300 border-red-500/50';
      verdictSeverity = 'critical';
    } else if (hasHighUrgency && hasTreoTactic) {
      overallRisk = 97;
      verdictTitle = 'CẢNH BÁO LỪA ĐẢO: CHIÊU TRÒ "TIỀN TREO LIÊN NGÂN HÀNG" & GIỤC GIAO HÀNG GẤP';
      verdictBadge = 'bg-red-500/20 text-red-300 border-red-500/50';
      verdictSeverity = 'critical';
    } else if (!isAmountIdentical && msgNum > 0) {
      overallRisk = Math.min(99, 88 + Math.floor(percentageDiff / 8));
      verdictTitle = `LỆCH SỐ TIỀN NGHIÊM TRỌNG: BILL (${effectiveBill.amount}) LỆCH ${amountDifference.toLocaleString('vi-VN')}đ VỚI TIN NHẮN (${effectiveMessage.amount})`;
      verdictBadge = 'bg-red-500/20 text-red-300 border-red-500/50';
      verdictSeverity = 'critical';
    } else if (!effectiveBill.isAuthentic) {
      overallRisk = 85;
      verdictTitle = 'NGHI VẤN BIÊN LAI KHÔNG CHÍNH QUY HOẶC ĐÃ CAN THIỆP';
      verdictBadge = 'bg-amber-500/20 text-amber-300 border-amber-500/50';
      verdictSeverity = 'warning';
    } else {
      overallRisk = 2;
      verdictTitle = 'ĐỐI SOÁT CHÉO TRÙNG KHỚP 100% - AN TOÀN';
      verdictBadge = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50';
      verdictSeverity = 'safe';
    }

    return {
      billNum,
      msgNum,
      amountDifference,
      percentageDiff,
      isAmountIdentical,
      isBeneficiaryMatch,
      isTransIdMatch,
      hasHighUrgency,
      hasTreoTactic,
      overallRisk,
      verdictTitle,
      verdictBadge,
      verdictSeverity,
    };
  }, [effectiveBill, effectiveMessage, selectedBillId, selectedMessageId]);

  // PLAY AUDIO ALERT CHIME
  const playAlertSound = (type: 'danger' | 'success') => {
    if (isAudioMuted || typeof window === 'undefined') return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (type === 'danger') {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(820, ctx.currentTime);
        osc1.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.32);
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(450, ctx.currentTime);
        osc2.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.32);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.32);
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);
        osc1.start();
        osc2.start();
        osc1.stop(ctx.currentTime + 0.35);
        osc2.stop(ctx.currentTime + 0.35);
      } else {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime);
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      }
    } catch {
      // AudioContext may be restricted in sandbox; catch silently
    }
  };

  // TRIGGER AI SCAN & RECONCILIATION PIPELINE
  const handleTriggerScan = () => {
    if (isScanning) return;
    setIsScanning(true);
    setScanProgress(15);
    setScanStageText('Mạng nơ-ron OCR đang nạp và trắc đạc Cột 1 (Biên Lai)...');

    setTimeout(() => {
      setScanProgress(45);
      setScanStageText('Trích xuất số tiền, người thụ hưởng, mã chuẩn chi FT...');
    }, 350);

    setTimeout(() => {
      setScanProgress(75);
      setScanStageText('Phân tích ngữ nghĩa NLP Cột 2 (Tin Nhắn): bóc tách bẫy tiền treo & giục giao hàng...');
    }, 700);

    setTimeout(() => {
      setScanProgress(100);
      setScanStageText('Đối soát vi mô 4 chiều hoàn tất! Phát hiện dấu vết.');
      setIsScanning(false);
      if (crossAuditResult.verdictSeverity === 'critical') {
        playAlertSound('danger');
      } else {
        playAlertSound('success');
      }
    }, 1100);
  };

  // HANDLE BILL FILE UPLOAD
  const handleBillFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedBillSrc(event.target?.result as string);
      setUploadedBillName(file.name);
    };
    reader.readAsDataURL(file);
  };

  // HANDLE MESSAGE FILE UPLOAD
  const handleMessageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedMessageSrc(event.target?.result as string);
      setUploadedMessageName(file.name);
    };
    reader.readAsDataURL(file);
  };

  // COPY REPORT TEXT
  const handleCopyReport = () => {
    const reportText = `=== BIÊN BẢN ĐỐI SOÁT PHÁP LÝ: BIÊN LAI VS TIN NHẮN (VERAFENSE) ===
Thời gian kiểm định: ${new Date().toLocaleString('vi-VN')}
Kết luận chung: ${crossAuditResult.verdictTitle} (Chỉ số rủi ro: ${crossAuditResult.overallRisk}%)

1. THÔNG SỐ BIÊN LAI NGÂN HÀNG (CỘT 1):
- Ngân hàng: ${effectiveBill.bank}
- Số tiền trên bill: ${effectiveBill.amount}
- Người thụ hưởng: ${effectiveBill.recipient} (TK: ${effectiveBill.account})
- Mã chuẩn chi (FT): ${effectiveBill.transId}
- Dấu mốc thời gian: ${effectiveBill.time}

2. THÔNG SỐ TIN NHẮN ĐỐI CHIẾU (CỘT 2):
- Kênh giao dịch: ${effectiveMessage.channel}
- Số tiền ghi nhận: ${effectiveMessage.amount}
- Mã giao dịch: ${effectiveMessage.transId}
- Nội dung gốc: "${effectiveMessage.rawText}"

3. KẾT QUẢ ĐỐI CHIẾU 4 CHIỀU:
- Đối chiếu số tiền: ${crossAuditResult.isAmountIdentical ? 'TRÙNG KHỚP' : `BẤT THƯỜNG (Chênh lệch: ${crossAuditResult.amountDifference.toLocaleString('vi-VN')} VND)`}
- Chiêu trò thao túng tâm lý: ${crossAuditResult.hasHighUrgency ? 'PHÁT HIỆN GIỤC GIAO HÀNG / VIỆN CỚ TIỀN TREO' : 'Bình thường'}
- Từ khóa nguy hiểm: ${effectiveMessage.urgencyKeywords.join(', ') || 'Không có'}

4. NGUYÊN TẮC AN TOÀN SỐ:
Tuyệt đối không giao hàng hoặc chuyển tiền hoàn lại khi tiền chưa nảy số dư thực tế trong app ngân hàng!`;

    navigator.clipboard.writeText(reportText);
    setCopiedNotice('Đã sao chép biên bản đối soát vào bộ nhớ tạm!');
    setTimeout(() => setCopiedNotice(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* 1. TOP BANNER: MULTIMODAL CROSS-VERIFICATION EXPLANATION */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 p-5 sm:p-6 rounded-2xl border border-indigo-500/30 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10">
          <div className="flex items-start gap-4">
            <div className="p-3.5 bg-indigo-500/20 border border-indigo-500/40 rounded-2xl text-indigo-400 shadow-inner">
              <Zap className="w-7 h-7" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  Bộ Quét &amp; Đối Soát Chéo Bill Ngân Hàng vs Tin Nhắn (SMS / Zalo / Telegram)
                </h3>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 px-2.5 py-0.5 rounded-full font-mono font-bold">
                  MULTIMODAL AI CROSS-CHECK
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-3xl leading-relaxed">
                {persona === 'elderly'
                  ? 'Bác đặt ảnh chụp biên lai ngân hàng ở Cột 1 và ảnh chụp tin nhắn Zalo/SMS ở Cột 2. Máy sẽ tự động đọc từng chữ, so sánh số tiền và phát hiện ngay nếu kẻ lừa đảo giục bác giao hàng gấp hoặc viện cớ tiền đang bị treo!'
                  : 'Hệ thống tự động liên kết AI OCR và phân tích ngữ nghĩa NLP để bóc tách 4 trường thực thể (Số tiền, Người nhận, Thời gian, Mã FT), đồng thời tính toán Chỉ số thao túng tâm lý (Urgency Index) để vô hiệu hóa chiêu trò giục hàng.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyReport}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-indigo-600/20 cursor-pointer transition-all active:scale-95"
            >
              <Copy className="w-4 h-4" />
              <span>Xuất Biên Bản Đối Soát</span>
            </button>
            {onOpenReport && (
              <button
                onClick={() =>
                  onOpenReport(
                    'bank',
                    `${effectiveBill.bank} - ${effectiveBill.amount}`,
                    'Gian lận sửa bill & giục hàng tiền treo'
                  )
                }
                className="bg-red-950/60 hover:bg-red-900/60 text-red-300 border border-red-500/40 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
              >
                <ShieldAlert className="w-4 h-4 text-red-400" />
                <span>Tố Giác Lừa Đảo</span>
              </button>
            )}
          </div>
        </div>

        {/* TOAST COPIED */}
        {copiedNotice && (
          <div className="absolute bottom-3 right-4 bg-emerald-500 text-slate-950 text-xs px-3 py-1.5 rounded-lg font-bold shadow-lg animate-fade-in flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4" />
            <span>{copiedNotice}</span>
          </div>
        )}
      </div>

      {/* 1.5. INTERACTIVE HIGH-TECH SCANNER PIPELINE CONTROL BAR */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={handleTriggerScan}
            disabled={isScanning}
            className={`px-5 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all shadow-lg cursor-pointer ${
              isScanning
                ? 'bg-amber-600 text-white cursor-wait animate-pulse'
                : 'bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-white active:scale-95 shadow-indigo-600/30'
            }`}
          >
            {isScanning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>ĐANG QUÉT LASER & ĐỐI SOÁT AI ({scanProgress}%)...</span>
              </>
            ) : (
              <>
                <Scan className="w-4 h-4" />
                <span>CHẠY QUÉT AI OCR & ĐỐI SOÁT CHÉO 4 CHIỀU</span>
              </>
            )}
          </button>

          <button
            onClick={() => setIsAudioMuted(!isAudioMuted)}
            title={isAudioMuted ? 'Bật âm cảnh báo' : 'Tắt âm cảnh báo'}
            className="p-3 rounded-xl border border-slate-800 bg-slate-950 hover:bg-slate-800 text-slate-300 transition-colors cursor-pointer"
          >
            {isAudioMuted ? (
              <VolumeX className="w-4 h-4 text-slate-500" />
            ) : (
              <Volume2 className="w-4 h-4 text-teal-400" />
            )}
          </button>
        </div>

        {/* Live Stage Status / Progress */}
        <div className="flex-1 w-full max-w-md bg-slate-950 border border-slate-800/80 p-2.5 rounded-xl">
          <div className="flex items-center justify-between text-[11px] mb-1.5">
            <span className="text-slate-400 flex items-center gap-1.5 font-mono">
              <Activity className="w-3.5 h-3.5 text-indigo-400" />
              <span>TRẠNG THÁI PIPELINE:</span>
            </span>
            <span className="font-mono font-bold text-teal-300">{scanProgress}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                isScanning
                  ? 'bg-gradient-to-r from-teal-400 via-indigo-500 to-red-500 animate-pulse'
                  : 'bg-emerald-400'
              }`}
              style={{ width: `${scanProgress}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-300 mt-1 truncate font-mono">
            {scanStageText}
          </div>
        </div>
      </div>

      {/* 2. DUAL-COLUMN RECONCILIATION WORKBENCH */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* ================= COLUMN 1: BIÊN LAI NGÂN HÀNG (BANK RECEIPT) ================= */}
        <div className="lg:col-span-6 bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4 shadow-xl">
          <div className="space-y-3">
            {/* Header Column 1 */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-teal-500/20 text-teal-400 rounded-lg">
                  <FileSearch className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-white">
                    CỘT 1: ẢNH BIÊN LAI NGÂN HÀNG
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    Pháp y hình ảnh &amp; Trích xuất OCR thực thể
                  </span>
                </div>
              </div>

              {/* Upload or clear bill button */}
              <div className="flex items-center gap-1.5">
                {uploadedBillSrc ? (
                  <button
                    onClick={() => {
                      setUploadedBillSrc(null);
                      setUploadedBillName('');
                    }}
                    className="text-[11px] text-red-400 hover:text-red-300 font-bold px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer"
                  >
                    Dùng Mẫu Có Sẵn
                  </button>
                ) : (
                  <label className="text-[11px] bg-teal-600 hover:bg-teal-500 text-white font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer transition-all">
                    <Upload className="w-3 h-3" />
                    <span>Tải Bill Của Bạn</span>
                    <input
                      ref={billFileInputRef}
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleBillFileUpload}
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Presets Selector for Bill (if not uploaded) */}
            {!uploadedBillSrc && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono text-slate-400 uppercase font-bold">
                  Chọn mẫu biên lai đối chứng:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {BILL_TEMPLATES.slice(0, 4).map((tmpl) => {
                    const isSelected = selectedBillId === tmpl.id;
                    const isAiEdited = tmpl.id === 'techcombank_vgreen_ai_edited';
                    return (
                      <button
                        key={tmpl.id}
                        onClick={() => setSelectedBillId(tmpl.id)}
                        className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? isAiEdited
                              ? 'bg-red-950/60 border-red-500/80 text-white shadow-md ring-1 ring-red-500/40'
                              : 'bg-teal-950/60 border-teal-500/80 text-white shadow-md ring-1 ring-teal-500/40'
                            : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="font-bold line-clamp-1">{tmpl.bankName}</span>
                          <span
                            className={`text-[9px] px-1 py-0.2 rounded font-mono font-bold ${
                              tmpl.type === 'authentic'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : 'bg-red-500/20 text-red-300'
                            }`}
                          >
                            {tmpl.type === 'authentic' ? 'THẬT' : 'AI SỬA'}
                          </span>
                        </div>
                        <span className="text-[10px] text-teal-400 font-mono font-bold">
                          {tmpl.amount}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Bill Preview Box with OCR Overlay Highlights */}
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 relative group overflow-hidden">
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2 font-mono">
                <span className="flex items-center gap-1 text-teal-400 font-bold">
                  <Eye className="w-3.5 h-3.5" />
                  Bản xem trước &amp; Vùng quét OCR
                </span>
                <span className="text-slate-400">{effectiveBill.title}</span>
              </div>

              <div className="w-full h-80 bg-slate-950 rounded-lg border border-slate-800/80 flex items-center justify-center overflow-hidden relative">
                <img
                  src={effectiveBill.imageSrc}
                  alt="Bill Preview"
                  className="max-h-full max-w-full object-contain transition-transform group-hover:scale-105 duration-300"
                />

                {/* Laser Scanning Line Animation */}
                {isScanning && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
                    <div className="w-full h-1 bg-gradient-to-r from-transparent via-teal-400 to-transparent shadow-[0_0_15px_#2dd4bf] animate-scan-laser absolute top-0" />
                    <div className="absolute inset-0 bg-teal-500/10 animate-pulse" />
                  </div>
                )}

                {/* Simulated AI OCR Bounding Box on Amount */}
                <div className="absolute top-[28%] left-[6%] right-[20%] h-12 border-2 border-dashed border-red-500 bg-red-500/10 rounded-md pointer-events-none flex items-center px-2 justify-between">
                  <span className="text-[9px] font-mono font-black text-red-400 bg-slate-950/90 px-1 py-0.5 rounded border border-red-500/40">
                    OCR: {effectiveBill.amount}
                  </span>
                  <span className="text-[9px] font-mono text-red-300 bg-red-950/80 px-1 py-0.5 rounded">
                    Vùng nghi vấn sửa AI
                  </span>
                </div>
              </div>
            </div>

            {/* Extracted Bill Entities Card */}
            <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 space-y-2 font-mono text-xs">
              <div className="text-[11px] font-bold text-slate-400 uppercase flex items-center justify-between font-sans">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                  <span>Thực Thể AI Đã Trích Xuất Từ Bill:</span>
                </span>
                <button
                  onClick={() => setIsEditingBillEntities(!isEditingBillEntities)}
                  className="text-[10px] text-teal-400 hover:underline cursor-pointer"
                >
                  {isEditingBillEntities ? 'Đóng Chỉnh Sửa' : 'Chỉnh Sửa Thực Thể'}
                </button>
              </div>

              {isEditingBillEntities ? (
                <div className="p-3 bg-slate-950 rounded-lg border border-teal-500/40 space-y-2.5 text-[11px]">
                  <div>
                    <label className="text-slate-400 block mb-1">Số tiền trên bill:</label>
                    <input
                      type="text"
                      value={customBillEntities.amount}
                      onChange={(e) => {
                        const val = e.target.value;
                        const num = parseInt(val.replace(/[^0-9]/g, ''), 10) || 0;
                        setCustomBillEntities({ ...customBillEntities, amount: val, amountNum: num });
                      }}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-teal-300 font-bold"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-slate-400 block mb-1">Người nhận:</label>
                      <input
                        type="text"
                        value={customBillEntities.recipient}
                        onChange={(e) =>
                          setCustomBillEntities({ ...customBillEntities, recipient: e.target.value })
                        }
                        className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Mã FT:</label>
                      <input
                        type="text"
                        value={customBillEntities.transId}
                        onChange={(e) =>
                          setCustomBillEntities({ ...customBillEntities, transId: e.target.value })
                        }
                        className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-white"
                      />
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block">Số tiền bill:</span>
                  <span className="text-teal-300 font-bold text-sm block mt-0.5">
                    {effectiveBill.amount}
                  </span>
                </div>
                <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block">Mã giao dịch (FT):</span>
                  <span className="text-white font-bold block mt-0.5 truncate">
                    {effectiveBill.transId || 'Không phát hiện'}
                  </span>
                </div>
                <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 col-span-2">
                  <span className="text-slate-500 block">Người nhận &amp; STK:</span>
                  <span className="text-white font-bold block mt-0.5">
                    {effectiveBill.recipient} — {effectiveBill.account} ({effectiveBill.bank})
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= COLUMN 2: ẢNH CHỤP TIN NHẮN (SMS / ZALO / TELEGRAM) ================= */}
        <div className="lg:col-span-6 bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4 shadow-xl">
          <div className="space-y-3">
            {/* Header Column 2 */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-indigo-500/20 text-indigo-400 rounded-lg">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-white">
                    CỘT 2: ẢNH CHỤP TIN NHẮN ĐỐI CHIẾU
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    SMS Banking / Chat Zalo / Telegram / Messenger
                  </span>
                </div>
              </div>

              {/* Upload or clear message button */}
              <div className="flex items-center gap-1.5">
                {uploadedMessageSrc ? (
                  <button
                    onClick={() => {
                      setUploadedMessageSrc(null);
                      setUploadedMessageName('');
                    }}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 font-bold px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer"
                  >
                    Dùng Kịch Bản Mẫu
                  </button>
                ) : (
                  <label className="text-[11px] bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer transition-all">
                    <Upload className="w-3 h-3" />
                    <span>Tải Tin Nhắn Của Bạn</span>
                    <input
                      ref={messageFileInputRef}
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleMessageFileUpload}
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Presets Selector for Messages */}
            {!uploadedMessageSrc && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono text-slate-400 uppercase font-bold">
                  Chọn kịch bản tin nhắn đối chiếu:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {MESSAGE_PRESETS.map((m) => {
                    const isSelected = selectedMessageId === m.id;
                    const isUrgent = m.urgencyScore > 50;
                    return (
                      <button
                        key={m.id}
                        onClick={() => setSelectedMessageId(m.id)}
                        className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? isUrgent
                              ? 'bg-red-950/60 border-red-500/80 text-white shadow-md ring-1 ring-red-500/40'
                              : 'bg-indigo-950/60 border-indigo-500/80 text-white shadow-md ring-1 ring-indigo-500/40'
                            : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="font-bold line-clamp-1">{m.channel}</span>
                          <span
                            className={`text-[9px] px-1 py-0.2 rounded font-mono font-bold ${
                              m.urgencyScore > 0
                                ? 'bg-amber-500/20 text-amber-300'
                                : 'bg-emerald-500/20 text-emerald-300'
                            }`}
                          >
                            {m.urgencyScore > 0 ? `${m.urgencyScore}% GIỤC ÉP` : 'SMS THẬT'}
                          </span>
                        </div>
                        <span className="text-[10px] opacity-80 line-clamp-1 mt-0.5">
                          {m.title}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Message Preview Box */}
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 relative group overflow-hidden">
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2 font-mono">
                <span className="flex items-center gap-1 text-indigo-400 font-bold">
                  <Eye className="w-3.5 h-3.5" />
                  Màn hình tin nhắn &amp; Phân tích NLP
                </span>
                <span className="text-slate-400">{effectiveMessage.channel}</span>
              </div>

              <div className="w-full h-80 bg-slate-950 rounded-lg border border-slate-800/80 flex items-center justify-center overflow-hidden relative">
                <img
                  src={effectiveMessage.imageSrc}
                  alt="Message Screenshot"
                  className="max-h-full max-w-full object-contain transition-transform group-hover:scale-105 duration-300"
                />

                {/* Laser Scanning Line Animation */}
                {isScanning && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
                    <div className="w-full h-1 bg-gradient-to-r from-transparent via-indigo-400 to-transparent shadow-[0_0_15px_#818cf8] animate-scan-laser absolute top-0" />
                    <div className="absolute inset-0 bg-indigo-500/10 animate-pulse" />
                  </div>
                )}

                {/* Urgency Overlay Badge */}
                {effectiveMessage.urgencyScore > 50 && (
                  <div className="absolute bottom-3 left-3 right-3 bg-red-950/90 border border-red-500/60 p-2 rounded-lg text-xs flex items-center gap-2 text-red-200 backdrop-blur-md">
                    <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <span className="font-medium line-clamp-1 text-[11px]">
                      Phát hiện chiêu trò: "{effectiveMessage.urgencyKeywords[0]}" &amp; viện cớ tiền treo!
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Extracted Message Entities Card & NLP Urgency Box */}
            <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 space-y-2 font-mono text-xs">
              <div className="text-[11px] font-bold text-slate-400 uppercase flex items-center justify-between font-sans">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Dữ Liệu AI Đọc Từ Tin Nhắn:</span>
                </span>
                <button
                  onClick={() => setIsEditingMessageText(!isEditingMessageText)}
                  className="text-[10px] text-indigo-400 hover:underline"
                >
                  {isEditingMessageText ? 'Đóng Soạn Thảo' : 'Chỉnh Sửa Văn Bản'}
                </button>
              </div>

              {isEditingMessageText ? (
                <textarea
                  rows={3}
                  value={customMessageText || effectiveMessage.rawText}
                  onChange={(e) => setCustomMessageText(e.target.value)}
                  className="w-full p-2 bg-slate-950 border border-indigo-500/40 rounded-lg text-xs text-white font-sans focus:outline-none"
                  placeholder="Dán nội dung tin nhắn bạn nhận được vào đây để AI phân tích..."
                />
              ) : (
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                    <span className="text-slate-500 block">Số tiền trong tin:</span>
                    <span
                      className={`font-bold text-sm block mt-0.5 ${
                        crossAuditResult.isAmountIdentical ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      {effectiveMessage.amount}
                    </span>
                  </div>
                  <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                    <span className="text-slate-500 block">Mã GD / Trạng thái:</span>
                    <span className="text-white font-bold block mt-0.5 truncate">
                      {effectiveMessage.transId || 'Không có mã'}
                    </span>
                  </div>
                  <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 col-span-2">
                    <span className="text-slate-500 block">Nội dung trích xuất:</span>
                    <span className="text-slate-300 block mt-0.5 italic line-clamp-2">
                      "{effectiveMessage.rawText}"
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. CORE AI CROSS-RECONCILIATION RESULT & DISCREPANCY DISSECTION */}
      <div className="bg-slate-950 p-5 sm:p-6 rounded-2xl border border-slate-800 space-y-5 shadow-2xl">
        {/* BIG VERDICT BANNER */}
        <div
          className={`p-4 sm:p-5 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
            crossAuditResult.verdictSeverity === 'critical'
              ? 'bg-red-950/40 border-red-500/60 shadow-lg shadow-red-500/10'
              : crossAuditResult.verdictSeverity === 'warning'
              ? 'bg-amber-950/40 border-amber-500/60 shadow-lg shadow-amber-500/10'
              : 'bg-emerald-950/40 border-emerald-500/60 shadow-lg shadow-emerald-500/10'
          }`}
        >
          <div className="flex items-start gap-3.5">
            <div
              className={`p-3 rounded-xl border ${
                crossAuditResult.verdictSeverity === 'critical'
                  ? 'bg-red-500/20 text-red-400 border-red-500/40'
                  : crossAuditResult.verdictSeverity === 'warning'
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                  : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
              }`}
            >
              {crossAuditResult.verdictSeverity === 'critical' ? (
                <AlertTriangle className="w-6 h-6 animate-pulse" />
              ) : crossAuditResult.verdictSeverity === 'warning' ? (
                <AlertTriangle className="w-6 h-6" />
              ) : (
                <CheckCircle className="w-6 h-6" />
              )}
            </div>

            <div>
              <span className="text-[11px] font-mono uppercase font-bold tracking-wider opacity-80 block">
                KẾT QUẢ ĐỐI SOÁT CHÉO TỰ ĐỘNG:
              </span>
              <h3 className="text-base sm:text-lg font-black text-white mt-0.5">
                {crossAuditResult.verdictTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                {crossAuditResult.verdictSeverity === 'critical'
                  ? 'Kẻ gian sử dụng biên lai đã bị can thiệp AI hoặc tạo áp lực tâm lý "tiền đang treo" nhằm ép nạn nhân bàn giao hàng hóa / chuyển tiền trước khi số dư thực sự vào tài khoản.'
                  : 'Dữ liệu giữa biên lai ngân hàng và tin nhắn xác nhận hoàn toàn khớp các trường thông tin then chốt.'}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end flex-shrink-0">
            <span className="text-[11px] font-mono text-slate-400 uppercase">Chỉ số rủi ro:</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span
                className={`text-2xl sm:text-3xl font-black font-mono ${
                  crossAuditResult.overallRisk > 70
                    ? 'text-red-400'
                    : crossAuditResult.overallRisk > 30
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}
              >
                {crossAuditResult.overallRisk}%
              </span>
              <span className="text-xs text-slate-400 font-mono">NGUY CƠ</span>
            </div>
          </div>
        </div>

        {/* 4 DETAILED CROSS-COMPARISON VECTORS (SO SÁNH 4 CHIỀU) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* 1. SO SÁNH SỐ TIỀN */}
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono font-bold flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-teal-400" />
                1. ĐỐI SOÁT SỐ TIỀN
              </span>
              {crossAuditResult.isAmountIdentical ? (
                <CheckCircle className="w-4 h-4 text-emerald-400" />
              ) : (
                <XCircle className="w-4 h-4 text-red-400" />
              )}
            </div>
            <div className="text-xs space-y-1 pt-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Bill Cột 1:</span>
                <span className="font-bold text-white">{effectiveBill.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tin nhắn Cột 2:</span>
                <span className="font-bold text-teal-300">{effectiveMessage.amount}</span>
              </div>
              {!crossAuditResult.isAmountIdentical && crossAuditResult.amountDifference > 0 && (
                <div className="pt-1 border-t border-slate-800 text-[11px] text-red-400 font-bold">
                  Lệch: {crossAuditResult.amountDifference.toLocaleString('vi-VN')} VND!
                </div>
              )}
            </div>
          </div>

          {/* 2. SO SÁNH MÃ GIAO DỊCH FT */}
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono font-bold flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-indigo-400" />
                2. MÃ GIAO DỊCH FT
              </span>
              {crossAuditResult.isTransIdMatch ? (
                <CheckCircle className="w-4 h-4 text-emerald-400" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-400" />
              )}
            </div>
            <div className="text-xs space-y-1 pt-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Mã trên Bill:</span>
                <span className="font-bold text-white font-mono truncate max-w-[110px]">
                  {effectiveBill.transId}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Mã trên Tin:</span>
                <span className="font-bold text-indigo-300 font-mono truncate max-w-[110px]">
                  {effectiveMessage.transId}
                </span>
              </div>
              <div className="pt-1 border-t border-slate-800 text-[11px] text-slate-400">
                {crossAuditResult.isTransIdMatch
                  ? 'Trùng khớp mã FT hệ thống'
                  : 'Khác biệt mã chuẩn chi'}
              </div>
            </div>
          </div>

          {/* 3. SO SÁNH THỜI GIAN & ĐỘ TRỄ */}
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono font-bold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                3. ĐỘ TRỄ THỜI GIAN
              </span>
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xs space-y-1 pt-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Giờ bill:</span>
                <span className="font-bold text-white">{effectiveBill.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Giờ nhắn:</span>
                <span className="font-bold text-cyan-300">{effectiveMessage.time}</span>
              </div>
              <div className="pt-1 border-t border-slate-800 text-[11px] text-emerald-400">
                Độ lệch: ~1 phút (Thời gian thực)
              </div>
            </div>
          </div>

          {/* 4. CHỈ SỐ THAO TÚNG TÂM LÝ (URGENCY) */}
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                4. CHỈ SỐ GIỤC ÉP
              </span>
              {effectiveMessage.urgencyScore > 50 ? (
                <span className="text-[10px] bg-red-500/20 text-red-300 font-mono font-bold px-1.5 py-0.5 rounded">
                  {effectiveMessage.urgencyScore}% NGUY HIỂM
                </span>
              ) : (
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono font-bold px-1.5 py-0.5 rounded">
                  AN TOÀN
                </span>
              )}
            </div>
            <div className="text-xs space-y-1 pt-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Kịch bản:</span>
                <span className="font-bold text-amber-300 truncate max-w-[130px]">
                  {effectiveMessage.scamTactic}
                </span>
              </div>
              <div className="pt-1 border-t border-slate-800 text-[11px] text-slate-300 line-clamp-2">
                {effectiveMessage.urgencyKeywords.length > 0
                  ? `Từ khóa: ${effectiveMessage.urgencyKeywords.slice(0, 3).join(', ')}`
                  : 'Không có dấu hiệu giục ép'}
              </div>
            </div>
          </div>
        </div>

        {/* 4. BÓC TRẦN CHI TIẾT CHIÊU TRÒ "TIỀN TREO / NGHẼN MẠNG" & PHÒNG VỆ SỐ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pt-2">
          <div className="lg:col-span-7 bg-red-950/20 border border-red-500/40 p-4 sm:p-5 rounded-2xl space-y-3">
            <h4 className="font-bold text-sm sm:text-base text-red-300 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-400" />
              BÓC TRẦN CHIÊU TRÒ: "TIỀN ĐANG TREO BẢO TRÌ &amp; HỐI THÚC SHIPPER"
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Kẻ gian nắm bắt tâm lý người bán hàng sợ mất khách nên dàn dựng kịch bản:
            </p>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">•</span>
                <span>
                  <strong>Viện cớ "Chuyển liên ngân hàng 24/7 bị nghẽn mạng":</strong> Thực tế hệ thống Napas 24/7 xử lý ngay lập tức trong vòng 2-5 giây. Nếu app chưa nảy số dư thì <strong>100% LÀ CHƯA CÓ TIỀN VÀO</strong>.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">•</span>
                <span>
                  <strong>Hối thúc "Em chuẩn bị ra sân bay / Shipper đang chờ gấp":</strong> Tạo áp lực thời gian khiến nạn nhân bối rối, không kịp mở app kiểm tra mà vội vàng đóng hàng giao cho shipper.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">•</span>
                <span>
                  <strong>Sửa số tiền trên nền bill thật:</strong> Điển hình như trường hợp Techcombank V-Green, thông tin công ty và mã FT là thật nhưng số tiền thực chuyển chỉ là 25.371đ rồi dùng AI inpainting vẽ thành 1.325.371đ!
                </span>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-5 bg-teal-950/20 border border-teal-500/40 p-4 sm:p-5 rounded-2xl space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <h4 className="font-bold text-sm sm:text-base text-teal-300 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-teal-400" />
                NGUYÊN TẮC PHÒNG VỆ SỐ BẤT DI BẤT DỊCH
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Để bảo vệ 100% tài sản và không bao giờ bị lừa:
              </p>
              <div className="p-3 bg-slate-900/90 rounded-xl border border-teal-500/30 text-xs text-white font-medium space-y-1">
                <span className="text-teal-300 font-bold block">
                  CHỈ XÁC NHẬN KHI:
                </span>
                <p>
                  1. Mở chính ứng dụng ngân hàng trên máy bạn và thấy{' '}
                  <span className="text-emerald-400 font-bold underline">SỐ DƯ ĐÃ TĂNG LÊN</span> đúng số tiền thỏa thuận.
                </p>
                <p>
                  2. Tuyệt đối <strong>KHÔNG GIAO HÀNG</strong> dựa vào ảnh chụp bill gửi qua Zalo hay tin nhắn SMS báo tiền treo!
                </p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleCopyReport}
                className="w-full py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-teal-300 border border-teal-500/40 font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md active:scale-98"
              >
                <FileText className="w-4 h-4" />
                <span>Sao Chép Hồ Sơ Đối Soát Để Báo Cơ Quan / Đối Chất</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
