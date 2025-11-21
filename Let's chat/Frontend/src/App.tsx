import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useParams } from "react-router-dom";

import ChannelList from "./components/ChannelList";
import ChatWindow from "./components/ChatWindow";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";

import { connectSocket, disconnectSocket, getSocket } from "./sockets";
import api from "./api";
import type { User } from "./types";

// ------------------------------------------------------
// 404 Page for Invalid Channels
// ------------------------------------------------------
function ChannelNotFound() {
  return (
    <div className="text-red-500 text-2xl font-bold p-8">
      <h1>⚠️ Channel not found (404)</h1>
      <span className="text-pretty text-base text-yellow-500 italic">Please check the Channel name and try again later...</span>
    </div>
  );
}

// ------------------------------------------------------
// Redirect to Login (for unauthorized users)
// ------------------------------------------------------
function NavigateToLogin() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/login");
  }, []);
  return null;
}

function LoginRedirect() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/login");
  }, []);
  return null;
}

// ------------------------------------------------------
// MAIN APP COMPONENT
// ------------------------------------------------------
export default function App() {
  const navigate = useNavigate();

  // Authentication state
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  // 🔥 Store valid channels (name list)
  const [channels, setChannels] = useState<string[]>([]);

  // ------------------------------------------------------
  // SOCKET CONNECT / DISCONNECT
  // ------------------------------------------------------
  useEffect(() => {
    if (token) connectSocket(token);
    else disconnectSocket();

    return () => disconnectSocket();
  }, [token]);

  // ------------------------------------------------------
  // LOGIN HANDLER
  // ------------------------------------------------------
  const handleLogin = (tokenVal: string, userObj: User) => {
    localStorage.setItem("token", tokenVal);
    localStorage.setItem("user", JSON.stringify(userObj));

    setToken(tokenVal);
    setUser(userObj);

    navigate("/chat/general");
  };

  // ------------------------------------------------------
  // LOGOUT HANDLER
  // ------------------------------------------------------
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);

    navigate("/login");
  };

  // ------------------------------------------------------
  // LOAD CHANNELS FROM BACKEND
  // ------------------------------------------------------
  useEffect(() => {
    api
      .get("/channels")
      .then((res) => {
        const names = (res.data || []).map((c: any) => c.name);
        setChannels(names);
      })
      .catch((err) => console.log("Channel load error:", err));
  }, [user]);

  // ------------------------------------------------------
  // SOCKET LISTENER FOR NEW CHANNELS
  // ------------------------------------------------------
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handler = (ch: any) => {
      setChannels((prev) =>
        prev.includes(ch.name) ? prev : [...prev, ch.name]
      );
    };

    socket.on("new_channel", handler);
    return () => socket.off("new_channel", handler);
  }, [user]);

  // ------------------------------------------------------
  // STRICT CHANNEL VALIDATION WRAPPER
  // ------------------------------------------------------
  const RoomWrapper = () => {
    const { room } = useParams();

    // Wait until channel list loads
    if (channels.length === 0) return <div>Loading...</div>;

    // ❌ Channel does not exist
    if (!channels.includes(room!)) {
      return <ChannelNotFound />;
    }

    // ✅ Valid channel → show chat window
    return <ChatWindow room={room!} user={user!} />;
  };

  // ------------------------------------------------------
  // MAIN LAYOUT & ROUTES
  // ------------------------------------------------------
  return (
    <div className="min-h-screen flex overflow-hidden">
      
      {/* LEFT SIDEBAR */}
      <div className="w-64 border-r">
        <ChannelList
          onSelectChannel={(channel) => navigate(`/chat/${channel}`)}
          username={user?.username ?? ""}
          isLoggedIn={!!user}
          onLogout={handleLogout}
        />
      </div>

      {/* RIGHT CONTENT */}
      <div className="flex-1 p-4">
        <Routes>
          
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              <LoginPage
                onLogin={handleLogin}
                onSwitchToRegister={() => navigate("/register")}
              />
            }
          />

          <Route
            path="/register"
            element={
              <RegisterPage
                onRegister={handleLogin}
                onSwitchToLogin={() => navigate("/login")}
              />
            }
          />

          {/* Protected Chat Route */}
          <Route
            path="/chat/:room"
            element={user ? <RoomWrapper /> : <LoginRedirect />}
          />

          {/* Default Redirect */}
          <Route path="*" element={<NavigateToLogin />} />

        </Routes>
      </div>
    </div>
  );
}
