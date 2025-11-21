import React, { useEffect, useRef, useState } from "react";
import api from "../api";
import type { Message, User } from "../types";

// socket helper methods
import {
  connectSocket,
  joinRoom,
  leaveRoom,
  sendMessage,
  onReceiveMessage,
} from "../sockets";

import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";

// Props received:
// - room: current room name that user is inside
// - user: current logged-in user info
type Props = { room: string; user: User };

export default function ChatWindow({ room, user }: Props) {

  // Holds messages of the current room
  const [messages, setMessages] = useState<Message[]>([]);

  // ref to message container for auto-scrolling
  const containerRef = useRef<HTMLDivElement | null>(null);

  //------------------------------------------------------------
  // 1️⃣ Connect to socket ONLY once on component mount
  //------------------------------------------------------------
  useEffect(() => {
    const token = localStorage.getItem("token");

    // connectSocket establishes the websocket connection
    if (token) connectSocket(token);

    // no cleanup needed because socket stays active for whole session
  }, []);

  //------------------------------------------------------------
  // 2️⃣ Load all previous messages whenever room changes
  //    Also join and leave that specific socket room
  //------------------------------------------------------------
  useEffect(() => {
    let mounted = true; // helps avoid setting state after unmount

    (async () => {
      try {
        // fetch message history of the room
        const res = await api.get<Message[]>(`/messages/${room}`);

        // only set messages if component is still mounted
        if (mounted) setMessages(res.data || []);

        // scroll to bottom slightly after rendering messages
        setTimeout(() => scrollToBottom(), 100);

      } catch (err) {
        console.error(err);
        setMessages([]); // fallback empty chat on error
      }
    })();

    // join the room on socket server
    joinRoom(room);

    // cleanup → leave room when switching rooms or unmount
    return () => {
      mounted = false;
      leaveRoom(room);
    };
  }, [room]); // runs every time room changes

  //------------------------------------------------------------
  // 3️⃣ Listen for incoming socket messages
  //    This runs only ONCE on mount
  //------------------------------------------------------------
  useEffect(() => {
    const handler = (msg: Message) => {
      // append new incoming message
      setMessages((prev) => [...prev, msg]);

      // auto-scroll to bottom
      setTimeout(() => scrollToBottom(), 50);
    };

    // register socket event listener
    onReceiveMessage(handler);
  }, []);

  //------------------------------------------------------------
  // Auto scroll helper
  //------------------------------------------------------------
  const scrollToBottom = () => {
    containerRef.current?.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: "smooth",
    });
  };

  //------------------------------------------------------------
  // Send message handler
  //------------------------------------------------------------
  const handleSend = (text: string) => {
    if (!text.trim()) return;

    // send message to server
    sendMessage({ room, text });
  };

  //------------------------------------------------------------
  // MARKUP
  //------------------------------------------------------------
  return (
    <div className="
      flex flex-col 
      h-[90vh]       /* FIXED HEIGHT */
      bg-gradient-to-br from-gray-900 via-gray-800 to-black
      rounded-xl border border-white/10 shadow-xl overflow-hidden
    ">
      
      {/* --------------------------------------------------------
          HEADER (Room title + username)
         -------------------------------------------------------- */}
      <div className="
        sticky top-0 z-10 
        px-4 py-3 
        bg-black/30 backdrop-blur-lg 
        border-b border-white/10 
        flex items-center justify-between
      ">
        <div>
          {/* Room Title */}
          <div className="text-lg font-semibold text-white tracking-wide">
            # {room}
          </div>

          {/* User Logged Info */}
          <div className="text-xs text-gray-400">
            Logged in as{" "}
            <span className="text-green-300 font-medium">
              {user.username}
            </span>
          </div>
        </div>
      </div>

      {/* --------------------------------------------------------
          MESSAGE LIST AREA (Scrollable)
         -------------------------------------------------------- */}
      <div
        ref={containerRef}
        className="
          flex-1 overflow-auto px-4 py-3 
          bg-gradient-to-b from-black/20 to-black/40 
          backdrop-blur-sm
          space-y-2
          scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent
        "
      >
        {/* If chat is empty show placeholder text */}
        {messages.length === 0 ? (
          <div className="
            flex items-center justify-center h-full 
            text-red-400 text-sm animate-bounce
          ">
            No messages yet — start the conversation!
          </div>
        ) : (
          // Render each bubble
          messages.map((m) => (
            <MessageBubble 
              key={m._id} 
              msg={m} 
              currentUserId={user.id} 
            />
          ))
        )}
      </div>

      {/* --------------------------------------------------------
          INPUT AREA
         -------------------------------------------------------- */}
      <div className="
        px-4 py-3 
        bg-black/40 backdrop-blur-lg 
        border-t border-white/10
      ">
        <MessageInput onSend={handleSend} />
      </div>
    </div>
  );
}
