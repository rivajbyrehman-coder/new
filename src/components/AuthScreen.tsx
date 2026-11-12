import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SUPPORT_DETAILS } from '../data/plans';
import {
  Lock,
  Phone,
  Mail,
  User,
  Share2,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Globe,
  ArrowRight,
  Eye,
  EyeOff,
} from 'lucide-react';

export const AuthScreen: React.FC = () => {
  const { lang, setLang, login, register, onlineMembers } = useApp();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const isUrdu = lang === 'ur';

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regType, setRegType] = useState<'phone' | 'email'>('phone');
  const [regContact, setRegContact] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regRefCode, setRegRefCode] = useState('rehman_99');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(loginIdentifier, loginPassword);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (regPassword !== regConfirmPassword) {
      alert(isUrdu ? 'Password match nahi kar raha' : 'Passwords do not match');
      return;
    }
    register(regName, regContact, regPassword, regRefCode);
  };

  const handleQuickTestLogin = () => {
    setLoginIdentifier('03001234567');
    setLoginPassword('123456');
    login('03001234567', '123456');
  };

  const handleEmailTestLogin = () => {
    setLoginIdentifier('trader@7xtrading.app');
    setLoginPassword('123456');
  };

  return (
    <div className="min-h-screen bg-[#0b0e14] text-slate-100 flex flex-col justify-center items-center px-4 py-8 selection:bg-amber-500 selection:text-slate-950">
      {/* Background Glow */}
      <div className="fixed -top-24 -left-24 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="fixed -bottom-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Language Switcher Bar */}
      <div className="w-full max-w-md flex justify-end mb-4">
        <button
          onClick={() => setLang(lang === 'ur' ? 'en' : 'ur')}
          className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-all"
        >
          <Globe className="w-3.5 h-3.5 text-amber-400" />
          <span>{lang === 'ur' ? 'English' : 'Roman Urdu'}</span>
        </button>
      </div>

      {/* Main Auth Container */}
      <div className="w-full max-w-md bg-gradient-to-b from-[#121824] via-[#0f141f] to-[#0a0d14] border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-black text-3xl mx-auto shadow-lg shadow-amber-950/40 mb-3 border border-amber-300/40">
            7X
          </div>
          <h1 className="text-2xl font-black text-white flex items-center justify-center gap-1.5 tracking-tight">
            <span>7x Trading</span>
            <TrendingUp className="w-5 h-5 text-emerald-400 inline" />
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {isUrdu ? 'Rozana Guaranteed Munafa Kamane Ka Mehfooz Platform' : 'Premier PKR Online Investment Platform'}
          </p>

          {/* Dynamic Live Online Members Ticker */}
          <div className="inline-flex items-center gap-2 mt-3 px-3.5 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-emerald-400 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="font-bold font-mono">
              {onlineMembers.toLocaleString()} {isUrdu ? 'Live Afraad Online Hain' : 'Live Members Online'}
            </span>
          </div>
        </div>

        {/* Tab Switcher (Login vs Register) */}
        <div className="grid grid-cols-2 p-1 bg-[#0a0d14] rounded-2xl border border-slate-800 mb-4 text-xs font-bold">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`py-2.5 rounded-xl transition-all ${
              mode === 'login'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {isUrdu ? 'Login Karein' : 'Sign In'}
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`py-2.5 rounded-xl transition-all ${
              mode === 'register'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {isUrdu ? 'Naya Account (Register)' : 'Register Account'}
          </button>
        </div>

        {/* Compulsory Requirement Notice */}
        <div className="mb-4 bg-amber-500/10 border border-amber-500/20 rounded-xl p-2.5 flex items-center gap-2 text-[11px] text-amber-300">
          <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            {isUrdu
              ? 'App istemal karne ke liye Mobile Number ya Email se Register ya Login karein.'
              : 'Must register or log in with Mobile Number or Email to access the app.'}
          </span>
        </div>

        {/* LOGIN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {isUrdu ? 'Mobile Number ya Email Address:' : 'Mobile Number or Email:'}
              </label>
              <div className="relative">
                {loginIdentifier.includes('@') ? (
                  <Mail className="w-4 h-4 text-amber-400 absolute left-3 top-1/2 -translate-y-1/2" />
                ) : (
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                )}
                <input
                  type="text"
                  required
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  placeholder={isUrdu ? '03XXXXXXXXX ya aapka@email.com' : '03XXXXXXXXX or user@email.com'}
                  className="w-full bg-[#0a0d14] border border-slate-800 focus:border-amber-500 rounded-xl py-2.5 pl-9 pr-3 text-sm text-white font-mono placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {isUrdu ? 'Password:' : 'Password:'}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#0a0d14] border border-slate-800 focus:border-amber-500 rounded-xl py-2.5 pl-9 pr-10 text-sm text-white font-mono placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[10px] text-amber-400/90 mt-1">
                {isUrdu
                  ? '⚠️ Sirf apna real registered password darj karein. Kisi doosre password se login nahi hoga.'
                  : '⚠️ Only your registered password is valid. Any other password will be rejected.'}
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black py-3 px-4 rounded-xl shadow-lg shadow-amber-950/40 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] text-sm"
            >
              <span>{isUrdu ? 'Account Mein Dakhil Hon' : 'Log In to Account'}</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          </form>
        )}

        {/* REGISTER FORM */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isUrdu ? 'Aap Ka Pura Naam (Full Name):' : 'Full Name:'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder={isUrdu ? 'Misal: Muhammad Rehman' : 'e.g. John Doe'}
                  className="w-full bg-[#0a0d14] border border-slate-800 focus:border-amber-500 rounded-xl py-2 pl-9 pr-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Contact Type Selector: Mobile Number OR Email */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  {isUrdu ? 'Registration Ka Tareeqa:' : 'Contact Information:'}
                </label>
                <div className="flex gap-1 bg-[#0a0d14] p-0.5 rounded-lg border border-slate-800 text-[10px]">
                  <button
                    type="button"
                    onClick={() => {
                      setRegType('phone');
                      setRegContact('');
                    }}
                    className={`px-2 py-0.5 rounded flex items-center gap-1 font-bold ${
                      regType === 'phone' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Phone className="w-3 h-3" />
                    <span>Mobile</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRegType('email');
                      setRegContact('');
                    }}
                    className={`px-2 py-0.5 rounded flex items-center gap-1 font-bold ${
                      regType === 'email' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Mail className="w-3 h-3" />
                    <span>Email</span>
                  </button>
                </div>
              </div>

              <div className="relative">
                {regType === 'email' ? (
                  <Mail className="w-4 h-4 text-amber-400 absolute left-3 top-1/2 -translate-y-1/2" />
                ) : (
                  <Phone className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
                )}
                <input
                  type={regType === 'email' ? 'email' : 'tel'}
                  required
                  value={regContact}
                  onChange={(e) => setRegContact(e.target.value)}
                  placeholder={
                    regType === 'email'
                      ? 'aapka_email@gmail.com'
                      : '03XXXXXXXXX (EasyPaisa / JazzCash)'
                  }
                  className="w-full bg-[#0a0d14] border border-slate-800 focus:border-amber-500 rounded-xl py-2 pl-9 pr-3 text-sm text-white font-mono placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                {regType === 'email'
                  ? isUrdu ? 'Email address darj karein' : 'Enter your valid email address'
                  : isUrdu ? '11-digit Pakistani mobile number darj karein' : 'Enter valid 11-digit mobile number'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {isUrdu ? 'Password:' : 'Password:'}
                </label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="••••••"
                    className="w-full bg-[#0a0d14] border border-slate-800 focus:border-amber-500 rounded-xl py-2 pl-8 pr-2 text-sm text-white font-mono placeholder:text-slate-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {isUrdu ? 'Confirm Pass:' : 'Confirm:'}
                </label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="••••••"
                    className="w-full bg-[#0a0d14] border border-slate-800 focus:border-amber-500 rounded-xl py-2 pl-8 pr-2 text-sm text-white font-mono placeholder:text-slate-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isUrdu ? 'Referral Code (Optional):' : 'Referral Code:'}
              </label>
              <div className="relative">
                <Share2 className="w-4 h-4 text-amber-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={regRefCode}
                  onChange={(e) => setRegRefCode(e.target.value)}
                  placeholder="rehman_99"
                  className="w-full bg-[#0a0d14] border border-slate-800 focus:border-amber-500 rounded-xl py-2 pl-9 pr-3 text-xs text-amber-300 font-mono focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black py-3 px-4 rounded-xl shadow-lg shadow-amber-950/40 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] text-sm mt-2"
            >
              <span>{isUrdu ? 'Naya Account Banayein' : 'Register Account'}</span>
              <CheckCircle2 className="w-4 h-4 stroke-[3]" />
            </button>
          </form>
        )}

        {/* Quick Demo & Test Logins */}
        <div className="mt-5 pt-4 border-t border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>{isUrdu ? 'Fauri Dakhla (Test Accounts):' : 'Instant Test Logins:'}</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleQuickTestLogin}
              className="py-2.5 px-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-amber-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>{isUrdu ? 'Mobile User Login' : 'Mobile User Login'}</span>
            </button>

            <button
              type="button"
              onClick={handleEmailTestLogin}
              className="py-2.5 px-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-blue-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
            >
              <Mail className="w-3.5 h-3.5 text-blue-400" />
              <span>{isUrdu ? 'Email User Login' : 'Email User Login'}</span>
            </button>
          </div>
        </div>

        {/* WhatsApp Help Support Link */}
        <div className="mt-4 text-center">
          <a
            href={SUPPORT_DETAILS.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:underline font-medium"
          >
            <span>
              {isUrdu
                ? 'Account ya login mein masla? WhatsApp Help par rabta karein'
                : 'Need help? Contact official WhatsApp Support'}
            </span>
          </a>
        </div>
      </div>
    </div>
  );
};
