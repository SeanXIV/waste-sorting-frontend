'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { authAPI } from '../../lib/api';
import { useLoading } from '../../context/LoadingContext';

type FormData = {
  username: string;
  password: string;
};

export default function Login() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setLoading, setLoadingMessage } = useLoading();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setError('');
    setLoading(true);
    setLoadingMessage('Logging in...');

    try {
      // Use the authAPI for login
      const responseData = await authAPI.login(data.username, data.password);

      // Store the token in localStorage
      localStorage.setItem('token', responseData.accessToken);
      localStorage.setItem('user', JSON.stringify({
        id: responseData.id,
        username: responseData.username,
        email: responseData.email,
        roles: responseData.roles
      }));

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(
        err.response?.data?.message ||
        'Failed to login. Please check your credentials.'
      );
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="card">
        <div className="card-body">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-dark-900">Welcome Back</h1>
            <p className="text-gray-600 mt-2">Sign in to your account to continue</p>
          </div>

          {error && (
            <div className="alert alert-danger mb-6" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="username" className="form-label">Username</label>
              <input
                type="text"
                className={`form-control ${errors.username ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                id="username"
                placeholder="Enter your username"
                {...register('username', { required: 'Username is required' })}
              />
              {errors.username && (
                <div className="form-error">{errors.username.message}</div>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="form-label">Password</label>
                <Link href="#" className="text-sm text-primary-600 hover:text-primary-700">
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                className={`form-control ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                id="password"
                placeholder="Enter your password"
                {...register('password', { required: 'Password is required' })}
              />
              {errors.password && (
                <div className="form-error">{errors.password.message}</div>
              )}
            </div>

            <div>
              <button
                type="submit"
                className="btn btn-primary w-full py-2.5 flex justify-center items-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner spinner-sm mr-2"></span>
                    <span>Logging in...</span>
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link href="/register" className="text-primary-600 hover:text-primary-700 font-medium">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
