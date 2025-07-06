import React, { useState } from "react";
import InputField from "../components/InputField";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../api/axios";

const RegisterPage = () => {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const dummy=1
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));

    if (name === "username" && value.length < 3) {
      setErrors((prev) => ({
        ...prev,
        username: "Username must be at least 3 characters",
      }));
    }

    if (name === "email" && !validateEmail(value)) {
      setErrors((prev) => ({
        ...prev,
        email: "Invalid email address",
      }));
    }

    if (name === "confirmPassword" && value !== formData.password) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) {``
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the errors below.");
      return;
    }

    setLoading(true);
    try {
      const res = await API.post(`${API_URL}/api/auth/register`, {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      if (res.status === 201) {
        toast.success("Account created successfully!");
        navigate("/");
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message || "Registration failed. Try again.";
      toast.error(msg);
      setErrors((prev) => ({ ...prev, general: msg }));
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-teal-100 to-emerald-200 px-4">
    <div className="w-full max-w-md bg-white/60 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/30 animate-fadeIn">
      <h2 className="text-3xl font-bold text-center text-emerald-700 mb-2 tracking-tight">
        Create Account
      </h2>
      <p className="text-sm text-center text-gray-700 mb-6">
        Join us and explore the network
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          label="Username"
          name="username"
          type="text"
          value={formData.username}
          onChange={handleChange}
          error={errors.username}
          required
        />

        <InputField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required
          autoComplete="email"
        />

        <InputField
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          showToggle
          isPasswordVisible={showPassword}
          toggleHandler={() => setShowPassword((prev) => !prev)}
          error={errors.password}
          required
          autoComplete="new-password"
        />

        <InputField
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          showToggle
          isPasswordVisible={showConfirmPassword}
          toggleHandler={() => setShowConfirmPassword((prev) => !prev)}
          error={errors.confirmPassword}
          required
        />

        {errors.general && (
          <p className="text-red-500 text-sm text-center">{errors.general}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-md hover:shadow-xl"
        >
          {loading ? 'Registering...' : 'Create Account'}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-700">
        Already have an account?{' '}
        <Link to="/" className="text-emerald-600 font-medium hover:underline">
          Login
        </Link>
      </p>
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

export default RegisterPage;