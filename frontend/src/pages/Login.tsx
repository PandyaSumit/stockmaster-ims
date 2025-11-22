import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { LogIn, Mail, Lock, Eye, EyeOff, Package, ArrowRight, Check } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Checkbox } from '../components/Checkbox';
import { useAuthStore } from '../store/authStore';
import { login as loginService } from '../services/authService';
import type { LoginCredentials } from '../types';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>();

  const onSubmit = async (data: LoginCredentials) => {
    setIsLoading(true);
    try {
      const response = await loginService(data);

      if (response.success && response.data) {
        login(response.data.accessToken, response.data.user);
        toast.success('Login successful! Welcome back 👋');
        navigate('/dashboard');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Invalid Login ID or Password';
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

        {/* Gradient Accent - Minimalist */}
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
                Inventory
                <br />
                management
                <br />
                <span className="text-gray-600">made simple</span>
              </h1>
              <p className="text-base text-gray-500 leading-relaxed max-w-md">
                A powerful platform trusted by businesses worldwide to streamline operations and drive growth.
              </p>
            </motion.div>

            {/* Minimal Feature List */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-4"
            >
              {[
                'Real-time inventory tracking',
                'Advanced analytics & reporting',
                'Enterprise-grade security',
              ].map((feature, index) => (
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
                  {feature}
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Footer - Minimal */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
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

      {/* RIGHT SIDE - Ultra Clean Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-sm">
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
              Welcome back
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Sign in to your account to continue
            </p>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Email or Login ID
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="name@company.com"
                    className={`
                      w-full px-4 py-3 
                      bg-white dark:bg-gray-900
                      border ${errors.loginId ? 'border-red-300 dark:border-red-800' : 'border-gray-200 dark:border-gray-800'}
                      rounded-xl
                      text-sm text-gray-900 dark:text-white
                      placeholder:text-gray-400 dark:placeholder:text-gray-600
                      focus:outline-none focus:ring-2 focus:ring-primary-600/20 focus:border-primary-600
                      transition-all duration-200
                    `}
                    {...register('loginId', {
                      required: 'Email or login ID is required',
                    })}
                  />
                </div>
                {errors.loginId && (
                  <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                    {errors.loginId.message}
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-900 dark:text-white">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                  >
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    className={`
                      w-full px-4 py-3 pr-12
                      bg-white dark:bg-gray-900
                      border ${errors.password ? 'border-red-300 dark:border-red-800' : 'border-gray-200 dark:border-gray-800'}
                      rounded-xl
                      text-sm text-gray-900 dark:text-white
                      placeholder:text-gray-400 dark:placeholder:text-gray-600
                      focus:outline-none focus:ring-2 focus:ring-primary-600/20 focus:border-primary-600
                      transition-all duration-200
                    `}
                    {...register('password', {
                      required: 'Password is required',
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" strokeWidth={2} />
                    ) : (
                      <Eye className="w-4 h-4" strokeWidth={2} />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 rounded border-gray-300 dark:border-gray-700 text-primary-600 focus:ring-2 focus:ring-primary-600/20 transition-colors"
                  {...register('rememberMe')}
                />
                <label htmlFor="remember" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Remember me
                </label>
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
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign in</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" strokeWidth={2} />
                  </>
                )}
              </button>
            </form>

            {/* Security Notice - Ultra Minimal */}
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-green-600 dark:text-green-400" strokeWidth={3} />
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-900 dark:text-white mb-0.5">
                    Secure connection
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    Your data is protected with 256-bit SSL encryption
                  </div>
                </div>
              </div>
            </div>

            {/* Sign Up Link */}
            <div className="mt-8 text-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                New to StockMaster?{' '}
              </span>
              <Link
                to="/signup"
                className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
              >
                Create account
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