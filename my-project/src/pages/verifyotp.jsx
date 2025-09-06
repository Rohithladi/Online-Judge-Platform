import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

export default function VerifyOtp() {
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('http://localhost:5000/api/auth/verify-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('tempToken')}`,
      },
      body: JSON.stringify({ otp }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.removeItem('tempToken');
      localStorage.setItem('token', data.token); // Final admin token

      autoLogout(data.token); // ⏳ Auto logout logic here

      navigate('/admin-dashboard');
    } else {
      alert(data.message);
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
        <h2 className="text-2xl font-bold mb-6 text-center">Admin OTP Verification</h2>
        <input
          type="text"
          name="otp"
          placeholder="Enter OTP"
          required
          className="input mb-4"
          onChange={(e) => setOtp(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
        >
          Verify OTP
        </button>
      </form>
    </div>
  );
}
