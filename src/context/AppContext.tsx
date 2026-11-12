import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { Language, PaymentMethod, Plan, ActiveInvestment, Transaction, ReferralMember, RealTeamMember, UserProfile } from '../types';
import { OFFICIAL_PLANS, PAYMENT_METHODS, PaymentMethodDetail } from '../data/plans';
import { translations } from '../translations';

interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  lang: Language;
  t: typeof translations.ur;
  setLang: (lang: Language) => void;
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (phone: string, pass: string) => boolean;
  register: (name: string, phone: string, pass: string, refCode?: string) => boolean;
  logout: () => void;
  onlineMembers: number;
  refreshOnlineCount: () => void;
  balance: number;
  activeInvestments: ActiveInvestment[];
  transactions: Transaction[];
  referrals: ReferralMember[];
  realTeam: RealTeamMember[];
  canClaimProfit: boolean;
  dailyPotentialIncome: number;
  totalProfitEarned: number;
  toasts: ToastMessage[];
  dismissToast: (id: string) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  buyPlan: (plan: Plan) => boolean;
  deposit: (amount: number, method: PaymentMethod, tid: string) => boolean;
  withdraw: (amount: number, method: PaymentMethod, accountNumber: string, accountName: string) => boolean;
  claimDailyProfit: () => void;
  approveDeposit: (txId: string) => boolean;
  rejectDeposit: (txId: string, reason?: string) => boolean;
  pendingDepositsCount: number;
  approveWithdrawal: (txId: string) => boolean;
  rejectWithdrawal: (txId: string, reason?: string) => boolean;
  pendingWithdrawalsCount: number;
  paymentMethods: Record<PaymentMethod, PaymentMethodDetail>;
  updatePaymentMethod: (
    methodId: PaymentMethod,
    updates: { accountNumber: string; accountName: string; bankName?: string }
  ) => boolean;
  resetPaymentMethods: () => void;
  registeredUsers: UserProfile[];
  clearAllRegisteredUsers: () => void;
  resetData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = '7x_trading_app_state_v1';

const DEFAULT_REFERRALS: ReferralMember[] = [
  { id: 'ref-1', name: 'Zeeshan Ali', phone: '0302-984****', joinDate: '2025-05-10', tier: 1, commissionEarned: 675, status: 'active' },
  { id: 'ref-2', name: 'Muhammad Usman', phone: '0345-712****', joinDate: '2025-05-11', tier: 1, commissionEarned: 450, status: 'active' },
  { id: 'ref-3', name: 'Hamza Tariq', phone: '0312-553****', joinDate: '2025-05-12', tier: 2, commissionEarned: 150, status: 'active' },
  { id: 'ref-4', name: 'Kamran Khan', phone: '0333-891****', joinDate: '2025-05-13', tier: 3, commissionEarned: 90, status: 'active' },
];

const DEFAULT_REGISTERED_USERS: UserProfile[] = [
  {
    id: '7X-10001',
    name: 'Demo Mobile User',
    contact: '03001234567',
    phone: '03001234567',
    password: '123456',
    referralCode: 'ref_4567',
    referredBy: 'rehman_99',
    createdAt: '2025-05-01T10:00:00.000Z',
    role: 'user',
  },
  {
    id: '7X-10002',
    name: 'Demo Email User',
    contact: 'trader@7xtrading.app',
    email: 'trader@7xtrading.app',
    password: '123456',
    referralCode: 'ref_trader',
    referredBy: 'ref_4567',
    createdAt: '2025-05-02T12:00:00.000Z',
    role: 'user',
  },
  {
    id: '7X-10821',
    name: 'Zeeshan Ali',
    contact: '03029841234',
    phone: '03029841234',
    password: 'password123',
    referralCode: 'ref_zeeshan',
    referredBy: 'ref_4567',
    createdAt: '2025-05-10T10:00:00.000Z',
    role: 'user',
  },
  {
    id: '7X-10822',
    name: 'Muhammad Usman',
    contact: '03457125678',
    phone: '03457125678',
    password: 'password123',
    referralCode: 'ref_usman',
    referredBy: 'ref_zeeshan',
    createdAt: '2025-05-11T11:30:00.000Z',
    role: 'user',
  },
  {
    id: '7X-10823',
    name: 'Hamza Tariq',
    contact: '03125539012',
    phone: '03125539012',
    password: 'password123',
    referralCode: 'ref_hamza',
    referredBy: 'ref_zeeshan',
    createdAt: '2025-05-12T14:15:00.000Z',
    role: 'user',
  },
  {
    id: '7X-10824',
    name: 'Kamran Khan',
    contact: '03338913456',
    phone: '03338913456',
    password: 'password123',
    referralCode: 'ref_kamran',
    referredBy: 'ref_usman',
    createdAt: '2025-05-13T16:45:00.000Z',
    role: 'user',
  },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('7x_lang') || localStorage.getItem('4x_lang');
    return (saved === 'en' || saved === 'ur') ? saved : 'ur';
  });

  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const savedUser = localStorage.getItem('7x_auth_user_profile');
      if (savedUser) {
        const parsed: UserProfile = JSON.parse(savedUser);
        const contact = (parsed.contact || parsed.phone || '').replace(/[-\s+]/g, '');
        const isValidAdmin = contact === '03492928370' || contact === '923492928370';
        if (parsed.role === 'admin' && !isValidAdmin) {
          parsed.role = 'user';
        }
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  });

  const getRandomOnlineCount = () => Math.floor(2450 + Math.random() * 450);
  const [onlineMembers, setOnlineMembers] = useState<number>(getRandomOnlineCount);

  // Fluctuating online members dynamically every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setOnlineMembers((prev) => {
        const delta = Math.floor(Math.random() * 9) - 4; // -4 to +4
        const next = prev + delta;
        return next < 2350 ? 2420 : next > 3100 ? 2950 : next;
      });
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const refreshOnlineCount = () => {
    setOnlineMembers(getRandomOnlineCount());
  };

  const [balance, setBalance] = useState<number>(0);
  const [activeInvestments, setActiveInvestments] = useState<ActiveInvestment[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [referrals, setReferrals] = useState<ReferralMember[]>(DEFAULT_REFERRALS);
  const [lastClaimDate, setLastClaimDate] = useState<string>('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const PAYMENT_STORAGE_KEY = '7x_deposit_payment_methods_v2';
  const [paymentMethods, setPaymentMethods] = useState<Record<PaymentMethod, PaymentMethodDetail>>(() => {
    try {
      const saved = localStorage.getItem(PAYMENT_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
      return PAYMENT_METHODS;
    } catch {
      return PAYMENT_METHODS;
    }
  });

  const USERS_STORAGE_KEY = '7x_registered_users_list_v3';
  const [registeredUsers, setRegisteredUsers] = useState<UserProfile[]>(() => {
    try {
      const saved = localStorage.getItem(USERS_STORAGE_KEY);
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
      return DEFAULT_REGISTERED_USERS;
    } catch {
      return DEFAULT_REGISTERED_USERS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(registeredUsers));
    } catch {
      // storage error
    }
  }, [registeredUsers]);

  // Initialize from localStorage (Zero demo balance policy)
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('4x_trading_app_state_v1');
      if (savedData) {
        const parsed = JSON.parse(savedData);
        // Exclude legacy demo transactions if any exist
        const filteredTx = Array.isArray(parsed.transactions)
          ? parsed.transactions.filter((tx: Transaction) => tx.id !== 'tx-welcome' && !tx.id?.startsWith('tx-demo-'))
          : [];
        setTransactions(filteredTx);

        if (Array.isArray(parsed.activeInvestments)) setActiveInvestments(parsed.activeInvestments);
        if (typeof parsed.lastClaimDate === 'string') setLastClaimDate(parsed.lastClaimDate);

        // Deduct legacy demo balance if it was previously credited
        const hadWelcome = Array.isArray(parsed.transactions) && parsed.transactions.some((tx: Transaction) => tx.id === 'tx-welcome');
        let initialBal = typeof parsed.balance === 'number' ? parsed.balance : 0;
        if (hadWelcome && initialBal >= 500) {
          initialBal -= 500;
        }
        setBalance(Math.max(0, initialBal));
      } else {
        // Initial user balance is 0 PKR (No demo balance given)
        setBalance(0);
        setTransactions([]);
      }
    } catch {
      setBalance(0);
      setTransactions([]);
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    try {
      const stateToSave = {
        balance,
        activeInvestments,
        transactions,
        lastClaimDate,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch {
      // storage error
    }
  }, [balance, activeInvestments, transactions, lastClaimDate]);

  // Sync lang with HTML attributes (Roman Urdu is written in Latin script LTR)
  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('7x_lang', newLang);
    document.documentElement.lang = newLang;
    document.documentElement.dir = 'ltr';
  };

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = 'ltr';
  }, [lang]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#ff4500', '#ffb703', '#ffffff', '#22c55e'],
      });
    } catch {
      // no-op
    }
  };

  // Check if user has active plans and can claim today
  const todayStr = new Date().toISOString().split('T')[0];
  const canClaimProfit = activeInvestments.length > 0 && lastClaimDate !== todayStr;

  const dailyPotentialIncome = activeInvestments.reduce((sum, item) => sum + item.dailyProfit, 0);
  const totalProfitEarned = activeInvestments.reduce((sum, item) => sum + item.totalEarned, 0);

  // Real Team & Sathiyan Calculation for the currently logged-in customer
  const realTeam: RealTeamMember[] = useMemo(() => {
    if (!user) return [];

    const userCode = (user.referralCode || '').toLowerCase().trim();
    const userContact = (user.contact || user.phone || '').toLowerCase().replace(/[-\s+]/g, '').trim();

    // Level 1 (Direct Sathiyan): Registered with customer's referral code or mobile/email
    const level1Users = registeredUsers.filter((u) => {
      if (u.id === user.id) return false;
      const ref = (u.referredBy || '').toLowerCase().trim();
      const refClean = ref.replace(/[-\s+]/g, '');
      return (userCode && ref === userCode) || (userContact && (ref === userContact || refClean === userContact));
    });

    const level1Codes = new Set(level1Users.map((u) => (u.referralCode || '').toLowerCase().trim()).filter(Boolean));
    const level1Contacts = new Set(level1Users.map((u) => (u.contact || u.phone || '').toLowerCase().replace(/[-\s+]/g, '').trim()).filter(Boolean));

    // Level 2 (Tier 2): Registered under Level 1 members
    const level2Users = registeredUsers.filter((u) => {
      if (u.id === user.id || level1Users.some((l1) => l1.id === u.id)) return false;
      const ref = (u.referredBy || '').toLowerCase().trim();
      const refClean = ref.replace(/[-\s+]/g, '');
      return level1Codes.has(ref) || level1Contacts.has(refClean);
    });

    const level2Codes = new Set(level2Users.map((u) => (u.referralCode || '').toLowerCase().trim()).filter(Boolean));
    const level2Contacts = new Set(level2Users.map((u) => (u.contact || u.phone || '').toLowerCase().replace(/[-\s+]/g, '').trim()).filter(Boolean));

    // Level 3 (Tier 3): Registered under Level 2 members
    const level3Users = registeredUsers.filter((u) => {
      if (u.id === user.id || level1Users.some((l1) => l1.id === u.id) || level2Users.some((l2) => l2.id === u.id)) return false;
      const ref = (u.referredBy || '').toLowerCase().trim();
      const refClean = ref.replace(/[-\s+]/g, '');
      return level2Codes.has(ref) || level2Contacts.has(refClean);
    });

    const mapMember = (u: UserProfile, tier: 1 | 2 | 3): RealTeamMember => {
      const uplineUser = registeredUsers.find(
        (p) =>
          (p.referralCode && p.referralCode.toLowerCase() === u.referredBy?.toLowerCase().trim()) ||
          (p.contact && p.contact.replace(/[-\s+]/g, '') === u.referredBy?.toLowerCase().replace(/[-\s+]/g, '').trim())
      );
      // Realistic tiered commission calculation: Tier 1: PKR 675, Tier 2: PKR 225, Tier 3: PKR 90
      const commission = tier === 1 ? 675 : tier === 2 ? 225 : 90;

      return {
        id: u.id,
        name: u.name,
        contact: u.contact || u.phone || u.email || 'N/A',
        phone: u.phone,
        email: u.email,
        joinDate: u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Active',
        tier,
        uplineCode: u.referredBy || '',
        uplineName: uplineUser?.name,
        referralCode: u.referralCode,
        status: 'active',
        commissionEarned: commission,
      };
    };

    return [
      ...level1Users.map((u) => mapMember(u, 1)),
      ...level2Users.map((u) => mapMember(u, 2)),
      ...level3Users.map((u) => mapMember(u, 3)),
    ];
  }, [user, registeredUsers]);

  const buyPlan = (plan: Plan): boolean => {
    if (balance < plan.price) {
      showToast(translations[lang].insufficientBalance, 'error');
      return false;
    }

    const newInvestment: ActiveInvestment = {
      id: `inv-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      planId: plan.id,
      planName: plan.name,
      planNameUrdu: plan.nameUrdu,
      investedAmount: plan.price,
      dailyProfit: plan.dailyProfit,
      startDate: new Date().toISOString(),
      totalDays: plan.durationDays,
      daysPassed: 0,
      lastClaimDate: '',
      totalEarned: 0,
      status: 'active',
    };

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      type: 'investment',
      amount: plan.price,
      date: new Date().toISOString(),
      status: 'completed',
      note: `${plan.nameUrdu} (${plan.name})`,
    };

    setBalance((prev) => prev - plan.price);
    setActiveInvestments((prev) => [newInvestment, ...prev]);
    setTransactions((prev) => [newTx, ...prev]);

    triggerCelebration();
    showToast(translations[lang].planActivatedSuccess, 'success');
    return true;
  };

  const deposit = (amount: number, method: PaymentMethod, tid: string): boolean => {
    if (!amount || amount <= 0) {
      showToast(lang === 'ur' ? 'Durust raqam darj karein' : 'Please enter a valid amount', 'error');
      return false;
    }
    if (!tid || tid.trim().length < 4) {
      showToast(lang === 'ur' ? 'Durust Transaction ID (TID) darj karein' : 'Please enter a valid Transaction ID', 'error');
      return false;
    }

    const newTx: Transaction = {
      id: `tx-dep-${Date.now()}`,
      type: 'deposit',
      amount,
      method,
      tid: tid.trim().toUpperCase(),
      date: new Date().toISOString(),
      status: 'pending',
      note: `TID: ${tid.trim().toUpperCase()} • Admin Review`,
    };

    // Balance is NOT credited immediately; requires Admin Approval
    setTransactions((prev) => [newTx, ...prev]);

    showToast(translations[lang].depositSuccessMsg, 'info');
    return true;
  };

  const approveDeposit = (txId: string): boolean => {
    const tx = transactions.find((t) => t.id === txId && t.type === 'deposit');
    if (!tx) return false;
    if (tx.status === 'completed') {
      showToast(lang === 'ur' ? 'Yeh deposit pehle hi approve ho chuka hai' : 'This deposit is already approved', 'info');
      return false;
    }

    setTransactions((prev) =>
      prev.map((t) =>
        t.id === txId
          ? { ...t, status: 'completed' as const, note: `Admin Approved • TID: ${t.tid || 'DIRECT'}` }
          : t
      )
    );
    setBalance((prev) => prev + tx.amount);
    triggerCelebration();
    showToast(
      lang === 'ur'
        ? `PKR ${tx.amount.toLocaleString()} ka deposit admin ne approve kar diya! Balance credit ho gaya.`
        : `Deposit of PKR ${tx.amount.toLocaleString()} approved by admin! Wallet credited.`,
      'success'
    );
    return true;
  };

  const rejectDeposit = (txId: string, reason?: string): boolean => {
    const tx = transactions.find((t) => t.id === txId && t.type === 'deposit');
    if (!tx) return false;

    setTransactions((prev) =>
      prev.map((t) =>
        t.id === txId
          ? { ...t, status: 'rejected' as const, note: `Admin Rejected: ${reason || 'Invalid TID'}` }
          : t
      )
    );
    showToast(translations[lang].depositRejectedMsg, 'error');
    return true;
  };

  const pendingDepositsCount = transactions.filter((t) => t.type === 'deposit' && t.status === 'pending').length;
  const pendingWithdrawalsCount = transactions.filter((t) => t.type === 'withdraw' && t.status === 'pending').length;

  const withdraw = (amount: number, method: PaymentMethod, accountNumber: string, accountName: string): boolean => {
    if (!amount || amount < 150) {
      showToast(
        lang === 'ur' ? 'Kam az kam withdrawal ki had PKR 150 hai' : 'Minimum withdrawal amount is PKR 150',
        'error'
      );
      return false;
    }
    if (amount > balance) {
      showToast(translations[lang].insufficientBalance, 'error');
      return false;
    }
    if (!accountNumber || accountNumber.trim().length < 8) {
      showToast(lang === 'ur' ? 'Durust account number darj karein' : 'Please enter a valid account number', 'error');
      return false;
    }
    if (!accountName || accountName.trim().length < 3) {
      showToast(lang === 'ur' ? 'Account holder ka naam darj karein' : 'Please enter account holder name', 'error');
      return false;
    }

    const newTx: Transaction = {
      id: `tx-wd-${Date.now()}`,
      type: 'withdraw',
      amount,
      method,
      accountNumber: accountNumber.trim(),
      accountName: accountName.trim(),
      date: new Date().toISOString(),
      status: 'pending', // Awaiting Admin Approval
      note: `${method.toUpperCase()}: ${accountNumber.trim()} (${accountName.trim()}) • Admin Review`,
    };

    // Amount is held/deducted from user balance immediately
    setBalance((prev) => prev - amount);
    setTransactions((prev) => [newTx, ...prev]);

    showToast(
      lang === 'ur'
        ? 'Withdrawal request admin ko bhej di gayi hai! Approval ke baad raqam foran bhej di jaye gi (Status: Pending).'
        : 'Withdrawal request submitted! Funds will be transferred after admin approval (Status: Pending).',
      'info'
    );
    return true;
  };

  const approveWithdrawal = (txId: string): boolean => {
    const tx = transactions.find((t) => t.id === txId && t.type === 'withdraw');
    if (!tx) return false;
    if (tx.status === 'completed') {
      showToast(lang === 'ur' ? 'Yeh withdrawal pehle hi approve ho chuki hai' : 'This withdrawal is already approved', 'info');
      return false;
    }

    setTransactions((prev) =>
      prev.map((t) =>
        t.id === txId
          ? { ...t, status: 'completed' as const, note: `Admin Approved & Paid • ${t.accountNumber || ''} (${t.accountName || ''})` }
          : t
      )
    );
    triggerCelebration();
    showToast(
      lang === 'ur'
        ? `PKR ${tx.amount.toLocaleString()} ki withdrawal approve ho kar customer ke account mein bhej di gayi!`
        : `Withdrawal of PKR ${tx.amount.toLocaleString()} approved and paid!`,
      'success'
    );
    return true;
  };

  const rejectWithdrawal = (txId: string, reason?: string): boolean => {
    const tx = transactions.find((t) => t.id === txId && t.type === 'withdraw');
    if (!tx) return false;

    setTransactions((prev) =>
      prev.map((t) =>
        t.id === txId
          ? { ...t, status: 'rejected' as const, note: `Admin Rejected: ${reason || 'Details issue'} • Refunded` }
          : t
      )
    );
    // Refund the deducted amount back to user wallet balance
    setBalance((prev) => prev + tx.amount);
    showToast(
      lang === 'ur'
        ? `Withdrawal reject kar di gayi aur PKR ${tx.amount.toLocaleString()} wallet mein refund kar diye gaye.`
        : `Withdrawal rejected. PKR ${tx.amount.toLocaleString()} refunded to user wallet.`,
      'error'
    );
    return true;
  };

  const claimDailyProfit = () => {
    if (!canClaimProfit) {
      showToast(translations[lang].claimedToday, 'info');
      return;
    }

    let profitGained = 0;
    const updatedInvestments = activeInvestments.map((inv) => {
      if (inv.status === 'active' && inv.daysPassed < inv.totalDays) {
        profitGained += inv.dailyProfit;
        const newDaysPassed = inv.daysPassed + 1;
        return {
          ...inv,
          daysPassed: newDaysPassed,
          totalEarned: inv.totalEarned + inv.dailyProfit,
          lastClaimDate: todayStr,
          status: (newDaysPassed >= inv.totalDays ? 'completed' : 'active') as 'active' | 'completed',
        };
      }
      return inv;
    });

    if (profitGained > 0) {
      setBalance((prev) => prev + profitGained);
      setActiveInvestments(updatedInvestments);
      setLastClaimDate(todayStr);

      const profitTx: Transaction = {
        id: `tx-profit-${Date.now()}`,
        type: 'profit',
        amount: profitGained,
        date: new Date().toISOString(),
        status: 'completed',
        note: `Rozana Munafa (${updatedInvestments.length} Active Plans)`,
      };
      setTransactions((prev) => [profitTx, ...prev]);

      triggerCelebration();
      showToast(`${translations[lang].profitClaimedMsg} (+PKR ${profitGained.toLocaleString()})`, 'success');
    }
  };

  const login = (identifier: string, pass: string): boolean => {
    const raw = identifier.trim();
    if (!raw) {
      showToast(lang === 'ur' ? 'Mobile number ya Email darj karein' : 'Please enter mobile number or email', 'error');
      return false;
    }
    const isEmail = raw.includes('@');
    if (isEmail) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw)) {
        showToast(lang === 'ur' ? 'Durust email address darj karein' : 'Please enter a valid email address', 'error');
        return false;
      }
    } else {
      const cleanPhone = raw.replace(/[-\s]/g, '');
      if (cleanPhone.length < 10) {
        showToast(lang === 'ur' ? 'Durust 11 digits ka mobile number darj karein' : 'Please enter a valid 11-digit mobile number', 'error');
        return false;
      }
    }

    if (!pass || pass.length < 4) {
      showToast(lang === 'ur' ? 'Kam az kam 4 digits ka password darj karein' : 'Password must be at least 4 characters', 'error');
      return false;
    }

    const cleanContact = isEmail ? raw.toLowerCase() : raw.replace(/[-\s+]/g, '');
    const isAdminContact = cleanContact === '03492928370' || cleanContact === '923492928370';

    if (isAdminContact) {
      if (pass !== 'Rehman@124') {
        showToast(
          lang === 'ur'
            ? 'Ghalat Admin Password! Sirf durust Admin password se login ho sakta hai.'
            : 'Invalid Admin Password! Access denied.',
          'error'
        );
        return false;
      }
    }

    const isAdmin = isAdminContact && pass === 'Rehman@124';

    let profile: UserProfile;

    if (isAdmin) {
      profile = {
        id: '7X-ADMIN-01',
        name: 'Admin (Rehman)',
        contact: '03492928370',
        phone: '03492928370',
        referralCode: 'admin_rehman',
        createdAt: '2025-01-01T00:00:00.000Z',
        role: 'admin',
      };
    } else {
      // STRICT RULE: Jis ka number register na ho wo login na kar saky pehly register kary!
      const found = registeredUsers.find(
        (u) =>
          u.contact?.toLowerCase() === cleanContact ||
          (u.phone && u.phone.replace(/[-\s+]/g, '') === cleanContact) ||
          (u.email && u.email.toLowerCase() === cleanContact)
      );

      if (!found) {
        showToast(
          lang === 'ur'
            ? 'Yeh mobile number / email register nahi hai! Barah-e-karam pehle "Naya Account (Register)" banayein.'
            : 'This account is not registered. Please register a new account first.',
          'error'
        );
        return false;
      }

      if (!found.password || found.password !== pass) {
        showToast(
          lang === 'ur'
            ? 'Ghalat password darj kiya gaya hai! Sirf durust registered password se login ho sakta hai.'
            : 'Incorrect password! Please enter your registered password.',
          'error'
        );
        return false;
      }

      profile = {
        ...found,
        role: 'user',
      };
    }

    setUser(profile);
    localStorage.setItem('7x_auth_user_profile', JSON.stringify(profile));

    // Dynamic online member count regenerates on every login
    setOnlineMembers(getRandomOnlineCount());

    showToast(
      lang === 'ur'
        ? isAdmin
          ? 'Khush Amdeed Admin! Admin Portal active ho gaya hai.'
          : `Khush Amdeed, ${profile.name}! Login kamyab raha.`
        : isAdmin
        ? 'Welcome Admin! Admin Portal activated.'
        : `Welcome back, ${profile.name}! Login successful.`,
      'success'
    );
    return true;
  };

  const register = (name: string, identifier: string, pass: string, refCode?: string): boolean => {
    const cleanName = name.trim();
    const raw = identifier.trim();

    if (!cleanName || cleanName.length < 3) {
      showToast(lang === 'ur' ? 'Apna mukammal naam darj karein' : 'Please enter your full name', 'error');
      return false;
    }

    const isEmail = raw.includes('@');
    if (isEmail) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw)) {
        showToast(lang === 'ur' ? 'Durust email address darj karein' : 'Please enter a valid email address', 'error');
        return false;
      }
    } else {
      const cleanPhone = raw.replace(/[-\s+]/g, '');
      if (cleanPhone.length < 10) {
        showToast(lang === 'ur' ? 'Durust mobile number darj karein (11 digits)' : 'Please enter valid 11-digit mobile number', 'error');
        return false;
      }
    }

    if (!pass || pass.length < 4) {
      showToast(lang === 'ur' ? 'Password kam az kam 4 huroof ka hona chahiye' : 'Password must be at least 4 characters', 'error');
      return false;
    }

    const cleanContact = isEmail ? raw.toLowerCase() : raw.replace(/[-\s+]/g, '');
    const isAdminContact = cleanContact === '03492928370' || cleanContact === '923492928370';

    if (isAdminContact) {
      showToast(
        lang === 'ur'
          ? 'Yeh number Admin ke liye makhsoos hai. Barah-e-karam apna number darj karein ya direct Login karein.'
          : 'This number is reserved for Admin. Please log in directly.',
        'error'
      );
      return false;
    }

    // Check if already registered
    const alreadyExists = registeredUsers.some(
      (u) =>
        u.contact?.toLowerCase() === cleanContact ||
        (u.phone && u.phone.replace(/[-\s+]/g, '') === cleanContact) ||
        (u.email && u.email.toLowerCase() === cleanContact)
    );

    if (alreadyExists) {
      showToast(
        lang === 'ur'
          ? 'Yeh number / email pehle se registered hai! Barah-e-karam Login karein.'
          : 'This account is already registered! Please log in.',
        'error'
      );
      return false;
    }

    const newProfile: UserProfile = {
      id: `7X-${Math.floor(10000 + Math.random() * 90000)}`,
      name: cleanName,
      contact: cleanContact,
      phone: isEmail ? undefined : cleanContact,
      email: isEmail ? cleanContact : undefined,
      password: pass,
      referralCode: `ref_${cleanContact.slice(-4)}`,
      referredBy: refCode?.trim() || 'rehman_99',
      createdAt: new Date().toISOString(),
      role: 'user', // Customer role ONLY
    };

    setRegisteredUsers((prev) => [newProfile, ...prev]);
    setUser(newProfile);
    localStorage.setItem('7x_auth_user_profile', JSON.stringify(newProfile));

    // Dynamic online member count updates on new registration
    setOnlineMembers(getRandomOnlineCount());

    triggerCelebration();
    showToast(
      lang === 'ur' ? `Mubarak ho ${cleanName}! Aap ka account register ho gaya.` : `Registration successful! Welcome to 7x Trading.`,
      'success'
    );
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('7x_auth_user_profile');
    showToast(lang === 'ur' ? 'Aap ka account logout ho gaya hai' : 'Logged out successfully', 'info');
  };

  const updatePaymentMethod = (
    methodId: PaymentMethod,
    updates: { accountNumber: string; accountName: string; bankName?: string }
  ): boolean => {
    if (!updates.accountNumber || updates.accountNumber.trim().length < 8) {
      showToast(lang === 'ur' ? 'Durust account number darj karein' : 'Please enter a valid account number', 'error');
      return false;
    }
    if (!updates.accountName || updates.accountName.trim().length < 3) {
      showToast(lang === 'ur' ? 'Account title / naam darj karein' : 'Please enter valid account title', 'error');
      return false;
    }

    const raw = updates.accountNumber.replace(/[-\s+]/g, '');

    setPaymentMethods((prev) => {
      const updated = {
        ...prev,
        [methodId]: {
          ...prev[methodId],
          accountNumber: updates.accountNumber.trim(),
          accountNumberRaw: raw,
          accountName: updates.accountName.trim(),
          bankName: updates.bankName !== undefined ? updates.bankName.trim() : prev[methodId].bankName,
        },
      };
      try {
        localStorage.setItem(PAYMENT_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });

    triggerCelebration();
    showToast(
      lang === 'ur'
        ? `${paymentMethods[methodId]?.name || methodId} deposit account details tabdeel ho gaye!`
        : `${paymentMethods[methodId]?.name || methodId} deposit account updated!`,
      'success'
    );
    return true;
  };

  const resetPaymentMethods = () => {
    setPaymentMethods(PAYMENT_METHODS);
    localStorage.removeItem(PAYMENT_STORAGE_KEY);
    showToast(
      lang === 'ur' ? 'Deposit account numbers default par reset kar diye gaye' : 'Deposit accounts reset to default',
      'info'
    );
  };

  const clearAllRegisteredUsers = () => {
    setRegisteredUsers([]);
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([]));
      localStorage.removeItem('7x_registered_users_list');
      // If customer is currently logged in, clear customer auth session
      const savedUser = localStorage.getItem('7x_auth_user_profile');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed.role !== 'admin') {
          setUser(null);
          localStorage.removeItem('7x_auth_user_profile');
        }
      }
    } catch {
      // storage error
    }
    showToast(
      lang === 'ur'
        ? 'Tamam registered users ka data kamyabi se clear ho gaya! Ab koi customer login nahi kar sakta, unhein pehle naya account register karna hoga. (Admin profile mehfooz hai).'
        : 'All registered customer users cleared! Customers cannot log in without registering first. (Admin account is untouched).',
      'success'
    );
  };

  const resetData = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('4x_trading_app_state_v1');
    setBalance(0);
    setActiveInvestments([]);
    setTransactions([]);
    setLastClaimDate('');
    showToast(lang === 'ur' ? 'Data kamyabi se reset kar diya gaya (Balance: PKR 0)' : 'Data reset successfully (Balance: PKR 0)', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        lang,
        t: translations[lang],
        setLang,
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        onlineMembers,
        refreshOnlineCount,
        balance,
        activeInvestments,
        transactions,
        referrals,
        realTeam,
        canClaimProfit,
        dailyPotentialIncome,
        totalProfitEarned,
        toasts,
        dismissToast,
        showToast,
        buyPlan,
        deposit,
        withdraw,
        claimDailyProfit,
        approveDeposit,
        rejectDeposit,
        pendingDepositsCount,
        approveWithdrawal,
        rejectWithdrawal,
        pendingWithdrawalsCount,
        paymentMethods,
        updatePaymentMethod,
        resetPaymentMethods,
        registeredUsers,
        clearAllRegisteredUsers,
        resetData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
