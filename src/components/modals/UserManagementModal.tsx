import React, { useState } from 'react';
import {
  X,
  User,
  Shield,
  Crown,
  FileText,
  AlertTriangle,
  CheckCircle2,
  LogOut,
  Calendar,
  Phone,
  Mail,
  CreditCard,
  PlusCircle,
  KeyRound,
  ExternalLink,
  Wallet,
  Sparkles,
  Save,
} from 'lucide-react';
import { PersonaMode } from '../../types';
import { useAccount, getPersonaByAge } from '../../context/AccountContext';
import { useIntelligence } from '../../context/IntelligenceContext';

interface UserManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLicense: () => void;
  onOpenReport: () => void;
  onOpenTopUp: () => void;
  onNotify: (msg: string) => void;
  onPersonaSync?: (persona: PersonaMode) => void;
}

export const UserManagementModal: React.FC<UserManagementModalProps> = ({
  isOpen,
  onClose,
  onOpenLicense,
  onOpenReport,
  onOpenTopUp,
  onNotify,
  onPersonaSync,
}) => {
  const { account, isPro, isEnterprise, logout, updateUser, switchTierDirectly } = useAccount();
  const { allReports } = useIntelligence();

  const [editAge, setEditAge] = useState<string>(account.age ? String(account.age) : '28');
  const [isEditingAge, setIsEditingAge] = useState(false);

  // Filter reports submitted by current user
  const myReports = allReports.filter(
    (r) =>
      r.reporterName === account.name ||
      r.reporterPhone === account.phone ||
      (account.cccd && r.reporterCccd === account.cccd)
  );

  if (!isOpen) return null;

  const handleSaveAge = () => {
    const ageNum = parseInt(editAge, 10);
    if (!isNaN(ageNum) && ageNum >= 10 && ageNum <= 100) {
      updateUser({ age: ageNum, birthYear: new Date().getFullYear() - ageNum });
      const newPersona = getPersonaByAge(ageNum);
      if (onPersonaSync) {
        onPersonaSync(newPersona);
      }
      setIsEditingAge(false);
      onNotify(`Đã lưu tuổi (${ageNum} tuổi) và tự động đồng bộ giao diện phù hợp!`);
    } else {
      onNotify('Vui lòng nhập độ tuổi hợp lệ từ 10 đến 100!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* MODAL HEADER */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-teal-950/60 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center font-black text-lg">
              {account.name.charAt(0) || 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white">{account.name}</h2>
                {account.isVerified ? (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Định danh CCCD
                  </span>
                ) : (
                  <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                    Chưa định danh
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{account.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODAL CONTENT */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-xs sm:text-sm">
          {/* USER INFO & AGE SYNC GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400 text-xs flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-teal-400" />
                Số điện thoại:
              </span>
              <p className="font-mono text-white font-bold">{account.phone || 'Chưa cập nhật'}</p>
            </div>

            {/* AGE SYNC BOX */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-teal-500/30 space-y-1 relative">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-xs flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-teal-400" />
                  Độ tuổi công dân:
                </span>
                <span className="text-[10px] text-teal-400 font-mono">Tự động đồng bộ</span>
              </div>

              {isEditingAge ? (
                <div className="flex items-center gap-1.5 mt-1">
                  <input
                    type="number"
                    min="10"
                    max="100"
                    value={editAge}
                    onChange={(e) => setEditAge(e.target.value)}
                    className="w-16 bg-slate-900 border border-teal-500 rounded px-1.5 py-0.5 text-white font-mono text-xs focus:outline-none"
                  />
                  <button
                    onClick={handleSaveAge}
                    className="bg-teal-500 text-slate-950 font-bold px-2 py-0.5 rounded text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Save className="w-3 h-3" />
                    Lưu
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <p className="font-mono text-white font-bold text-sm">
                    {account.age ? `${account.age} tuổi` : '28 tuổi'}
                  </p>
                  <button
                    onClick={() => setIsEditingAge(true)}
                    className="text-[11px] text-teal-400 hover:underline cursor-pointer"
                  >
                    Sửa
                  </button>
                </div>
              )}
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400 text-xs flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-teal-400" />
                Căn cước công dân:
              </span>
              <p className="font-mono text-white font-bold">{account.cccd || '079299******'}</p>
            </div>
          </div>

          {/* WALLET BALANCE & TOP-UP CARD */}
          <div className="bg-gradient-to-r from-amber-950/40 via-slate-950 to-slate-950 border border-amber-500/30 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <Wallet className="w-4 h-4 text-amber-400" />
                Số Dư Ví Thẩm Định VeraFense:
              </span>
              <div className="flex items-center gap-3">
                <span className="font-mono font-black text-xl text-emerald-400">
                  {(account.walletBalance || 0).toLocaleString('vi-VN')} đ
                </span>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-mono">
                  Sẵn sàng thanh toán
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => {
                  onClose();
                  onOpenTopUp();
                }}
                className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-amber-500/20 active:scale-95"
              >
                <Wallet className="w-4 h-4" />
                <span>Nạp Tiền / Nâng Gói Cước</span>
              </button>
            </div>
          </div>

          {/* TIER STATUS & QUOTA CARD */}
          <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-400">Cấp bậc tài khoản:</span>
                {isPro ? (
                  <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-0.5 rounded-md font-bold font-mono text-xs flex items-center gap-1">
                    <Crown className="w-3.5 h-3.5 text-amber-400" />
                    {account.license?.tierName || 'PRO DEFENSE'}
                  </span>
                ) : (
                  <span className="bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-md font-bold text-xs">
                    TÀI KHOẢN CÔNG DÂN MIỄN PHÍ
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1.5">
                Hạn mức thẩm định:{' '}
                <strong className="text-teal-400 font-mono">
                  {isPro
                    ? 'Không giới hạn lượt quét'
                    : `${account.dailyQuotaMax - account.dailyQuotaUsed}/${account.dailyQuotaMax} lượt hôm nay`}
                </strong>
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => {
                  onClose();
                  onOpenLicense();
                }}
                className="bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all flex-1 sm:flex-none"
              >
                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                <span>Nhập Key Bản Quyền</span>
              </button>
            </div>
          </div>

          {/* MY FRAUD REPORTS SECTION */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-red-400" />
                <span>Danh Sách Đơn Tố Giác Của Bạn ({myReports.length})</span>
              </h3>
              <button
                onClick={() => {
                  onClose();
                  onOpenReport();
                }}
                className="text-xs text-red-400 hover:text-red-300 font-bold flex items-center gap-1 cursor-pointer bg-red-950/40 border border-red-500/30 px-3 py-1.5 rounded-lg hover:bg-red-900/40 transition-all"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Gửi Tố Giác Mới</span>
              </button>
            </div>

            {myReports.length === 0 ? (
              <div className="bg-slate-950/60 border border-dashed border-slate-800 p-6 rounded-xl text-center space-y-2">
                <Shield className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-slate-400 text-xs">Bạn chưa gửi báo cáo cảnh báo nào vào hệ thống.</p>
                <p className="text-slate-500 text-[11px]">
                  Khi phát hiện số lạ, link cờ bạc hay STK lừa đảo, hãy gửi báo cáo để cùng bảo vệ cộng đồng!
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {myReports.map((rep) => (
                  <div
                    key={rep.id}
                    className="bg-slate-950 border border-slate-800 p-3 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-teal-300">{rep.targetValue}</span>
                        <span className="bg-red-950 text-red-400 border border-red-500/30 px-2 py-0.5 rounded text-[10px] font-bold">
                          {rep.category}
                        </span>
                      </div>
                      <p className="text-slate-400 text-[11px] line-clamp-1">{rep.evidenceDesc}</p>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-500 flex-shrink-0">
                      <span>{rep.reportedAt}</span>
                      <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-bold">
                        Đã ghi nhận dữ liệu
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* LOGOUT BUTTON */}
          <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
            <button
              onClick={() => {
                logout();
                onClose();
                onNotify('Đã đăng xuất khỏi tài khoản công dân!');
              }}
              className="text-xs text-slate-400 hover:text-red-400 flex items-center gap-1.5 cursor-pointer py-1.5 px-3 rounded-lg hover:bg-slate-800 transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>Đăng xuất</span>
            </button>
            <span className="text-[11px] text-slate-500">ID: {account.id}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
