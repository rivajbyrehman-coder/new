import { Plan } from '../types';

export const OFFICIAL_PLANS: Plan[] = [
  {
    id: 1,
    name: 'Plan 1 - Starter',
    nameUrdu: 'Plan 1 - Starter',
    price: 345,
    dailyProfit: 45,
    durationDays: 60,
    totalReturn: 45 * 60, // 2,700 PKR
    roiPercentage: Math.round(((45 * 60) / 345) * 100),
    tag: 'Beginner',
    tagUrdu: 'Starter (Ibtidai)',
    popular: false,
  },
  {
    id: 2,
    name: 'Plan 2 - Basic',
    nameUrdu: 'Plan 2 - Basic',
    price: 800,
    dailyProfit: 110,
    durationDays: 60,
    totalReturn: 110 * 60, // 6,600 PKR
    roiPercentage: Math.round(((110 * 60) / 800) * 100),
    tag: 'Popular',
    tagUrdu: 'Maqbool (Popular)',
    popular: false,
  },
  {
    id: 3,
    name: 'Plan 3 - Silver',
    nameUrdu: 'Plan 3 - Silver',
    price: 1250,
    dailyProfit: 180,
    durationDays: 60,
    totalReturn: 180 * 60, // 10,800 PKR
    roiPercentage: Math.round(((180 * 60) / 1250) * 100),
    tag: 'Hot',
    tagUrdu: 'Hot Plan',
    popular: true,
  },
  {
    id: 4,
    name: 'Plan 4 - Gold',
    nameUrdu: 'Plan 4 - Gold',
    price: 3000,
    dailyProfit: 450,
    durationDays: 60,
    totalReturn: 450 * 60, // 27,000 PKR
    roiPercentage: Math.round(((450 * 60) / 3000) * 100),
    tag: 'Best Value',
    tagUrdu: 'Behtareen Value',
    popular: true,
  },
  {
    id: 5,
    name: 'Plan 5 - Platinum',
    nameUrdu: 'Plan 5 - Platinum',
    price: 4500,
    dailyProfit: 700,
    durationDays: 60,
    totalReturn: 700 * 60, // 42,000 PKR
    roiPercentage: Math.round(((700 * 60) / 4500) * 100),
    tag: 'High Yield',
    tagUrdu: 'Ziada Munafa',
    popular: false,
  },
  {
    id: 6,
    name: 'Plan 6 - Diamond',
    nameUrdu: 'Plan 6 - Diamond',
    price: 9000,
    dailyProfit: 1450,
    durationDays: 60,
    totalReturn: 1450 * 60, // 87,000 PKR
    roiPercentage: Math.round(((1450 * 60) / 9000) * 100),
    tag: 'VIP 1',
    tagUrdu: 'VIP 1 Tier',
    popular: false,
  },
  {
    id: 7,
    name: 'Plan 7 - Master',
    nameUrdu: 'Plan 7 - Master',
    price: 13500,
    dailyProfit: 2200,
    durationDays: 60,
    totalReturn: 2200 * 60, // 132,000 PKR
    roiPercentage: Math.round(((2200 * 60) / 13500) * 100),
    tag: 'VIP 2',
    tagUrdu: 'VIP 2 Tier',
    popular: false,
  },
  {
    id: 8,
    name: 'Plan 8 - Executive',
    nameUrdu: 'Plan 8 - Executive',
    price: 25000,
    dailyProfit: 4200,
    durationDays: 60,
    totalReturn: 4200 * 60, // 252,000 PKR
    roiPercentage: Math.round(((4200 * 60) / 25000) * 100),
    tag: 'Elite',
    tagUrdu: 'Elite Club',
    popular: false,
  },
  {
    id: 9,
    name: 'Plan 9 - Ultra Boss',
    nameUrdu: 'Plan 9 - Ultra Boss',
    price: 45000,
    dailyProfit: 8000,
    durationDays: 60,
    totalReturn: 8000 * 60, // 480,000 PKR
    roiPercentage: Math.round(((8000 * 60) / 45000) * 100),
    tag: 'Maximum',
    tagUrdu: 'Maximum Yield',
    popular: true,
  },
];

export interface PaymentMethodDetail {
  id: 'easypaisa' | 'jazzcash' | 'bank';
  name: string;
  nameUrdu: string;
  bankName?: string;
  accountNumber: string;
  accountNumberRaw: string;
  accountName: string;
  color: string;
  badge: string;
  fee: string;
}

export const PAYMENT_METHODS: Record<'easypaisa' | 'jazzcash' | 'bank', PaymentMethodDetail> = {
  easypaisa: {
    id: 'easypaisa',
    name: 'EasyPaisa',
    nameUrdu: 'EasyPaisa',
    accountNumber: '0310-6241994',
    accountNumberRaw: '03106241994',
    accountName: 'Fozia Kiran',
    color: '#00c853',
    badge: 'Fast / Fauri',
    fee: '0%',
  },
  jazzcash: {
    id: 'jazzcash',
    name: 'JazzCash',
    nameUrdu: 'JazzCash',
    accountNumber: '0345-2094693',
    accountNumberRaw: '03452094693',
    accountName: 'Farhan Ashraf',
    color: '#ff9800',
    badge: 'Instant / Fauri',
    fee: '0%',
  },
  bank: {
    id: 'bank',
    name: 'NayaPay (Bank)',
    nameUrdu: 'NayaPay Bank',
    bankName: 'NayaPay',
    accountNumber: '0310-6241994',
    accountNumberRaw: '03106241994',
    accountName: 'Nida Aqil',
    color: '#3b82f6',
    badge: 'Available / Dastyab',
    fee: '0%',
  },
};

export const PAYMENT_DETAILS = {
  accountNumber: '0310-6241994',
  accountNumberRaw: '03106241994',
  accountName: 'Fozia Kiran',
  methods: Object.values(PAYMENT_METHODS),
};

export const SUPPORT_DETAILS = {
  helpNumber: '0322-5312516',
  helpNumberRaw: '03225312516',
  whatsappUrl: 'https://wa.me/923225312516?text=Salam%2C%20mujhe%207x%20Trading%20App%20mein%20help%20chahiye',
};

