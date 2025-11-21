import React, { useState } from "react";
import api from "../api";
import type { User } from "../types";

// LoginPage Component
// Props:
//  - onLogin → callback when login is successful, returns token + user
//  - onSwitchToRegister → switch screen to registration page
export default function LoginPage({
  onLogin,
  onSwitchToRegister,
}: {
  onLogin: (token: string, user: User) => void;
  onSwitchToRegister: () => void;
}) {

  // Local states for user input, loading, and errors
  const [email, setEmail] = useState("");          // stores email input
  const [password, setPassword] = useState("");    // stores password input
  const [loading, setLoading] = useState(false);   // loading button state
  const [errorMsg, setErrorMsg] = useState("");    // shows error on login failure

  // Function that performs login API request
  const doLogin = async () => {
    setErrorMsg("");      // clear previous errors
    setLoading(true);     // disable button while logging in

    try {
      // API request to login
      // API returns { token, user }
      const res = await api.post("/auth/login", { email, password });
      const { token, user } = res.data;

      // Call parent component function to save token + user
      onLogin(token, user);

    } catch (err: any) {
      // If server sends an error → show that, otherwise fallback message
      setErrorMsg(err?.response?.data?.error || "Invalid email or password.");
    } finally {
      setLoading(false); // re-enable button
    }
  };

  return (
    // Main page wrapper
    // min-vh-100 → makes it full height
    // gradient background
    <div className="flex py-8 justify-center min-vh-100 bg-gradient-to-br from-gray-100 to-gray-200 px-4 rounded-lg">

      {/* Wrapper to allow scroll on very small screens */}
      {/* 
        max-h-[90vh] → so content never overflows the screen
        backdrop-blur → gives a glass effect
      */}
      <div className="w-full max-w-sm bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-xl border border-gray-200 animate-fadeIn overflow-auto max-h-[90vh]">

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
          Login
        </h2>

        {/* Error Message */}
        {/* Shows only when errorMsg contains some text */}
        {errorMsg && (
          <div className="p-2 mb-3 text-sm text-red-700 bg-red-100 border border-red-300 rounded">
            {errorMsg}
          </div>
        )}

        {/* Email */}
        {/* Input field for user email */}
        <div className="mb-3">
          <label className="block mb-1 text-gray-700 font-semibold text-sm">Email</label>
          <input
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}   // update email state
          />
        </div>

        {/* Password */}
        {/* Input field for user password */}
        <div className="mb-4">
          <label className="block mb-1 text-gray-700 font-semibold text-sm">Password</label>
          <input
            type="password"
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            placeholder="•••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}  // update password state
          />
        </div>

        {/* Login Button */}
        {/* Disabled when loading = true */}
        <button
          onClick={doLogin}
          disabled={loading}
          className={`w-full py-2.5 text-white font-semibold rounded-lg transition 
            ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Register Button */}
        {/* Button that switches to register screen */}
        <div className="text-center mt-4">
          <p className="text-gray-700 text-sm">Don't have an account?</p>
          <button
            onClick={onSwitchToRegister}
            className="mt-2 px-4 py-1.5 font-semibold text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition"
          >
            Register
          </button>
        </div>

      </div>
    </div>
  );
}
