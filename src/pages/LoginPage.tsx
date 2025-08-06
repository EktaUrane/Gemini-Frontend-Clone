import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import CountrySelector from '../components/auth/CountrySelector';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

const loginSchema = z.object({
  phoneNumber: z.string().min(7, 'Phone number must be at least 7 digits').max(15, 'Phone number too long'),
  otp: z.string().optional(), // OTP is optional here.
});

type LoginFormInputs = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const [dialCode, setDialCode] = useState('+1');
  const [otpSent, setOtpSent] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const simulateSendOtp = async (data: LoginFormInputs) => {
    setIsSendingOtp(true);
    toast.loading('Sending OTP...', { id: 'otp-send' });
    clearErrors('otp');

    await new Promise((resolve) => setTimeout(resolve, 2000));

    setOtpSent(true);
    toast.success(`OTP sent to ${dialCode}${data.phoneNumber}!`, { id: 'otp-send' });

    setIsSendingOtp(false);
  };

  const simulateVerifyOtp = async (data: LoginFormInputs) => {
    setIsVerifyingOtp(true);
    toast.loading('Verifying OTP...', { id: 'otp-verify' });


    await new Promise((resolve) => setTimeout(resolve, 2000));

    login(`${dialCode}${data.phoneNumber}`);
    toast.success('Login successful!', { id: 'otp-verify' });
    navigate('/dashboard');

    setIsVerifyingOtp(false);
  };

  const onSubmit = async (data: LoginFormInputs) => {
    if (!otpSent) {
      await simulateSendOtp(data);
    } else {
      if (!data.otp || data.otp.length < 4) {
          setError('otp', { type: 'manual', message: 'Please enter a valid OTP' });
          return;
      }
      await simulateVerifyOtp(data);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 dark:from-gray-800 dark:to-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-md transform transition-all duration-300 hover:scale-[1.01]">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
          Welcome to Gemini Clone
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label htmlFor="countryCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Country Code
            </label>
            <CountrySelector onSelect={setDialCode} defaultValue="+1" />
          </div>

          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Phone Number
            </label>
            <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md focus-within:ring-2 focus-within:ring-blue-500 dark:focus-within:ring-purple-500 transition-all duration-200">
              <span className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-l-md text-gray-600 dark:text-gray-300">
                {dialCode}
              </span>
              <input
                id="phoneNumber"
                type="text"
                {...register('phoneNumber')}
                className="flex-grow p-2 outline-none bg-transparent text-gray-900 dark:text-gray-100"
                placeholder="e.g., 1234567890"
                disabled={otpSent || isSendingOtp || isVerifyingOtp}
              />
            </div>
            {errors.phoneNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
            )}
          </div>

          {otpSent && (
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                OTP
              </label>
              <input
                id="otp"
                type="text"
                {...register('otp', { required: 'OTP is required' })}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500 bg-transparent text-gray-900 dark:text-gray-100 outline-none transition-all duration-200"
                placeholder="Enter any OTP"
                maxLength={6}
                disabled={isVerifyingOtp}
              />
              {errors.otp && <p className="mt-1 text-sm text-red-600">{errors.otp.message}</p>}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 dark:bg-purple-600 dark:hover:bg-purple-700 text-white font-semibold rounded-md shadow-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSendingOtp || isVerifyingOtp}
          >
            {isSendingOtp ? 'Sending OTP...' : otpSent ? 'Verify OTP' : 'Send OTP'}
          </button>

          {otpSent && (
            <button
              type="button"
              onClick={() => {
                setOtpSent(false);
                clearErrors('otp');
              }}
              className="w-full mt-2 py-2 px-4 text-sm text-gray-600 dark:text-gray-400 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSendingOtp || isVerifyingOtp}
            >
              Change Phone Number
            </button>
          )}
        </form>

        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Made with <span role="img" aria-label="love">❤️</span> by Ekta
        </p>
      </div>
    </div>
  );
};

export default LoginPage;