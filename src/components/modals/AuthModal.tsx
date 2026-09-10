import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  UserPlus,
  LogIn,
  KeyRound,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Calendar,
} from 'lucide-react';
import { PersonaMode } from '../../types';
import { useAccount } from '../../context/AccountContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNotify: (msg: string) => void;
  onPersonaSync?: (persona: PersonaMode) => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onNotify,
  onPersonaSync,
  initialMode = 'register',
}) => {
  const { register, login } = useAccount();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState<string>('28');
  const [cccd, setCccd] = useState('');
  const [password, setPassword] = useState('');
  const [loginIdentifier, setLoginIdentifier] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'register') {
      const parsedAge = parseInt(age, 10) || 28;
      const res = register({
        name,
        phone,
        email,
        age: parsedAge,
        birthYear: new Date().getFullYear() - parsedAge,
        cccd,
        password,
      });
      onNotify(res.message);
      if (res.success) {
        if (onPersonaSync && res.recommendedPersona) {
          onPersonaSync(res.recommendedPersona);
        }
        onClose();
      }
    } else {
      const res = login(loginIdentifier);
      onNotify(res.message);
      if (res.success) {
        if (onPersonaSync && res.recommendedPersona) {
          onPersonaSync(res.recommendedPersona);
        }
        onClose();
      }
    }
  };

  const parsedAgePreview = parseInt(age, 10);
  const personaPreview =
    '🛡️ Bản Đại Chúng Toàn Dân (Miễn phí 100% • Tự động co giãn chữ theo hệ thống điện thoại)';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* MODAL HEADER */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-teal-950/80 via-slate-900 to-teal-950/80 border-b border-teal-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-teal-500/20 text-teal-400 rounded-xl border border-teal-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                {mode === 'register' ? 'Đăng Ký Tài Khoản Công Dân' : 'Đăng Nhập Hệ Thống Thẩm Định'}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {mode === 'register'
                  ? 'Kích hoạt 10 lượt thẩm định miễn phí/ngày & đồng bộ độ tuổi'
                  : 'Truy cập nhật ký điều tra & hồ sơ tố giác'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* TAB SWITCHER */}
        <div className="flex border-b border-slate-800 bg-slate-950/50">
          <button
            onClick={() => setMode('register')}
            className={`flex-1 py-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
              mode === 'register'
                ? 'text-teal-400 border-b-2 border-teal-500 bg-slate-900'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Đăng Ký Mới (Miễn Phí)</span>
          </button>
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
              mode === 'login'
                ? 'text-teal-400 border-b-2 border-teal-500 bg-slate-900'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Đã Có Tài Khoản</span>
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-3.5 text-xs sm:text-sm">
          {mode === 'register' ? (
            <>
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Họ và tên công dân <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Văn An"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    Số điện thoại <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0988xxxxxx"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-teal-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1 flex items-center justify-between">
                    <span>Độ tuổi / Năm sinh</span>
                    <span className="text-[10px] text-teal-400">Tự động đồng bộ</span>
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="100"
                    required
                    placeholder="Ví dụ: 62"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-teal-500 font-mono"
                  />
                </div>
              </div>

              {/* AGE PERSONA PREVIEW TIP */}
              <div className="p-2.5 rounded-xl bg-teal-950/40 border border-teal-500/30 text-[11px] text-teal-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 shrink-0 text-teal-400" />
                <span>
                  Giao diện đồng bộ theo tuổi: <strong>{personaPreview}</strong>
                </span>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Email nhận thông báo điều tra <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Số Căn cước công dân (CCCD / VNeID)
                </label>
                <input
                  type="text"
                  maxLength={12}
                  placeholder="12 chữ số CCCD (để hồ sơ tố giác có giá trị pháp lý)"
                  value={cccd}
                  onChange={(e) => setCccd(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-teal-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Mật khẩu bảo mật</label>
                <input
                  type="password"
                  placeholder="Tối thiểu 6 ký tự"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-teal-500"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Số điện thoại hoặc Email đã đăng ký
                </label>
                <input
                  type="text"
                  required
                  placeholder="0988xxxxxx hoặc email@example.com"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Mật khẩu</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-teal-500"
                />
              </div>
            </>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-slate-950 font-black rounded-xl cursor-pointer transition-all shadow-lg shadow-teal-500/20 active:scale-95 text-xs sm:text-sm"
            >
              {mode === 'register'
                ? 'Đăng Ký & Kích Hoạt 10 Lượt Quét/Ngày'
                : 'Đăng Nhập Vào Hệ Thống'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
