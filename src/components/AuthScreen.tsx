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
  Sparkles,
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
    login('trader@7xtrading.app', '123456');
  };

  const handleAdminTestLogin = () => {
    setLoginIdentifier('admin@7xtrading.app');
    setLoginPassword('admin786');
    login('admin@7xtrading.app', 'admin786');
  };

  return (
    <div className="min-h-screen bg-[#120303] text-stone-100 flex flex-col justify-center items-center px-4 py-8 selection:bg-orange-600 selection:text-white">
      {/* Background Glow */}
      <div className="fixed -top-20 -left-20 w-72 h-72 bg-orange-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="fixed -bottom-20 -right-20 w-80 h-80 bg-red-600/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Language Switcher Bar */}
      <div className="w-full max-w-md flex justify-end mb-4">
        <button
          onClick={() => setLang(lang === 'ur' ? 'en' : 'ur')}
          className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-stone-300 transition-all"
        >
          <Globe className="w-3.5 h-3.5 text-amber-400" />
          <span>{lang === 'ur' ? 'English' : 'Roman Urdu'}</span>
        </button>
      </div>

      {/* Main Auth Container */}
      <div className="w-full max-w-md bg-gradient-to-b from-[#2a0909] via-[#1d0606] to-[#140303] border border-orange-500/30 rounded-3xl p-6 shadow-2xl shadow-orange-950/50 relative overflow-hidden">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-stone-950 font-black text-3xl mx-auto shadow-lg shadow-orange-950/60 mb-3 border border-amber-300/40">
            7X
          </div>
          <h1 className="text-2xl font-black text-white flex items-center justify-center gap-1.5 tracking-tight">
            <span>7x Trading</span>
            <TrendingUp className="w-5 h-5 text-amber-400 inline" />
          </h1>
          <p className="text-xs text-orange-200 mt-1">
            {isUrdu ? 'Guaranteed Daily Profit Investment Platform' : 'Premier PKR Online Investment Platform'}
          </p>

          {/* Dynamic Live Online Members Ticker (changes each login) */}
          <div className="inline-flex items-center gap-2 mt-3 px-3.5 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-emerald-400 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="font-bold font-mono">
              {onlineMembers.toLocaleString()} {isUrdu ? 'Live Members Online' : 'Live Members Online'}
            </span>
          </div>
        </div>

        {/* Tab Switcher (Login vs Register) */}
        <div className="grid grid-cols-2 p-1 bg-[#100202] rounded-2xl border border-[#3b0f0f] mb-4 text-xs font-bold">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`py-2.5 rounded-xl transition-all ${
              mode === 'login'
                ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            {isUrdu ? 'Login Karein' : 'Sign In'}
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`py-2.5 rounded-xl transition-all ${
              mode === 'register'
                ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            {isUrdu ? 'Naya Account (Register)' : 'Register Account'}
          </button>
        </div>

        {/* Compulsory Requirement Notice */}
        <div className="mb-4 bg-amber-950/40 border border-amber-500/30 rounded-xl p-2.5 flex items-center gap-2 text-[11px] text-amber-300">
          <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            {isUrdu
              ? 'App use karne ke liye Mobile Number ya Email se Register / Login karein.'
              : 'Must register or log in with Mobile Number or Email to access the app.'}
          </span>
        </div>

        {/* LOGIN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                {isUrdu ? 'Mobile Number ya Email Address:' : 'Mobile Number or Email:'}
              </label>
              <div className="relative">
                {loginIdentifier.includes('@') ? (
                  <Mail className="w-4 h-4 text-amber-400 absolute left-3 top-1/2 -translate-y-1/2" />
                ) : (
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                )}
                <input
                  type="text"
                  required
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  placeholder={isUrdu ? '03XXXXXXXXX ya aapka@email.com' : '03XXXXXXXXX or user@email.com'}
                  className="w-full bg-[#120303] border border-[#3e1010] focus:border-orange-500 rounded-xl py-2.5 pl-9 pr-3 text-sm text-white font-mono placeholder:text-stone-600 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                {isUrdu ? 'Password:' : 'Password:'}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#120303] border border-[#3e1010] focus:border-orange-500 rounded-xl py-2.5 pl-9 pr-10 text-sm text-white font-mono placeholder:text-stone-600 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-600 via-[#ff4500] to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-extrabold py-3 px-4 rounded-xl shadow-lg shadow-orange-950/60 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] text-sm"
            >
              <span>{isUrdu ? 'Account Mein Dakhil Hon' : 'Log In to Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* REGISTER FORM */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                {isUrdu ? 'Aap Ka Pura Naam (Full Name):' : 'Full Name:'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder={isUrdu ? 'Misal: Muhammad Rehman' : 'e.g. John Doe'}
                  className="w-full bg-[#120303] border border-[#3e1010] focus:border-orange-500 rounded-xl py-2 pl-9 pr-3 text-sm text-white placeholder:text-stone-600 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Contact Type Selector: Mobile Number OR Email */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-stone-300">
                  {isUrdu ? 'Registeration Ka Tareeqa:' : 'Contact Information:'}
                </label>
                <div className="flex gap-1 bg-[#100202] p-0.5 rounded-lg border border-[#330c0c] text-[10px]">
                  <button
                    type="button"
                    onClick={() => {
                      setRegType('phone');
                      setRegContact('');
                    }}
                    className={`px-2 py-0.5 rounded flex items-center gap-1 font-bold ${
                      regType === 'phone' ? 'bg-orange-600 text-white' : 'text-stone-400 hover:text-white'
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
                      regType === 'email' ? 'bg-orange-600 text-white' : 'text-stone-400 hover:text-white'
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
                  className="w-full bg-[#120303] border border-[#3e1010] focus:border-orange-500 rounded-xl py-2 pl-9 pr-3 text-sm text-white font-mono placeholder:text-stone-600 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>
              <span className="text-[10px] text-stone-400 mt-1 block">
                {regType === 'email'
                  ? isUrdu ? 'Email address darj karein' : 'Enter your valid email address'
                  : isUrdu ? '11-digit Pakistani mobile number darj karein' : 'Enter valid 11-digit mobile number'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  {isUrdu ? 'Password:' : 'Password:'}
                </label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="••••••"
                    className="w-full bg-[#120303] border border-[#3e1010] focus:border-orange-500 rounded-xl py-2 pl-8 pr-2 text-sm text-white font-mono placeholder:text-stone-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  {isUrdu ? 'Confirm Pass:' : 'Confirm:'}
                </label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="••••••"
                    className="w-full bg-[#120303] border border-[#3e1010] focus:border-orange-500 rounded-xl py-2 pl-8 pr-2 text-sm text-white font-mono placeholder:text-stone-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                {isUrdu ? 'Referral Code (Optional):' : 'Referral Code:'}
              </label>
              <div className="relative">
                <Share2 className="w-4 h-4 text-amber-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={regRefCode}
                  onChange={(e) => setRegRefCode(e.target.value)}
                  placeholder="rehman_99"
                  className="w-full bg-[#120303] border border-[#3e1010] focus:border-orange-500 rounded-xl py-2 pl-9 pr-3 text-xs text-amber-300 font-mono focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-600 via-[#ff4500] to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-extrabold py-3 px-4 rounded-xl shadow-lg shadow-orange-950/60 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] text-sm mt-2"
            >
              <span>{isUrdu ? 'Register & Account Banayein' : 'Register Account'}</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Quick Demo & Test Logins */}
        <div className="mt-5 pt-4 border-t border-[#310c0c] space-y-2">
          <div className="flex items-center justify-between text-[11px] text-stone-400">
            <span>{isUrdu ? 'Fauri Test Logins (Direct Access):' : 'Instant Test Logins:'}</span>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={handleQuickTestLogin}
              className="py-2 px-1.5 rounded-xl bg-orange-950/60 hover:bg-orange-900 border border-orange-500/30 text-amber-300 text-[11px] font-semibold flex flex-col items-center justify-center transition-all"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400 mb-0.5" />
              <span>Mobile Login</span>
            </button>

            <button
              type="button"
              onClick={handleEmailTestLogin}
              className="py-2 px-1.5 rounded-xl bg-blue-950/60 hover:bg-blue-900 border border-blue-500/30 text-blue-300 text-[11px] font-semibold flex flex-col items-center justify-center transition-all"
            >
              <Mail className="w-3.5 h-3.5 text-blue-400 mb-0.5" />
              <span>Email Login</span>
            </button>

            <button
              type="button"
              onClick={handleAdminTestLogin}
              className="py-2 px-1.5 rounded-xl bg-purple-950/60 hover:bg-purple-900 border border-purple-500/40 text-purple-200 text-[11px] font-semibold flex flex-col items-center justify-center transition-all"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400 mb-0.5" />
              <span>Admin Login</span>
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
