import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { PersonaMode, ForensicReport, FraudTargetType } from './types';
import { AccountProvider, useAccount, getPersonaByAge } from './context/AccountContext';
import { IntelligenceProvider } from './context/IntelligenceContext';
import { Header } from './components/Header';
import { NavigationTabs, TabKey } from './components/NavigationTabs';
import { FamilyProtectionBanner } from './components/FamilyProtectionBanner';
import { LinkApkTab } from './components/tabs/LinkApkTab';
import { BillDeepfakeTab } from './components/tabs/BillDeepfakeTab';
import { SmsAnalysisTab } from './components/tabs/SmsAnalysisTab';
import { PhoneBankTab } from './components/tabs/PhoneBankTab';
import { AppGuideTab } from './components/tabs/AppGuideTab';
import { LicenseManagerModal } from './components/modals/LicenseManagerModal';
import { LegalDossierModal } from './components/modals/LegalDossierModal';
import { EmergencyModal } from './components/modals/EmergencyModal';
import { AuthModal } from './components/modals/AuthModal';
import { UserManagementModal } from './components/modals/UserManagementModal';
import { ReportFraudModal } from './components/modals/ReportFraudModal';
import { TopUpPaymentModal } from './components/modals/TopUpPaymentModal';
import { LegalDisclaimerModal } from './components/modals/LegalDisclaimerModal';
import { GoogleDriveVaultModal } from './components/modals/GoogleDriveVaultModal';
import { GoogleDriveProvider, useGoogleDrive } from './context/GoogleDriveContext';

function MainContent() {
  const { account } = useAccount();

  // Initialize persona automatically according to user age if present
  const [persona, setPersona] = useState<PersonaMode>(() => {
    return getPersonaByAge(account.age);
  });

  const [activeTab, setActiveTab] = useState<TabKey>('bill');
  const [showEmergency, setShowEmergency] = useState(false);
  const [showLicenseModal, setShowLicenseModal] = useState(false);
  const [showLegalDossierModal, setShowLegalDossierModal] = useState(false);
  const [showLegalDisclaimerModal, setShowLegalDisclaimerModal] = useState(false);
  const [showGoogleDriveModal, setShowGoogleDriveModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showTopUpModal, setShowTopUpModal] = useState(false);

  const [reportInitial, setReportInitial] = useState<{
    type: FraudTargetType;
    value: string;
    category?: string;
  }>({
    type: 'phone',
    value: '',
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // SHARED STATE FOR SMS TAB & DOSSIER MODAL
  const [smsInput, setSmsInput] = useState(
    'Toa an nhan dan TP Ha Noi thong bao: Ong/Ba co lenh bat tam giam tu Vien Kiem Sat vi lien quan duong day rua tien 200 ty. Yeu cau chuyen 50.000.000 VND vao tai khoan tam giu cua Bo Cong An so 102938484 VCB truoc 17h hom nay de phuc vu giam dinh. Tuyet doi giu bi mat khong tiet lo voi gia dinh vi ly do an ninh quoc gia.'
  );
  const [forensicReport, setForensicReport] = useState<ForensicReport | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleOpenReport = (type: FraudTargetType, value: string, category?: string) => {
    setReportInitial({ type, value, category });
    setShowReportModal(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-slate-950">
      {/* HEADER WITH BRANDING, PERSONA & UNIFIED ACCOUNT */}
      <Header
        persona={persona}
        setPersona={setPersona}
        onOpenLicense={() => setShowLicenseModal(true)}
        onOpenEmergency={() => setShowEmergency(true)}
        onOpenAuth={() => setShowAuthModal(true)}
        onOpenUserProfile={() => setShowUserModal(true)}
        onOpenReport={() => handleOpenReport('phone', '')}
        onOpenTopUp={() => setShowTopUpModal(true)}
        onOpenGoogleDrive={() => setShowGoogleDriveModal(true)}
      />

      {/* NAVIGATION TABS RENDERED FOR ALL MODES */}
      <NavigationTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white text-xs sm:text-sm px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-emerald-400 animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* MAIN CONTAINER: UNIFIED CITIZEN & PRO SUITE */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-4 sm:py-6">
        {/* SLEEK HELPER STRIP (FOR ANALYSIS TABS) */}
        {activeTab !== 'guide' && (
          <div className="mb-5 flex flex-wrap items-center justify-between gap-2.5 bg-slate-900/70 border border-slate-800 hover:border-slate-700 px-4 py-2.5 rounded-2xl text-xs transition-all shadow-sm">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="text-amber-400">💡</span>
              <span className="text-slate-400 hidden sm:inline">Cần xem hướng dẫn nhanh?</span>
              <button
                onClick={() => setActiveTab('guide')}
                className="text-teal-400 hover:text-teal-300 font-bold underline cursor-pointer"
              >
                Mở Cẩm Nang &amp; Hướng Dẫn Sử Dụng (Sổ tay 3 Không - 2 Có)
              </button>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setShowEmergency(true)}
                className="text-red-400 hover:text-red-300 font-bold flex items-center gap-1.5 cursor-pointer text-[11px] bg-red-950/50 hover:bg-red-900/50 px-3 py-1 rounded-xl border border-red-500/30 transition-all"
                title="Đường dây nóng khẩn cấp"
              >
                <span>Khẩn cấp: 156 / A05</span>
              </button>
            </div>
          </div>
        )}

        {/* CORE VERIFICATION SUITE ACCESSIBLE TO EVERYONE */}
        {activeTab === 'bill' && (
          <BillDeepfakeTab
            persona={persona}
            onOpenLicense={() => setShowLicenseModal(true)}
            onOpenReport={handleOpenReport}
          />
        )}

        {activeTab === 'sms' && (
          <SmsAnalysisTab
            persona={persona}
            onOpenLegalDossier={() => setShowLegalDossierModal(true)}
            onOpenLicense={() => setShowLicenseModal(true)}
            onOpenReport={handleOpenReport}
            smsInput={smsInput}
            setSmsInput={setSmsInput}
            forensicReport={forensicReport}
            setForensicReport={setForensicReport}
            onNotify={showToast}
          />
        )}

        {activeTab === 'link' && (
          <LinkApkTab
            persona={persona}
            onOpenLicense={() => setShowLicenseModal(true)}
            onOpenReport={handleOpenReport}
          />
        )}

        {activeTab === 'phone' && (
          <PhoneBankTab
            persona={persona}
            onOpenLicense={() => setShowLicenseModal(true)}
            onOpenReport={handleOpenReport}
          />
        )}

        {activeTab === 'guide' && (
          <AppGuideTab
            onNavigateTab={setActiveTab}
            onSelectSmsScenario={(text) => {
              setSmsInput(text);
              setActiveTab('sms');
            }}
            onOpenEmergency={() => setShowEmergency(true)}
          />
        )}
      </main>

      {/* MODALS */}
      <LicenseManagerModal
        isOpen={showLicenseModal}
        onClose={() => setShowLicenseModal(false)}
        onNotify={showToast}
      />

      <LegalDossierModal
        isOpen={showLegalDossierModal}
        onClose={() => setShowLegalDossierModal(false)}
        smsInput={smsInput}
        forensicReport={forensicReport}
        onNotify={showToast}
      />

      <EmergencyModal
        isOpen={showEmergency}
        onClose={() => setShowEmergency(false)}
      />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onNotify={showToast}
        onPersonaSync={(newPersona) => setPersona(newPersona)}
      />

      <UserManagementModal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        onOpenLicense={() => setShowLicenseModal(true)}
        onOpenReport={() => handleOpenReport('phone', '')}
        onOpenTopUp={() => setShowTopUpModal(true)}
        onNotify={showToast}
        onPersonaSync={(newPersona) => setPersona(newPersona)}
      />

      <ReportFraudModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        onNotify={showToast}
        initialTargetType={reportInitial.type}
        initialTargetValue={reportInitial.value}
        initialCategory={reportInitial.category}
      />

      <TopUpPaymentModal
        isOpen={showTopUpModal}
        onClose={() => setShowTopUpModal(false)}
        onNotify={showToast}
      />

      <LegalDisclaimerModal
        isOpen={showLegalDisclaimerModal}
        onClose={() => setShowLegalDisclaimerModal(false)}
      />

      <GoogleDriveVaultModal
        isOpen={showGoogleDriveModal}
        onClose={() => setShowGoogleDriveModal(false)}
        onNotify={showToast}
      />

      {/* FOOTER */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-500 space-y-2">
        <p className="font-medium text-slate-400">
          VERAFENSE • Hệ Thống Trí Tuệ Nhân Tạo Phòng Chống Lừa Đảo Trực Tuyến &amp; Bảo Vệ Người Dân Việt Nam
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-500">
          <span>Miễn Phí 100% Cho Mọi Người Dân</span>
          <span>•</span>
          <button
            onClick={() => setShowGoogleDriveModal(true)}
            className="text-sky-400 hover:text-sky-300 underline cursor-pointer transition-colors flex items-center gap-1"
          >
            Kho Bằng Chứng Google Drive
          </button>
          <span>•</span>
          <button
            onClick={() => setShowLegalDisclaimerModal(true)}
            className="text-teal-400/90 hover:text-teal-300 underline cursor-pointer transition-colors"
          >
            Điều Khoản Sử Dụng &amp; Miễn Trừ Trách Nhiệm Pháp Lý
          </button>
          <span>•</span>
          <button
            onClick={() => setShowEmergency(true)}
            className="text-red-400/90 hover:text-red-300 underline cursor-pointer transition-colors"
          >
            Đường Dây Nóng Khẩn Cấp (156 / A05)
          </button>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AccountProvider>
      <IntelligenceProvider>
        <GoogleDriveProvider>
          <MainContent />
        </GoogleDriveProvider>
      </IntelligenceProvider>
    </AccountProvider>
  );
}
