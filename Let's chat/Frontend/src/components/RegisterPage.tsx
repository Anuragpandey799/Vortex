import React, { useState } from "react";
import api from "../api";
import type { User } from "../types";

export default function RegisterPage({
  onRegister,
  onSwitchToLogin,
}: {
  onRegister: (token: string, user: User) => void;
  onSwitchToLogin: () => void;
}) {
  // -----------------------------
  // Local form state
  // -----------------------------
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // -----------------------------
  // Handle registration API call
  // -----------------------------
  const doRegister = async () => {
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await api.post("/auth/register", {
        username,
        email,
        password,
      });

      // Extract token + user → send back to parent (App.jsx)
      const { token, user } = res.data;
      onRegister(token, user);
    } catch (err: any) {
      // Show error message box
      setErrorMsg(err?.response?.data?.error || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // -----------------------------
    // MAIN PAGE BACKGROUND
    // Full screen center layout
    // -----------------------------
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-black px-4">

      {/* ----------------------------- */}
      {/* CARD WRAPPER (Glass effect)   */}
      {/* ----------------------------- */}
      <div className="w-full max-w-sm bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-lg text-white">

        {/* TITLE */}
        <h2 className="text-3xl font-bold text-center mb-6">
          Create Account
        </h2>

        {/* Error message (if any) */}
        {errorMsg && (
          <div className="bg-red-500/20 border border-red-500/40 text-red-300 text-sm p-2 rounded mb-4">
            {errorMsg}
          </div>
        )}

        {/* ----------------------------- */}
        {/* Username Input */}
        {/* ----------------------------- */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-semibold">Username</label>
          <input
            className="
              w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white
              placeholder-gray-300 focus:ring-2 focus:ring-green-400 outline-none
            "
            placeholder="Pick a username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        {/* ----------------------------- */}
        {/* Email Input */}
        {/* ----------------------------- */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-semibold">Email</label>
          <input
            className="
              w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white
              placeholder-gray-300 focus:ring-2 focus:ring-green-400 outline-none
            "
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* ----------------------------- */}
        {/* Password Input */}
        {/* ----------------------------- */}
        <div className="mb-6">
          <label className="block mb-1 text-sm font-semibold">Password</label>
          <input
            type="password"
            className="
              w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white
              placeholder-gray-300 focus:ring-2 focus:ring-green-400 outline-none
            "
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* ----------------------------- */}
        {/* Register Button */}
        {/* ----------------------------- */}
        <button
          onClick={doRegister}
          disabled={loading}
          className={`
            w-full py-3 rounded-xl font-semibold transition
            ${loading
              ? "bg-green-500/40 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 active:scale-95"
            }
          `}
        >
          {loading ? "Creating account..." : "Register"}
        </button>

        {/* ----------------------------- */}
        {/* Switch to Login */}
        {/* ----------------------------- */}
        <div className="text-center mt-6">
          <p className="text-gray-300 text-sm">Already have an account?</p>
          <button
            onClick={onSwitchToLogin}
            className="
              mt-2 px-4 py-1.5 rounded-xl border border-green-400 text-green-400
              hover:bg-green-500 hover:text-white transition
            "
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}
