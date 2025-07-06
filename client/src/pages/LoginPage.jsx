import React, { useState } from 'react';
import InputField from '../components/InputField';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../features/Auth/authSlice.js';
import { toast } from 'react-toastify';
import API from '../api/axios';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await API.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );

      const { user, Access_token } = res.data;
      dispatch(setCredentials({ user, accessToken: Access_token }));
      toast.success('Login successful!');
      navigate('/posts');
    } catch (err) {
      setError('Invalid credentials');
      toast.error('Login failed');
    }
  };

return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-teal-100 to-emerald-200 px-4">
    <div className="w-full max-w-md p-6 bg-white/60 backdrop-blur-xl rounded-2xl shadow-xl border border-white/30 animate-fadeIn">
      <form onSubmit={handleSubmit} className="space-y-5">
        <h2 className="text-3xl font-bold text-center text-emerald-700 tracking-tight">
          Welcome Back!
        </h2>
        <p className="text-sm text-center text-gray-700">
          Login to continue
        </p>

        <InputField
          label="Email"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />

        <InputField
          label="Password"
          type={'password'}
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          showToggle
          isPasswordVisible={showPassword}
          toggleHandler={() => setShowPassword(!showPassword)}
        />

        {error && (
          <p className="text-sm text-red-600 text-center animate-pulse">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-md hover:shadow-xl"
        >
          Login
        </button>

        <p className="text-sm text-center text-gray-700">
          Don't have an account?{' '}
          <Link to="/register" className="text-emerald-600 font-medium hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>

    <style>{`
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      .animate-fadeIn {
        animation: fadeIn 0.6s ease-out;
      }
    `}</style>
  </div>
);
};

export default Login;
