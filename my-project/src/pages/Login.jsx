import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || 'Login failed');
        return;
      }

      if (data.role === 'admin' && data.otpSent) {
        localStorage.setItem('tempToken', data.token);
        autoLogout(data.token, 'tempToken');
        navigate('/verify-otp');
      } else {
        localStorage.setItem('token', data.token);
        autoLogout(data.token, 'token');
        navigate('/user-dashboard');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong. Please try again.');
    }
  };

  const autoLogout = (token, key = 'token') => {
    try {
      const decoded = jwtDecode(token);
      const exp = decoded.exp * 1000;
      const now = Date.now();
      const timeLeft = exp - now;

      if (timeLeft > 0) {
        setTimeout(() => {
          localStorage.removeItem(key);
          alert('Session expired. You have been logged out.');
          navigate('/login');
        }, timeLeft);
      } else {
        localStorage.removeItem(key);
        navigate('/login');
      }
    } catch (error) {
      localStorage.removeItem(key);
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <input type="email" name="email" placeholder="Email" required className="input mb-4" onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" required className="input mb-4" onChange={handleChange} />
        <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">Login</button>
      </form>
    </div>
  );
}
