import { io, Socket } from "socket.io-client";
import type { Message } from "./types";

const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

let socket: Socket | null = null;

// Connect socket after login
export const connectSocket = (token: string) => {
  if (socket) return socket;

  socket = io(URL, {
    auth: { token },
    transports: ["websocket"]
  });

  return socket;
};

export const disconnectSocket = () => {
  if (!socket) return;
  socket.disconnect();
  socket = null;
};

export const joinRoom = (room: string) => {
  socket?.emit("join_room", room);
};

export const leaveRoom = (room: string) => {
  socket?.emit("leave_room", room);
};

export const sendMessage = (payload: { room: string; text: string }) => {
  socket?.emit("send_message", payload);
};

export const onReceiveMessage = (cb: (msg: Message) => void) => {
  socket?.on("receive_message", cb);
};

// IMPORTANT: used by ChannelList
export const getSocket = () => socket;
