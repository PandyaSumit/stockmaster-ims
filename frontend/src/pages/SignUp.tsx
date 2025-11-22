import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Mail, Eye, EyeOff, Package, ArrowRight, Check } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { register as registerService } from '../services/authService';
import { validatePassword, validateLoginId, validateEmail } from '../utils/validators';
import type { RegisterData } from '../types';

export const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterData>();

  const password = watch('password');

  const onSubmit = async (data: RegisterData) => {
    // Validate login ID
    const loginIdValidation = validateLoginId(data.loginId);
    if (!loginIdValidation.valid) {
      toast.error(loginIdValidation.message);
      return;
    }

    // Validate email
    const emailValidation = validateEmail(data.email);
    if (!emailValidation.valid) {
      toast.error(emailValidation.message);
      return;
    }

    // Validate password
    const passwordValidation = validatePassword(data.password);
    if (!passwordValidation.valid) {
      toast.error(passwordValidation.message);
      return;
    }

    setIsLoading(true);
    try {
      const response = await registerService(data);

      if (response.success && response.data) {
        login(response.data.accessToken, response.data.user);
        toast.success('Account created successfully! Welcome to StockMaster 🎉');
        navigate('/dashboard');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Minimal password strength indicator
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { strength: 0, label: '', width: 0 };

    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[a-z]/.test(pwd)) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^a-zA-Z0-9]/.test(pwd)) strength++;

    const levels = [
      { strength: 1, label: 'Weak', width: 20 },
      { strength: 2, label: 'Fair', width: 40 },
      { strength: 3, label: 'Good', width: 60 },
      { strength: 4, label: 'Strong', width: 80 },
      { strength: 5, label: 'Very strong', width: 100 },
    ];

    return levels[strength - 1] || levels[0];
  };

  const passwordStrength = getPasswordStrength(password);

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
                Start managing
                <br />
                inventory
                <br />
                <span className="text-gray-600">in minutes</span>
              </h1>
              <p className="text-base text-gray-500 leading-relaxed max-w-md">
                Join thousands of businesses using StockMaster to streamline operations and accelerate growth.
              </p>
            </motion.div>

            {/* Benefits */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-4"
            >
              {[
                'Free 14-day trial, no credit card required',
                'Setup complete in under 5 minutes',
                'Cancel anytime with one click',
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-center gap-3 text-sm text-gray-400"
                >
                  <div className="w-5 h-5 rounded-full bg-primary-600/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-primary-400" strokeWidth={3} />
                  </div>
                  {benefit}
                </motion.div>
              ))}
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="pt-8 border-t border-white/10"
            >
              <div className="grid grid-cols-3 gap-8">
                {[
                  { value: '10K+', label: 'Users' },
                  { value: '99.9%', label: 'Uptime' },
                  { value: '24/7', label: 'Support' },
                ].map((stat, index) => (
                  <div key={index}>
                    <div className="text-2xl font-bold text-white mb-1">
                      {stat.value}
                    </div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
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
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1.5">
                <div className="w-1 h-1 rounded-full bg-green-500" />
                <span>SSL Secured</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1 h-1 rounded-full bg-green-500" />
                <span>SOC 2</span>
              </div>
            </div>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mb-10"
          >
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white mb-2">
              Create your account
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Start your free trial today. No credit card required.
            </p>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Full Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  className={`
                    w-full px-4 py-3 
                    bg-white dark:bg-gray-900
                    text-gray-900 dark:text-gray-100
                    text-sm
                    placeholder:text-gray-400 dark:placeholder:text-gray-600
                    border 
                    ${errors.name 
                      ? 'border-red-300 dark:border-red-800 focus:border-red-500 focus:ring-red-500/20' 
                      : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 focus:border-primary-600 focus:ring-primary-600/20'
                    }
                    rounded-xl
                    transition-all duration-200
                    focus:outline-none focus:ring-4
                  `}
                  {...register('name', {
                    required: 'Name is required',
                    minLength: { value: 2, message: 'Name is too short' },
                  })}
                />
                {errors.name && (
                  <p className="mt-2 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
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

              {/* Login ID */}
              <div>
                <label htmlFor="loginId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Login ID
                </label>
                <input
                  id="loginId"
                  type="text"
                  placeholder="6-12 characters"
                  className={`
                    w-full px-4 py-3 
                    bg-white dark:bg-gray-900
                    text-gray-900 dark:text-gray-100
                    text-sm
                    placeholder:text-gray-400 dark:placeholder:text-gray-600
                    border 
                    ${errors.loginId 
                      ? 'border-red-300 dark:border-red-800 focus:border-red-500 focus:ring-red-500/20' 
                      : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 focus:border-primary-600 focus:ring-primary-600/20'
                    }
                    rounded-xl
                    transition-all duration-200
                    focus:outline-none focus:ring-4
                  `}
                  {...register('loginId', {
                    required: 'Login ID is required',
                    minLength: { value: 6, message: 'Minimum 6 characters' },
                    maxLength: { value: 12, message: 'Maximum 12 characters' },
                  })}
                />
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Letters, numbers, and underscores only
                </p>
                {errors.loginId && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {errors.loginId.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    className={`
                      w-full px-4 py-3 pr-12
                      bg-white dark:bg-gray-900
                      text-gray-900 dark:text-gray-100
                      text-sm
                      placeholder:text-gray-400 dark:placeholder:text-gray-600
                      border 
                      ${errors.password 
                        ? 'border-red-300 dark:border-red-800 focus:border-red-500 focus:ring-red-500/20' 
                        : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 focus:border-primary-600 focus:ring-primary-600/20'
                      }
                      rounded-xl
                      transition-all duration-200
                      focus:outline-none focus:ring-4
                    `}
                    {...register('password', {
                      required: 'Password is required',
                      minLength: { value: 8, message: 'Minimum 8 characters' },
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" strokeWidth={2} />
                    ) : (
                      <Eye className="w-4 h-4" strokeWidth={2} />
                    )}
                  </button>
                </div>
                
                {/* Password Strength */}
                {password && password.length > 0 && (
                  <div className="mt-3">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gray-900 dark:bg-white transition-all duration-300 rounded-full"
                          style={{ width: `${passwordStrength.width}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 w-20 text-right font-medium">
                        {passwordStrength.label}
                      </span>
                    </div>
                  </div>
                )}
                
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Min 8 characters, include uppercase, lowercase & number
                </p>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Role */}
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Role
                </label>
                <div className="relative">
                  <select
                    id="role"
                    className="
                      w-full px-4 py-3 pr-10
                      bg-white dark:bg-gray-900
                      text-gray-900 dark:text-gray-100
                      text-sm
                      appearance-none
                      border border-gray-200 dark:border-gray-800
                      hover:border-gray-300 dark:hover:border-gray-700
                      focus:border-primary-600 focus:ring-primary-600/20
                      rounded-xl
                      transition-all duration-200
                      focus:outline-none focus:ring-4
                      cursor-pointer
                    "
                    {...register('role')}
                  >
                    <option value="Warehouse Staff">Warehouse Staff</option>
                    <option value="Inventory Manager">Inventory Manager</option>
                    <option value="Admin">Admin</option>
                  </select>
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 dark:text-gray-500">
                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="
                  group w-full px-4 py-3 mt-2
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
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Create account</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" strokeWidth={2} />
                  </>
                )}
              </button>
            </form>

            {/* Terms */}
            <p className="mt-4 text-xs text-center text-gray-500 dark:text-gray-400">
              By creating an account, you agree to our{' '}
              <Link to="/terms" className="text-gray-900 dark:text-white hover:underline font-medium">
                Terms
              </Link>
              {' '}and{' '}
              <Link to="/privacy" className="text-gray-900 dark:text-white hover:underline font-medium">
                Privacy Policy
              </Link>
            </p>

            {/* Sign In Link */}
            <div className="mt-8 text-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
              </span>
              <Link
                to="/login"
                className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
              >
                Sign in
              </Link>
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