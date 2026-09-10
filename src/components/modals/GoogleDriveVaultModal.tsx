import React, { useState } from 'react';
import {
  Cloud,
  X,
  ExternalLink,
  Trash2,
  RefreshCw,
  FolderLock,
  FileCheck2,
  HardDrive,
  LogOut,
  AlertCircle,
  PlusCircle,
  FileText,
  ShieldCheck,
} from 'lucide-react';
import { useGoogleDrive } from '../../context/GoogleDriveContext';
import { GoogleSignInButton } from '../GoogleSignInButton';

interface GoogleDriveVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNotify: (msg: string) => void;
}

export const GoogleDriveVaultModal: React.FC<GoogleDriveVaultModalProps> = ({
  isOpen,
  onClose,
  onNotify,
}) => {
  const {
    user,
    isConnected,
    isLoading,
    isSyncing,
    files,
    quota,
    signInWithDrive,
    signOutDrive,
    saveDossier,
    deleteFileWithConfirm,
    refreshFiles,
  } = useGoogleDrive();

  const [testNote, setTestNote] = useState('');
  const [isSavingNote, setIsSavingNote] = useState(false);

  if (!isOpen) return null;

  const handleConnect = async () => {
    const success = await signInWithDrive();
    if (success) {
      onNotify('Đã kết nối Google Drive thành công!');
    } else {
      onNotify('Kết nối Google Drive không thành công hoặc đã bị hủy.');
    }
  };

  const handleDisconnect = async () => {
    await signOutDrive();
    onNotify('Đã ngắt kết nối Google Drive.');
  };

  const handleDelete = async (fileId: string, fileName: string) => {
    try {
      const ok = await deleteFileWithConfirm(fileId, fileName);
      if (ok) {
        onNotify(`Đã xóa "${fileName}" khỏi Google Drive.`);
      }
    } catch {
      onNotify('Xóa tệp không thành công.');
    }
  };

  const handleQuickSaveNote = async () => {
    if (!testNote.trim()) return;
    try {
      setIsSavingNote(true);
      const title = `VeraFense_GhiChu_ChungCu_${new Date().toISOString().slice(0, 10)}_${Date.now().toString().slice(-4)}.txt`;
      const content = `HỆ THỐNG PHÒNG CHỐNG LỪA ĐẢO VERAFENSE - GHI CHÚ BẰNG CHỨNG
Thời gian: ${new Date().toLocaleString('vi-VN')}
Tài khoản bảo vệ: ${user?.email || 'N/A'}
--------------------------------------------------
NỘI DUNG GHI CHÚ / BẰNG CHỨNG:
${testNote}

MÃ NIÊM PHONG BẢO TOÀN (SHA-256): 9f83ac6e7f22a842188478d774523b0802187cfb3ee96dd47da01a57a9abac4f
Lưu trữ trên Google Drive người dùng qua VeraFense Evidence Vault.`;

      const saved = await saveDossier(title, content);
      if (saved) {
        onNotify(`Đã lưu "${title}" vào Google Drive!`);
        setTestNote('');
      }
    } catch {
      onNotify('Lỗi lưu ghi chú lên Google Drive.');
    } finally {
      setIsSavingNote(false);
    }
  };

  const formatFileSize = (bytes?: string) => {
    if (!bytes) return '0 KB';
    const num = parseInt(bytes, 10);
    if (isNaN(num)) return 'N/A';
    if (num < 1024) return `${num} B`;
    if (num < 1024 * 1024) return `${(num / 1024).toFixed(1)} KB`;
    return `${(num / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* HEADER */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-teal-950 via-slate-900 to-sky-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-sky-500 p-0.5 shadow-lg shadow-teal-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <HardDrive className="w-5 h-5 text-teal-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base sm:text-lg text-white">
                  Kho Bằng Chứng Google Drive
                </h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/30">
                  Google Workspace
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Tự động sao lưu hồ sơ tố giác tội phạm &amp; bằng chứng lừa đảo lên Google Drive cá nhân
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* BODY */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs sm:text-sm text-slate-300">
          {/* CONNECTION STATUS BANNER */}
          {!isConnected ? (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 text-center space-y-4 shadow-inner">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center mx-auto">
                <Cloud className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-white text-base">
                  Chưa Kết Nối Với Google Drive Của Bạn
                </h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                  Đăng nhập tài khoản Google để kích hoạt tính năng sao lưu tự động các Biên bản Giám định, Hồ sơ Tố giác A05 và Hình ảnh Bill lừa đảo. Toàn bộ dữ liệu nằm trong tài khoản Drive của riêng bạn.
                </p>
              </div>

              <div className="pt-2 flex justify-center">
                <GoogleSignInButton
                  onClick={handleConnect}
                  disabled={isLoading}
                  text={isLoading ? 'Đang kết nối...' : 'Sign in with Google (Bật Google Drive)'}
                />
              </div>

              <p className="text-[11px] text-slate-500 italic">
                * Tuân thủ quy định bảo mật. Mã truy cập chỉ lưu trên RAM máy của bạn, không lưu cookie hay backend.
              </p>
            </div>
          ) : (
            <>
              {/* CONNECTED USER BADGE */}
              <div className="bg-slate-950 border border-teal-500/30 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-inner">
                <div className="flex items-center gap-3">
                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'Google User'}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full border border-teal-500/40"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold border border-teal-500/40">
                      {user?.displayName ? user.displayName.charAt(0) : 'G'}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">
                        {user?.displayName || 'Tài khoản Google'}
                      </span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold flex items-center gap-1 border border-emerald-500/40">
                        <ShieldCheck className="w-3 h-3" /> Đã kết nối Drive
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">{user?.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={refreshFiles}
                    disabled={isSyncing}
                    className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-750 cursor-pointer transition-all disabled:opacity-50"
                    title="Làm mới danh sách tệp"
                  >
                    <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-teal-400' : ''}`} />
                  </button>
                  <button
                    onClick={handleDisconnect}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-950/40 hover:bg-red-900/50 text-red-300 border border-red-500/40 rounded-xl text-xs font-bold cursor-pointer transition-all"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Ngắt kết nối</span>
                  </button>
                </div>
              </div>

              {/* STORAGE & FOLDER DETAILS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center gap-3">
                  <FolderLock className="w-5 h-5 text-amber-400 shrink-0" />
                  <div className="space-y-0.5">
                    <span className="text-[11px] text-slate-400">Thư mục lưu trữ bằng chứng:</span>
                    <p className="font-mono text-xs font-bold text-amber-300 truncate">
                      Google Drive / VeraFense_HoSo_ToGiac
                    </p>
                  </div>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center gap-3">
                  <HardDrive className="w-5 h-5 text-cyan-400 shrink-0" />
                  <div className="space-y-0.5">
                    <span className="text-[11px] text-slate-400">Dung lượng Google Drive:</span>
                    <p className="font-mono text-xs font-bold text-cyan-300">
                      {quota?.usage ? formatFileSize(quota.usage) : 'Đang đồng bộ'}
                      {quota?.limit && ` / ${formatFileSize(quota.limit)}`}
                    </p>
                  </div>
                </div>
              </div>

              {/* QUICK SAVE EVIDENCE NOTE */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-200 flex items-center gap-1.5">
                    <PlusCircle className="w-4 h-4 text-teal-400" />
                    Lưu Nhanh Bằng Chứng / Nhật Ký Cuộc Gọi Lừa Đảo Lên Drive
                  </span>
                  <span className="text-[11px] text-slate-500">Tự động niêm phong SHA-256</span>
                </div>
                <textarea
                  rows={2}
                  value={testNote}
                  onChange={(e) => setTestNote(e.target.value)}
                  placeholder="Nhập nhanh ghi chú: Số điện thoại gọi đến, giờ gọi, tên giả mạo, số tiền đòi chuyển khoản..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
                <div className="flex justify-end">
                  <button
                    onClick={handleQuickSaveNote}
                    disabled={isSavingNote || !testNote.trim()}
                    className="bg-teal-600 hover:bg-teal-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-all shadow-md"
                  >
                    <Cloud className="w-4 h-4" />
                    <span>{isSavingNote ? 'Đang lưu vào Drive...' : 'Lưu Tệp Vào Google Drive'}</span>
                  </button>
                </div>
              </div>

              {/* SAVED FILES LIST */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                  <span className="font-bold flex items-center gap-1.5 text-slate-200">
                    <FileCheck2 className="w-4 h-4 text-emerald-400" />
                    Tệp &amp; Hồ Sơ Đã Lưu Trên Google Drive ({files.length})
                  </span>
                  <span>Nhấn để xem trực tiếp</span>
                </div>

                {files.length === 0 ? (
                  <div className="text-center py-8 bg-slate-950 rounded-2xl border border-slate-800 text-slate-500 space-y-2">
                    <FileText className="w-8 h-8 mx-auto text-slate-600" />
                    <p className="text-xs">Chưa có tệp hồ sơ nào trong thư mục VeraFense trên Drive.</p>
                    <p className="text-[11px] text-slate-600">
                      Hãy mở mục &ldquo;Tin nhắn &amp; Kịch bản lừa&rdquo; rồi bấm &ldquo;Lưu Hồ Sơ Vào Google Drive&rdquo; để tạo tệp đầu tiên!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {files.map((file) => (
                      <div
                        key={file.id}
                        className="bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 p-3 rounded-xl flex items-center justify-between gap-3 transition-all"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-200 text-xs truncate" title={file.name}>
                              {file.name}
                            </p>
                            <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono mt-0.5">
                              <span>
                                {file.createdTime
                                  ? new Date(file.createdTime).toLocaleDateString('vi-VN')
                                  : 'Hôm nay'}
                              </span>
                              <span>•</span>
                              <span>{formatFileSize(file.size)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {file.webViewLink && (
                            <a
                              href={file.webViewLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 bg-slate-900 hover:bg-slate-800 text-teal-300 hover:text-teal-200 rounded-lg border border-slate-750 transition-colors flex items-center gap-1 text-xs"
                              title="Mở trong Google Drive"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Mở Drive</span>
                            </a>
                          )}
                          <button
                            onClick={() => handleDelete(file.id, file.name)}
                            className="p-1.5 bg-red-950/30 hover:bg-red-900/50 text-red-400 rounded-lg border border-red-500/30 transition-colors cursor-pointer"
                            title="Xóa tệp khỏi Google Drive"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* FOOTER */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span>Mã hóa bảo vệ theo tiêu chuẩn Google Workspace</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl cursor-pointer transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
