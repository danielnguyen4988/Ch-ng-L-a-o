import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserAccount, AccountTier, LicenseInfo, PersonaMode } from '../types';
import { MOCK_LICENSES } from '../data/presets';

export interface RegisterInput {
  name: string;
  phone: string;
  email: string;
  age?: number;
  birthYear?: number;
  cccd?: string;
  password?: string;
}

export function getPersonaByAge(age?: number): PersonaMode {
  return 'citizen';
}

interface AccountContextType {
  account: UserAccount;
  isLoggedIn: boolean;
  isPro: boolean;
  isEnterprise: boolean;
  register: (data: RegisterInput) => { success: boolean; message: string; recommendedPersona: PersonaMode };
  login: (identifier: string) => { success: boolean; message: string; recommendedPersona: PersonaMode };
  logout: () => void;
  updateUser: (data: Partial<UserAccount>) => void;
  incrementReportsSubmitted: () => void;
  activateLicense: (key: string) => { success: boolean; message: string };
  deactivateLicense: () => void;
  consumeQuota: () => boolean;
  resetQuota: () => void;
  switchTierDirectly: (tier: AccountTier) => void;
  topUpWallet: (amount: number) => { success: boolean; message: string };
  purchasePlan: (
    planId: string,
    planName: string,
    durationDays: number,
    priceVnd: number,
    tier: AccountTier
  ) => { success: boolean; message: string };
}

const defaultAccount: UserAccount = {
  id: 'usr_vn_2026',
  name: 'Nguyễn Hoàng Quân',
  phone: '0988***488',
  email: 'NHQV4988@gmail.com',
  age: 28,
  birthYear: 1998,
  walletBalance: 50000,
  cccd: '079299******',
  isVerified: true,
  tier: 'pro',
  dailyQuotaMax: 9999,
  dailyQuotaUsed: 2,
  createdAt: '01/09/2026',
  reportsSubmitted: 3,
  license: {
    key: 'VERA-PRO-2026-CYBER',
    tier: 'pro',
    tierName: 'Gói Chuyên Viên Điều Tra Số (Pro Defense)',
    activatedAt: '01/09/2026',
    expiresAt: '01/09/2027',
    daysRemaining: 359,
    deviceLinked: 'Máy trạm bảo mật (Chrome / Windows 11)',
    organization: 'Phòng Phân Tích Bằng Chứng Số',
    isValid: true,
  },
};

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export const AccountProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const savedStatus = localStorage.getItem('verafense_is_logged_in');
    return savedStatus !== null ? JSON.parse(savedStatus) : true;
  });

  const [account, setAccount] = useState<UserAccount>(() => {
    const saved = localStorage.getItem('verafense_account_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...defaultAccount,
          ...parsed,
          walletBalance: parsed.walletBalance !== undefined ? parsed.walletBalance : 50000,
          age: parsed.age !== undefined ? parsed.age : 28,
        };
      } catch (e) {
        return defaultAccount;
      }
    }
    return defaultAccount;
  });

  useEffect(() => {
    localStorage.setItem('verafense_account_v2', JSON.stringify(account));
  }, [account]);

  useEffect(() => {
    localStorage.setItem('verafense_is_logged_in', JSON.stringify(isLoggedIn));
  }, [isLoggedIn]);

  const isPro = account.tier === 'pro' || account.tier === 'enterprise';
  const isEnterprise = account.tier === 'enterprise';

  const register = (data: RegisterInput) => {
    if (!data.name.trim() || !data.phone.trim() || !data.email.trim()) {
      return {
        success: false,
        message: 'Vui lòng điền đủ Họ tên, Số điện thoại và Email định danh!',
        recommendedPersona: 'pro' as PersonaMode,
      };
    }

    const calculatedAge = data.age || (data.birthYear ? new Date().getFullYear() - data.birthYear : 28);
    const persona = getPersonaByAge(calculatedAge);

    const newAcc: UserAccount = {
      id: `usr_${Date.now()}`,
      name: data.name.trim(),
      phone: data.phone.trim(),
      email: data.email.trim(),
      age: calculatedAge,
      birthYear: data.birthYear || new Date().getFullYear() - calculatedAge,
      walletBalance: 0,
      cccd: data.cccd?.trim(),
      isVerified: !!data.cccd?.trim(),
      tier: 'free',
      dailyQuotaMax: 50,
      dailyQuotaUsed: 0,
      createdAt: new Date().toLocaleDateString('vi-VN'),
      reportsSubmitted: 0,
      license: null,
    };

    setAccount(newAcc);
    setIsLoggedIn(true);

    const personaLabel =
      persona === 'elderly'
        ? 'Chế độ Người Cao Tuổi (Chữ to, giọng đọc âm thanh)'
        : persona === 'youth'
        ? 'Chế độ Học Sinh / Teen (Cảnh báo bẫy nạp game, TikTok)'
        : 'Chế độ Điều Tra Số PRO';

    return {
      success: true,
      message: `Đăng ký thành công! Hệ thống tự động đồng bộ sang "${personaLabel}" dựa trên độ tuổi (${calculatedAge} tuổi).`,
      recommendedPersona: persona,
    };
  };

  const login = (identifier: string) => {
    if (!identifier.trim()) {
      return {
        success: false,
        message: 'Vui lòng nhập số điện thoại hoặc email đã đăng ký!',
        recommendedPersona: 'pro' as PersonaMode,
      };
    }
    setIsLoggedIn(true);
    const persona = getPersonaByAge(account.age);
    return {
      success: true,
      message: `Đăng nhập thành công! Chào mừng trở lại, ${account.name}.`,
      recommendedPersona: persona,
    };
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  const updateUser = (data: Partial<UserAccount>) => {
    setAccount((prev) => {
      const updated = { ...prev, ...data };
      if (data.birthYear && !data.age) {
        updated.age = new Date().getFullYear() - data.birthYear;
      }
      return updated;
    });
  };

  const incrementReportsSubmitted = () => {
    setAccount((prev) => ({ ...prev, reportsSubmitted: prev.reportsSubmitted + 1 }));
  };

  const topUpWallet = (amount: number): { success: boolean; message: string } => {
    if (amount <= 0) {
      return { success: false, message: 'Số tiền nạp không hợp lệ!' };
    }
    setAccount((prev) => ({
      ...prev,
      walletBalance: (prev.walletBalance || 0) + amount,
    }));
    return {
      success: true,
      message: `Nạp thành công ${amount.toLocaleString('vi-VN')} đ vào ví thẩm định VeraFense!`,
    };
  };

  const purchasePlan = (
    planId: string,
    planName: string,
    durationDays: number,
    priceVnd: number,
    tier: AccountTier
  ): { success: boolean; message: string } => {
    const newLicenseKey = `VERA-${tier.toUpperCase()}-${Date.now().toString().slice(-4)}-PAID`;
    const expDate = new Date();
    expDate.setDate(expDate.getDate() + durationDays);

    const newLicense: LicenseInfo = {
      key: newLicenseKey,
      tier,
      tierName: planName,
      activatedAt: new Date().toLocaleDateString('vi-VN'),
      expiresAt: expDate.toLocaleDateString('vi-VN'),
      daysRemaining: durationDays,
      deviceLinked: 'Máy trạm cá nhân (Trình duyệt hiện tại)',
      organization: 'Tài khoản Thanh Toán Hợp Lệ',
      isValid: true,
    };

    setAccount((prev) => {
      const currentBalance = prev.walletBalance || 0;
      const newBalance = currentBalance >= priceVnd ? currentBalance - priceVnd : currentBalance;
      return {
        ...prev,
        tier,
        license: newLicense,
        dailyQuotaMax: 9999,
        walletBalance: newBalance,
      };
    });

    return {
      success: true,
      message: `Kích hoạt thành công gói "${planName}" (${durationDays} ngày)! Quota thẩm định không giới hạn đã sẵn sàng.`,
    };
  };

  const activateLicense = (rawKey: string): { success: boolean; message: string } => {
    const cleanKey = rawKey.trim().toUpperCase();
    if (!cleanKey) {
      return { success: false, message: 'Vui lòng nhập mã giấy phép bản quyền!' };
    }

    const match = MOCK_LICENSES[cleanKey];
    if (match) {
      const newLicense: LicenseInfo = {
        key: cleanKey,
        tier: match.tier,
        tierName: match.tierName,
        activatedAt: new Date().toLocaleDateString('vi-VN'),
        expiresAt: '07/09/2027',
        daysRemaining: match.days,
        deviceLinked: 'Máy trạm bảo mật (Trình duyệt hiện tại)',
        organization: match.org || 'Bản quyền Cá nhân',
        isValid: true,
      };

      setAccount({
        ...account,
        tier: match.tier,
        license: newLicense,
        dailyQuotaMax: 9999,
      });

      return {
        success: true,
        message: `Kích hoạt thành công ${match.tierName}! Toàn bộ dữ liệu chuyên sâu đã được mở khóa.`,
      };
    }

    if (cleanKey.startsWith('VERA-') && cleanKey.length >= 12) {
      const tier: AccountTier = cleanKey.includes('ENT') ? 'enterprise' : 'pro';
      const tierName = tier === 'enterprise' ? 'Gói Doanh Nghiệp & Pháp Lý' : 'Gói Chuyên Viên Điều Tra Số';

      const newLicense: LicenseInfo = {
        key: cleanKey,
        tier,
        tierName,
        activatedAt: new Date().toLocaleDateString('vi-VN'),
        expiresAt: '07/09/2027',
        daysRemaining: 365,
        deviceLinked: 'Thiết bị làm việc chính thức',
        organization: 'Bản quyền Đã Kích Hoạt',
        isValid: true,
      };

      setAccount({
        ...account,
        tier,
        license: newLicense,
        dailyQuotaMax: 9999,
      });

      return {
        success: true,
        message: `Kích hoạt thành công Giấy Phép Bản Quyền ${tierName}!`,
      };
    }

    return {
      success: false,
      message: 'Mã giấy phép không hợp lệ. Hãy thử mã mẫu: VERA-PRO-2026-CYBER hoặc VERA-ENT-2026-VIP',
    };
  };

  const deactivateLicense = () => {
    setAccount({
      ...account,
      tier: 'free',
      license: null,
      dailyQuotaMax: 50,
      dailyQuotaUsed: 0,
    });
  };

  const consumeQuota = (): boolean => {
    if (isPro) return true;
    if (account.dailyQuotaUsed >= account.dailyQuotaMax) {
      return false;
    }
    setAccount((prev) => ({
      ...prev,
      dailyQuotaUsed: prev.dailyQuotaUsed + 1,
    }));
    return true;
  };

  const resetQuota = () => {
    setAccount((prev) => ({
      ...prev,
      dailyQuotaUsed: 0,
    }));
  };

  const switchTierDirectly = (tier: AccountTier) => {
    if (tier === 'free') {
      deactivateLicense();
    } else if (tier === 'pro') {
      activateLicense('VERA-PRO-2026-CYBER');
    } else {
      activateLicense('VERA-ENT-2026-VIP');
    }
  };

  return (
    <AccountContext.Provider
      value={{
        account,
        isLoggedIn,
        isPro,
        isEnterprise,
        register,
        login,
        logout,
        updateUser,
        incrementReportsSubmitted,
        activateLicense,
        deactivateLicense,
        consumeQuota,
        resetQuota,
        switchTierDirectly,
        topUpWallet,
        purchasePlan,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export const useAccount = () => {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error('useAccount must be used within an AccountProvider');
  }
  return context;
};
