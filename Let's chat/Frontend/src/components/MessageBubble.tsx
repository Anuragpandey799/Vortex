import React from "react";
import type { Message } from "../types";
import dayjs from "dayjs";

// MessageBubble Component
// This component shows a single chat message (username, time, text)
// It receives two things:
// 1. msg → The message object
// 2. currentUserId → To check whether the message is sent by current user or someone else
export default function MessageBubble({
  msg,
  currentUserId,
}: {
  msg: Message;
  currentUserId: string;
}) {

  // Check if this message belongs to the current user
  // This helps us style "my messages" differently from "others' messages"
  const isMe = msg.userId === currentUserId;

  return (
    // Main wrapper for each message row
    // justify-end → align my messages to the right
    // justify-start → align others' messages to the left
    <div
      className={`mb-3 flex ${
        isMe ? "justify-end text-right" : "justify-start text-left"
      }`}
    >
      <div>

        {/* ------------ Username + Time ------------ */}
        {/* 
          Shows:
          - "You" if the message belongs to currentUser
          - sender's username otherwise
          - createdAt formatted in HH:mm format
        */}
        <div
          className={`text-xs mb-1 ${
            isMe ? "text-blue-400" : "text-slate-500"
          }`}
        >
          {isMe ? "You" : msg.username} •{" "}
          {dayjs(msg.createdAt).format("HH:mm")}
        </div>

        {/* ------------ Message Bubble ------------ */}
        {/* 
          This contains the actual message text.
          Styling changes:
            - Blue background for my messages
            - Gray background for others
          break-words → prevents long text from overflowing
          shadow → adds depth for the bubble
        */}
        <div
          className={`px-3 py-2 rounded-xl inline-block max-w-xs break-words shadow 
            ${isMe ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-900"}
          `}
        >
          {msg.text}
        </div>

      </div>
    </div>
  );
}
