export type Language = 'ur' | 'en';

export type PaymentMethod = 'easypaisa' | 'jazzcash' | 'bank';

export interface Plan {
  id: number;
  name: string;
  nameUrdu: string;
  price: number; // in PKR
  dailyProfit: number; // in PKR
  durationDays: number; // 60 days
  totalReturn: number;
  roiPercentage: number;
  tag?: string;
  tagUrdu?: string;
  popular?: boolean;
}

export interface ActiveInvestment {
  id: string;
  planId: number;
  planName: string;
  planNameUrdu: string;
  investedAmount: number;
  dailyProfit: number;
  startDate: string;
  totalDays: number;
  daysPassed: number;
  lastClaimDate: string;
  totalEarned: number;
  status: 'active' | 'completed';
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'investment' | 'profit' | 'referral_bonus';
  amount: number;
  method?: PaymentMethod;
  accountNumber?: string;
  accountName?: string;
  tid?: string;
  date: string;
  status: 'completed' | 'pending' | 'rejected';
  note?: string;
}

export interface ReferralMember {
  id: string;
  name: string;
  phone: string;
  joinDate: string;
  tier: 1 | 2 | 3;
  commissionEarned: number;
  status: 'active' | 'inactive';
}

export interface RealTeamMember {
  id: string;
  name: string;
  contact: string;
  phone?: string;
  email?: string;
  joinDate: string;
  tier: 1 | 2 | 3;
  uplineCode: string;
  uplineName?: string;
  referralCode: string;
  status: 'active' | 'new';
  commissionEarned: number;
}

export interface UserProfile {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  contact: string; // Mobile number or email address
  password?: string;
  referralCode: string;
  referredBy?: string;
  createdAt: string;
  role: 'user' | 'admin';
}

