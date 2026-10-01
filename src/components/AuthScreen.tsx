import React, { useState } from 'react';
import { useI18n } from '../lib/i18n';
import { DealLogo } from './DealLogo';
import { heroVilla } from '../data/mockProjects';
import { UserSession } from '../types';
import { apiFetch, setStoredSessionToken } from '../lib/api';
import { Mail, Lock, User, ArrowRight, ShieldCheck, CheckCircle2, Globe, AlertCircle } from 'lucide-react';

interface AuthScreenProps {
  onLoginSuccess: (session: UserSession) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
  const { t, lang, setLang } = useI18n();

  const [mode, setMode] = useState<'login' | 'register' | 'verify' | 'forgot' | 'reset'>('login');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setInfoMsg(null);
    setIsSubmitting(true);

    try {
      const data = await apiFetch<{
        success: boolean;
        user: UserSession;
        token: string;
      }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim(), password })
      });

      if (data.token) {
        setStoredSessionToken(data.token);
      }
      onLoginSuccess(data.user);
    } catch (err: any) {
      const msg = err.message || 'Login failed. Please check your credentials.';
      if (msg.includes('verify your email')) {
        setMode('verify');
        setInfoMsg('Please verify your email address to activate your account.');
      } else {
        setErrorMsg(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setInfoMsg(null);

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      return;
    }

    setIsSubmitting(true);
    try {
      const data = await apiFetch<{
        success: boolean;
        message: string;
      }>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
          marketingConsent
        })
      });

      setInfoMsg(data.message || 'Verification code sent to your email.');
      setMode('verify');
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const data = await apiFetch<{
        success: boolean;
        message: string;
        user: UserSession;
        token: string;
      }>('/api/auth/verify-email', {
        method: 'POST',
        body: JSON.stringify({
          email: email.trim(),
          code: verificationCode.trim()
        })
      });

      if (data.token) {
        setStoredSessionToken(data.token);
      }
      onLoginSuccess(data.user);
    } catch (err: any) {
      setErrorMsg(err.message || 'Verification failed. Please check the code.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      const data = await apiFetch<{ success: boolean; message: string }>('/api/auth/resend-code', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim() })
      });
      setInfoMsg(data.message || 'Verification code sent to your email.');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to resend code.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const data = await apiFetch<{
        success: boolean;
        message: string;
      }>('/api/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim() })
      });

      setInfoMsg(data.message || 'Password reset code sent to your email.');
      setMode('reset');
    } catch (err: any) {
      setErrorMsg(err.message || 'Could not process password reset request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    if (newPassword.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      setIsSubmitting(false);
      return;
    }

    try {
      const data = await apiFetch<{
        success: boolean;
        message: string;
      }>('/api/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({
          email: email.trim(),
          code: verificationCode.trim(),
          newPassword
        })
      });

      setInfoMsg(data.message || 'Password successfully updated. You can now sign in.');
      setMode('login');
      setPassword('');
      setVerificationCode('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Reset failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F6EFE5] flex items-stretch select-none text-[#3F3832]">
      {/* LEFT: Split Architectural Hero Visual */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#2C241E]">
        <img
          src={heroVilla}
          alt="DEAL Architectural Masterpiece"
          className="w-full h-full object-cover opacity-90 transition-transform duration-1000 hover:scale-105"
        />

        {/* Ambient Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#2C241E]/95 via-[#2C241E]/40 to-transparent"></div>

        {/* Top Floating Badge */}
        <div className="absolute top-8 left-8 z-10">
          <DealLogo variant="horizontal" theme="light" />
        </div>

        {/* Bottom Architectural Manifesto */}
        <div className="absolute bottom-10 left-10 right-10 z-10 text-[#FAF7F2]">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#D8CEC2] font-semibold block mb-2">
            INTELLIGENT ARCHITECTURAL WORKFLOW
          </span>
          <h2 className="font-serif-arch text-2xl xl:text-3xl font-bold leading-tight">
            From Hand Sketches & Raw Land to Interactive 3D Architecture.
          </h2>
          <p className="text-xs text-[#D8CEC2] mt-3 leading-relaxed max-w-lg">
            "DEAL transforms traditional architectural friction into an accelerated digital synthesis. Engineers guide the intent; AI analyzes boundaries, microclimate, and spatial harmonics."
          </p>
          <div className="mt-4 pt-3 border-t border-[#FAF7F2]/20 flex items-center justify-between text-[11px] text-[#D8CEC2]">
            <span>Architectural Engineering Platform</span>
            <span>Riyadh · Jeddah · Gulf Region</span>
          </div>
        </div>
      </div>

      {/* RIGHT: Clean Architectural Authentication Panel */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-8 sm:p-12 md:p-16 max-w-2xl mx-auto">
        {/* Top Header Bar: Language Switcher */}
        <div className="flex items-center justify-between">
          <div className="lg:hidden">
            <DealLogo variant="compact" size="sm" />
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
              className="px-3 py-1 bg-[#EFE6DA] border border-[#D8CEC2] rounded text-xs text-[#54483C] font-medium hover:bg-[#D8CEC2] transition-colors flex items-center gap-1.5"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'العربية (RTL)' : 'English (LTR)'}</span>
            </button>
          </div>
        </div>

        {/* Center Form Container */}
        <div className="my-auto py-8">
          {/* Brand Logo & Editorial Kicker */}
          <div className="text-center mb-8">
            <DealLogo variant="full" size="md" className="mx-auto mb-3" />
            <h1 className="font-serif-arch text-xl font-bold text-[#3F3832]">
              {mode === 'login' && 'Welcome to DEAL'}
              {mode === 'register' && 'Join the DEAL Network'}
              {mode === 'verify' && 'Verify Your Email'}
              {mode === 'forgot' && 'Reset Account Password'}
              {mode === 'reset' && 'Set New Password'}
            </h1>
            <p className="text-xs text-[#756A60] mt-1 font-serif-arch tracking-wide">
              "Design smarter. Build better."
            </p>
          </div>

          {/* Messages */}
          {errorMsg && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {infoMsg && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded text-xs flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{infoMsg}</span>
            </div>
          )}

          {/* LOGIN FORM */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4 text-xs">
              <div>
                <label className="text-[#756A60] font-medium block mb-1.5">{t('emailAddress')}</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8A7A6A] absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full bg-[#FAF7F2] border border-[#D8CEC2] rounded pl-9 pr-3 py-2 text-xs text-[#3F3832] focus:outline-none focus:border-[#54483C]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[#756A60] font-medium">{t('password')}</label>
                  <button
                    type="button"
                    onClick={() => { setErrorMsg(null); setInfoMsg(null); setMode('forgot'); }}
                    className="text-[11px] text-[#8A7A6A] hover:text-[#54483C]"
                  >
                    {t('forgotPassword')}
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#8A7A6A] absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#FAF7F2] border border-[#D8CEC2] rounded pl-9 pr-3 py-2 text-xs text-[#3F3832] focus:outline-none focus:border-[#54483C]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-[#54483C] text-[#FAF7F2] rounded text-xs font-semibold hover:bg-[#3F3832] transition-colors flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50 mt-2"
              >
                <span>{isSubmitting ? 'Authenticating...' : t('signIn')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="text-center text-xs pt-4 text-[#756A60] border-t border-[#D8CEC2]">
                {t('dontHaveAccount')}{' '}
                <button
                  type="button"
                  onClick={() => { setErrorMsg(null); setInfoMsg(null); setMode('register'); }}
                  className="font-semibold text-[#54483C] hover:underline"
                >
                  {t('createAccount')}
                </button>
              </div>
            </form>
          )}

          {/* REGISTER FORM */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3.5 text-xs">
              <div>
                <label className="text-[#756A60] font-medium block mb-1">{t('fullName')}</label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#8A7A6A] absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Full Name"
                    className="w-full bg-[#FAF7F2] border border-[#D8CEC2] rounded pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-[#54483C]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#756A60] font-medium block mb-1">{t('emailAddress')}</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8A7A6A] absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full bg-[#FAF7F2] border border-[#D8CEC2] rounded pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-[#54483C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[#756A60] font-medium block mb-1">{t('password')}</label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 8 characters"
                    className="w-full bg-[#FAF7F2] border border-[#D8CEC2] rounded px-3 py-2 text-xs focus:outline-none focus:border-[#54483C]"
                  />
                </div>
                <div>
                  <label className="text-[#756A60] font-medium block mb-1">{t('confirmPassword')}</label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full bg-[#FAF7F2] border border-[#D8CEC2] rounded px-3 py-2 text-xs focus:outline-none focus:border-[#54483C]"
                  />
                </div>
              </div>

              {/* Marketing Consent Optional Checkbox */}
              <div className="pt-1 flex items-start gap-2">
                <input
                  type="checkbox"
                  id="marketingConsent"
                  checked={marketingConsent}
                  onChange={(e) => setMarketingConsent(e.target.checked)}
                  className="mt-0.5 accent-[#54483C] rounded border-[#D8CEC2]"
                />
                <label htmlFor="marketingConsent" className="text-[11px] text-[#756A60] cursor-pointer leading-tight">
                  Send me DEAL product updates and announcements (optional).
                </label>
              </div>

              <p className="text-[10px] text-[#756A60] leading-relaxed pt-1">
                A 6-digit confirmation code will be dispatched to verify your email address before platform access is granted.
              </p>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-[#54483C] text-[#FAF7F2] rounded text-xs font-semibold hover:bg-[#3F3832] transition-colors flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50 mt-2"
              >
                <span>{isSubmitting ? 'Registering...' : t('createAccount')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="text-center text-xs pt-3 text-[#756A60] border-t border-[#D8CEC2]">
                {t('alreadyHaveAccount')}{' '}
                <button
                  type="button"
                  onClick={() => { setErrorMsg(null); setInfoMsg(null); setMode('login'); }}
                  className="font-semibold text-[#54483C] hover:underline"
                >
                  {t('signIn')}
                </button>
              </div>
            </form>
          )}

          {/* VERIFY EMAIL CODE FORM */}
          {mode === 'verify' && (
            <form onSubmit={handleVerifyEmail} className="space-y-4 text-xs">
              <div className="bg-[#EFE6DA] p-3 rounded border border-[#D8CEC2] text-center">
                <span className="text-[#756A60] block text-[11px]">Verification Code Dispatched to:</span>
                <strong className="text-[#3F3832] font-semibold">{email}</strong>
              </div>

              <div>
                <label className="text-[#756A60] font-medium block mb-1 text-center">{t('enterCode')}</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="------"
                  className="w-full text-center tracking-[0.6em] font-mono font-bold text-lg bg-[#FAF7F2] border border-[#D8CEC2] rounded py-2.5 text-[#3F3832] focus:outline-none focus:border-[#54483C]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || verificationCode.length < 6}
                className="w-full py-2.5 bg-[#54483C] text-[#FAF7F2] rounded text-xs font-semibold hover:bg-[#3F3832] transition-colors flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{isSubmitting ? 'Validating...' : t('verifyEmail')}</span>
              </button>

              <div className="flex items-center justify-between text-xs pt-2">
                <button
                  type="button"
                  onClick={handleResendCode}
                  className="text-[#8A7A6A] hover:text-[#54483C] underline"
                >
                  {t('resendCode')}
                </button>
                <button
                  type="button"
                  onClick={() => { setErrorMsg(null); setInfoMsg(null); setMode('login'); }}
                  className="text-[#8A7A6A] hover:text-[#54483C]"
                >
                  {t('backToLogin')}
                </button>
              </div>
            </form>
          )}

          {/* FORGOT PASSWORD FORM */}
          {mode === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-4 text-xs">
              <p className="text-xs text-[#756A60]">
                Enter your registered email address. A secure recovery code will be dispatched to your inbox.
              </p>
              <div>
                <label className="text-[#756A60] font-medium block mb-1">{t('emailAddress')}</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8A7A6A] absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full bg-[#FAF7F2] border border-[#D8CEC2] rounded pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-[#54483C]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-[#54483C] text-[#FAF7F2] rounded text-xs font-semibold hover:bg-[#3F3832] transition-colors"
              >
                {isSubmitting ? 'Sending Code...' : 'Send Recovery Code'}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => { setErrorMsg(null); setInfoMsg(null); setMode('login'); }}
                  className="text-xs text-[#8A7A6A] hover:text-[#54483C]"
                >
                  {t('backToLogin')}
                </button>
              </div>
            </form>
          )}

          {/* RESET PASSWORD FORM */}
          {mode === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-3.5 text-xs">
              <div>
                <label className="text-[#756A60] font-medium block mb-1">6-Digit Reset Code</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="------"
                  className="w-full font-mono text-center tracking-[0.5em] font-bold text-base bg-[#FAF7F2] border border-[#D8CEC2] rounded px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="text-[#756A60] font-medium block mb-1">{t('newPasswordLabel')}</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  className="w-full bg-[#FAF7F2] border border-[#D8CEC2] rounded px-3 py-2 text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || verificationCode.length < 6}
                className="w-full py-2.5 bg-[#54483C] text-[#FAF7F2] rounded text-xs font-semibold hover:bg-[#3F3832]"
              >
                {isSubmitting ? 'Updating...' : t('resetPasswordBtn')}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => { setErrorMsg(null); setInfoMsg(null); setMode('login'); }}
                  className="text-xs text-[#8A7A6A] hover:text-[#54483C]"
                >
                  {t('backToLogin')}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-[10px] text-[#756A60] border-t border-[#D8CEC2] pt-4">
          DEAL Platform © 2026 · Design • Engineering • Architecture • Living · Production Architecture
        </div>
      </div>
    </div>
  );
};
