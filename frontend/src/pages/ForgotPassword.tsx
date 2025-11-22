import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Mail, ArrowLeft, ArrowRight, Package, Check, Shield } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { forgotPassword } from '../services/authService';
import { validateEmail } from '../utils/validators';
import type { ForgotPasswordData } from '../types';

export const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordData>();

  const onSubmit = async (data: ForgotPasswordData) => {
    // Validate email
    const emailValidation = validateEmail(data.email);
    if (!emailValidation.valid) {
      toast.error(emailValidation.message);
      return;
    }

    setIsLoading(true);
    try {
      const response = await forgotPassword(data);

      if (response.success) {
        toast.success('OTP sent to your email! 📧');
        // Navigate to OTP verification with email
        navigate('/verify-otp', { state: { email: data.email } });
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to send OTP. Please try again.';
      toast.error(message);
    } finally {
      setIsLoading(false);
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
                Account
                <br />
                recovery
                <br />
                <span className="text-gray-600">made simple</span>
              </h1>
              <p className="text-base text-gray-500 leading-relaxed max-w-md">
                We'll send you a secure one-time password to verify your identity and help you regain access.
              </p>
            </motion.div>

            {/* Recovery Steps */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-4"
            >
              {[
                'Enter your registered email address',
                'Receive 6-digit OTP instantly',
                'Create a new secure password',
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
                <Shield className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" strokeWidth={2} />
                <div>
                  <div className="text-sm font-medium text-white mb-1">
                    Secure recovery process
                  </div>
                  <div className="text-xs text-gray-400 leading-relaxed">
                    OTP expires in 10 minutes for your security. Never share your OTP with anyone.
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
              to="/login"
              className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" strokeWidth={2} />
              <span className="font-medium">Back to sign in</span>
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
              Reset your password
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Enter your email and we'll send you a verification code
            </p>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email address
                </label>
                <div className="relative group">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none">
                    <Mail className="w-4 h-4" strokeWidth={2} />
                  </div>
                  <input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    className={`
                      w-full px-4 py-3 pl-11
                      bg-white dark:bg-gray-900
                      text-gray-900 dark:text-gray-100
                      text-sm
                      placeholder:text-gray-400 dark:placeholder:text-gray-600
                      border 
                      ${errors.email 
                        ? 'border-red-300 dark:border-red-800 focus:border-red-500 focus:ring-red-500/20' 
                        : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 focus:border-primary-600 focus:ring-primary-600/20'
                      }
                      rounded-xl
                      transition-all duration-200
                      focus:outline-none focus:ring-4
                    `}
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                        message: 'Invalid email address',
                      },
                    })}
                  />
                </div>
                {errors.email && (
                  <p className="mt-2 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
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
                    <span>Sending code...</span>
                  </>
                ) : (
                  <>
                    <span>Send verification code</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" strokeWidth={2} />
                  </>
                )}
              </button>
            </form>

            {/* Info Box */}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-800/30">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs font-medium text-blue-900 dark:text-blue-300 mb-1">
                    Check your email
                  </div>
                  <div className="text-xs text-blue-800 dark:text-blue-400 leading-relaxed">
                    The verification code expires in 10 minutes. Check your spam folder if you don't receive it.
                  </div>
                </div>
              </div>
            </div>

            {/* Help Text */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Need help?{' '}
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