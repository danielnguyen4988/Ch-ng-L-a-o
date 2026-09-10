import React, { useState, useRef, useEffect } from 'react';
import {
  Shield,
  Crown,
  PhoneCall,
  KeyRound,
  User,
  Flag,
  UserPlus,
  CheckCircle2,
  Wallet,
  Sparkles,
  ChevronDown,
  LogOut,
  Settings,
  FileText,
  CreditCard,
} from 'lucide-react';
import { PersonaMode } from '../types';
import { useAccount } from '../context/AccountContext';

interface HeaderProps {
  persona: PersonaMode;
  setPersona: (p: PersonaMode) => void;
  onOpenLicense: () => void;
  onOpenEmergency: () => void;
  onOpenAuth: () => void;
  onOpenUserProfile: () => void;
  onOpenReport: () => void;
  onOpenTopUp: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  persona,
  setPersona,
  onOpenLicense,
  onOpenEmergency,
  onOpenAuth,
  onOpenUserProfile,
  onOpenReport,
  onOpenTopUp,
}) => {
  const { account, isLoggedIn, isPro, logout } = useAccount();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40 transition-all">
      <div className="max-w-6xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* LOGO & BRANDING */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 p-0.5 shadow-md shadow-teal-500/20 shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Shield className="w-5 h-5 text-teal-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black tracking-wider text-base sm:text-lg text-white font-mono">
                VERAFENSE
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-teal-500/10 text-teal-400 border border-teal-500/30">
                BẢO VỆ GIA ĐÌNH
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Bảo Vệ Người Thân Khỏi Lừa Đảo Trực Tuyến
            </p>
          </div>
        </div>

        {/* UNIFIED 2-MODE SWITCHER: BẢN GIA ĐÌNH vs BẢN SOI CHI TIẾT */}
        <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800 shadow-inner order-3 sm:order-2 w-full sm:w-auto justify-center">
          <button
            onClick={() => setPersona('citizen')}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              persona !== 'pro'
                ? 'bg-emerald-600 text-white shadow-md font-black scale-[1.02]'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Chế độ dễ dùng: Phù hợp cho Người cao tuổi, Học sinh, Sinh viên & Cả gia đình (Miễn phí 100%)"
          >
            <span>🛡️</span>
            <span>Dễ Dùng (Cả Nhà)</span>
            <span className="text-[9px] bg-slate-950/80 px-1.5 py-0.2 rounded text-emerald-300 font-mono font-bold">
              0Đ
            </span>
          </button>

          <button
            onClick={() => setPersona('pro')}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              persona === 'pro'
                ? 'bg-teal-500 text-slate-950 shadow-md font-black scale-[1.02]'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Chế độ nâng cao: Dành cho người muốn soi chi tiết thông số kỹ thuật và điều luật pháp lý"
          >
            <span>🔬</span>
            <span>Soi Nâng Cao</span>
            <span className="text-[9px] bg-slate-950/80 px-1.5 py-0.2 rounded text-amber-300 font-mono font-bold">
              PRO
            </span>
          </button>
        </div>

        {/* ACTION CONTROLS & UNIFIED PROFILE */}
        <div className="flex items-center gap-2 order-2 sm:order-3 ml-auto sm:ml-0">
          {/* COMMUNITY REPORT BUTTON */}
          <button
            onClick={onOpenReport}
            className="flex items-center gap-1.5 bg-red-950/40 hover:bg-red-900/50 text-red-300 border border-red-500/40 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
            title="Tố giác số điện thoại, tài khoản hoặc đường link lừa đảo"
          >
            <Flag className="w-3.5 h-3.5 text-red-400" />
            <span className="hidden md:inline">Tố Giác</span>
          </button>

          {/* EMERGENCY 156 / A05 HOTLINE */}
          <button
            onClick={onOpenEmergency}
            className="flex items-center gap-1.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-md shadow-red-600/20 transition-all cursor-pointer active:scale-95"
            title="Đường dây nóng khẩn cấp A05 & 156"
          >
            <PhoneCall className="w-3.5 h-3.5 animate-pulse" />
            <span className="font-mono">156 / A05</span>
          </button>

          {/* UNIFIED ACCOUNT CAPSULE WITH DROPDOWN */}
          {isLoggedIn ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 bg-slate-900 hover:bg-slate-850 border border-slate-700 hover:border-teal-500/50 px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-200 transition-all cursor-pointer shadow-sm group"
                title="Bấm để mở bảng quản lý tài khoản, ví số dư và bản quyền"
              >
                <div className="w-6 h-6 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/40 flex items-center justify-center text-xs font-black shrink-0">
                  {account.name ? account.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="flex flex-col text-left hidden sm:flex">
                  <span className="text-white max-w-[100px] truncate leading-tight">
                    {account.name}
                  </span>
                  <span className="text-[10px] text-amber-400 font-mono">
                    {isPro ? 'Gói PRO' : `${(account.walletBalance || 0).toLocaleString('vi-VN')} đ`}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-transform duration-200" />
              </button>

              {/* FLOATING PROFILE DROPDOWN MENU */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                  {/* USER SUMMARY */}
                  <div className="p-3.5 bg-gradient-to-r from-slate-900 via-teal-950/40 to-slate-900 border-b border-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm truncate">{account.name}</span>
                      {account.isVerified ? (
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.2 rounded-full font-bold flex items-center gap-0.5">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          Đã định danh
                        </span>
                      ) : (
                        <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.2 rounded font-mono">
                          {account.age ? `${account.age} tuổi` : 'Chưa định danh'}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5 truncate">
                      {account.email}
                    </p>
                  </div>

                  {/* WALLET & LICENSE CARDS INSIDE DROPDOWN */}
                  <div className="p-3 space-y-2 border-b border-slate-800 text-xs">
                    {/* WALLET ROW */}
                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Wallet className="w-3 h-3 text-amber-400" />
                          Số dư ví thẩm định:
                        </span>
                        <div className="font-mono font-bold text-sm text-emerald-400">
                          {(account.walletBalance || 0).toLocaleString('vi-VN')} đ
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          onOpenTopUp();
                        }}
                        className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-2.5 py-1 rounded-lg text-[11px] cursor-pointer transition-all shadow-sm"
                      >
                        Nạp Tiền
                      </button>
                    </div>

                    {/* LICENSE ROW */}
                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Crown className="w-3 h-3 text-amber-400" />
                          Gói bản quyền:
                        </span>
                        <div className="font-mono font-bold text-xs text-amber-300 flex items-center gap-1.5">
                          {isPro ? (
                            <>
                              <span>PRO Hạn 359 ngày</span>
                            </>
                          ) : (
                            <span>Miễn phí ({account.dailyQuotaMax - account.dailyQuotaUsed}/{account.dailyQuotaMax})</span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          onOpenLicense();
                        }}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold px-2.5 py-1 rounded-lg text-[11px] cursor-pointer transition-all"
                      >
                        {isPro ? 'Gia Hạn' : 'Nâng Cấp'}
                      </button>
                    </div>
                  </div>

                  {/* ACTION LINKS */}
                  <div className="p-1.5 space-y-0.5 text-xs">
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        onOpenUserProfile();
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-slate-200 hover:bg-slate-800 hover:text-white flex items-center gap-2 cursor-pointer transition-all"
                    >
                      <User className="w-3.5 h-3.5 text-teal-400" />
                      <span>Thông Tin Tài Khoản & Đơn Tố Giác</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        logout();
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-red-400 hover:bg-red-950/50 hover:text-red-300 flex items-center gap-2 cursor-pointer transition-all"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Đăng Xuất Khỏi Thiết Bị</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-500 text-slate-950 font-black px-3.5 py-1.5 rounded-xl text-xs transition-all cursor-pointer shadow-md"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Đăng Nhập</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
