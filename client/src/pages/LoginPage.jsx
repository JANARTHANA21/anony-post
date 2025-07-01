import React, { useState } from 'react';
import InputField from '../components/InputField';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../features/auth/authSlice';
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
    <div className="max-w-md mx-auto p-6">
      <form onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

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
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          showToggle
          isPasswordVisible={showPassword}
          toggleHandler={() => setShowPassword(!showPassword)}
        />

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded hover:bg-indigo-700 transition"
        >
          Login
        </button>

        {error && <p className="text-red-600 mt-3 text-center">{error}</p>}

        <p className="mt-4 text-center">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-600 underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;