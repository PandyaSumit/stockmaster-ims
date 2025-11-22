import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Shield, ArrowLeft, ArrowRight, Package, Check, Clock } from 'lucide-react';
import { verifyOTP, forgotPassword } from '../services/authService';
import { validateOTP } from '../utils/validators';

export const VerifyOTP: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Redirect if no email
  useEffect(() => {
    if (!email) {
      toast.error('Please provide your email first');
      navigate('/forgot-password');
    }
  }, [email, navigate]);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only take last character
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);

    if (!/^\d+$/.test(pastedData)) {
      toast.error('Please paste only numbers');
      return;
    }

    const newOtp = pastedData.split('');
    setOtp([...newOtp, ...Array(6 - newOtp.length).fill('')]);

    // Focus last filled input
    const lastIndex = Math.min(pastedData.length, 5);
    inputRefs.current[lastIndex]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const otpString = otp.join('');

    // Validate OTP
    const otpValidation = validateOTP(otpString);
    if (!otpValidation.valid) {
      toast.error(otpValidation.message);
      return;
    }

    setIsLoading(true);
    try {
      const response = await verifyOTP({ email, otp: otpString });

      if (response.success) {
        toast.success('OTP verified successfully! ✅');
        navigate('/reset-password', { state: { email, otp: otpString } });
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Invalid OTP. Please try again.';
      toast.error(message);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;

    setIsResending(true);
    try {
      const response = await forgotPassword({ email });

      if (response.success) {
        toast.success('New OTP sent! 📧');
        setCountdown(60);
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (error: any) {
      toast.error('Failed to resend OTP');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white dark:bg-gray-950">
      {/* LEFT SIDE - Minimalist Brand Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-950 overflow-hidden">
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div 
            className="absolute inset-0" 
            style={{
              backgroundImage: `
                linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
              `,
              backgroundSize: '64px 64px'
            }} 
          />
        </div>

        {/* Gradient Accent */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary-500/5 rounded-full blur-[100px]" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-16 text-white w-full max-w-2xl">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
              <Package className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <div className="text-lg font-semibold tracking-tight">StockMaster</div>
              <div className="text-xs text-gray-500 font-medium">IMS</div>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <h1 className="text-5xl font-bold tracking-tight leading-[1.1] mb-6">
                Verify
                <br />
                your identity
                <br />
                <span className="text-gray-600">securely</span>
              </h1>
              <p className="text-base text-gray-500 leading-relaxed max-w-md">
                We've sent a 6-digit verification code to your email. Enter it below to confirm your identity.
              </p>
            </motion.div>

            {/* Verification Steps */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-4"
            >
              {[
                'Check your email inbox',
                'Enter the 6-digit code',
                'Create your new password',
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-center gap-3 text-sm text-gray-400"
                >
                  <div className="w-5 h-5 rounded-full bg-primary-600/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-primary-400">{index + 1}</span>
                  </div>
                  {step}
                </motion.div>
              ))}
            </motion.div>

            {/* Security Note */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10"
            >
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" strokeWidth={2} />
                <div>
                  <div className="text-sm font-medium text-white mb-1">
                    Code expires in 10 minutes
                  </div>
                  <div className="text-xs text-gray-400 leading-relaxed">
                    If you don't see the email, check your spam folder or request a new code.
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-6 text-xs text-gray-600">
              <div className="flex items-center gap-1.5">
                <div className="w-1 h-1 rounded-full bg-green-500" />
                <span>SSL Secured</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1 h-1 rounded-full bg-green-500" />
                <span>SOC 2 Type II</span>
              </div>
            </div>
            <div className="text-xs text-gray-700">
              © 2024 StockMaster IMS
            </div>
          </motion.div>
        </div>
      </div>

      {/* RIGHT SIDE - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden mb-12"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-gray-900 dark:bg-primary-600 rounded-xl flex items-center justify-center">
                <Package className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <div className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">StockMaster</div>
                <div className="text-xs text-gray-500 font-medium">IMS</div>
              </div>
            </div>
          </motion.div>

          {/* Back Link */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mb-10"
          >
            <Link
              to="/forgot-password"
              className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" strokeWidth={2} />
              <span className="font-medium">Back</span>
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mb-10"
          >
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white mb-2">
              Enter verification code
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              We sent a code to{' '}
              <span className="font-medium text-gray-900 dark:text-white">
                {email}
              </span>
            </p>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* OTP Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                  Verification code
                </label>
                <div className="flex gap-3 justify-center">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      className={`
                        w-12 h-14 sm:w-14 sm:h-16
                        text-center text-2xl font-semibold
                        bg-white dark:bg-gray-900
                        text-gray-900 dark:text-gray-100
                        border-2
                        ${digit 
                          ? 'border-gray-900 dark:border-white' 
                          : 'border-gray-200 dark:border-gray-800'
                        }
                        hover:border-gray-300 dark:hover:border-gray-700
                        focus:border-primary-600 focus:ring-4 focus:ring-primary-600/20
                        rounded-xl
                        transition-all duration-200
                        focus:outline-none
                      `}
                    />
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || otp.join('').length !== 6}
                className="
                  group w-full px-4 py-3
                  bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100
                  text-white dark:text-gray-900
                  text-sm font-medium
                  rounded-xl
                  transition-all duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed
                  flex items-center justify-center gap-2
                "
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white dark:border-gray-900/30 dark:border-t-gray-900 rounded-full animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <span>Verify code</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" strokeWidth={2} />
                  </>
                )}
              </button>
            </form>

            {/* Resend Section */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Didn't receive the code?
              </p>
              
              {countdown > 0 ? (
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Clock className="w-4 h-4" strokeWidth={2} />
                  <span>
                    Resend available in{' '}
                    <span className="font-medium text-gray-900 dark:text-white">
                      {countdown}s
                    </span>
                  </span>
                </div>
              ) : (
                <button
                  onClick={handleResendOTP}
                  disabled={isResending}
                  className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors disabled:opacity-50"
                >
                  {isResending ? 'Sending new code...' : 'Resend code'}
                </button>
              )}
            </div>

            {/* Help Text */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Having trouble?{' '}
                <Link to="/support" className="text-gray-900 dark:text-white hover:underline font-medium">
                  Contact support
                </Link>
              </p>
            </div>

            {/* Mobile Footer */}
            <div className="lg:hidden mt-12 text-center text-xs text-gray-500">
              © 2024 StockMaster IMS
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};