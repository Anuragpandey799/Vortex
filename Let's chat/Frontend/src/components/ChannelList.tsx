import React, { useEffect, useState } from "react";
import api from "../api";
import { getSocket } from "../sockets";

interface Channel {
  _id: string;
  name: string;
}

const ChannelList: React.FC<{
  onSelectChannel: (name: string) => void;
  username?: string | null;
  isLoggedIn: boolean; // true if user logged in
  onLogout: () => void;
}> = ({ onSelectChannel, username = null, isLoggedIn, onLogout }) => {
  // store all channels fetched from backend
  const [channels, setChannels] = useState<Channel[]>([]);

  // text input for creating a channel
  const [newChannel, setNewChannel] = useState("");

  // ------------------------------------------------------------
  // 1️⃣ LOAD ALL CHANNELS (for everyone — logged in or not)
  //    - Runs on mount
  //    - Also runs again when login state changes (for sync)
  // ------------------------------------------------------------
  useEffect(() => {
    let mounted = true;

    api
      .get<Channel[]>("/channels") // fetch all channels
      .then((res) => {
        if (!mounted) return;
        setChannels(res.data || []);
      })
      .catch((err) => {
        console.log("Channel load error:", err);
      });

    return () => {
      mounted = false;
    };
  }, [isLoggedIn]);
  // note: non-logged users can still view channels, so list always loads

  // ------------------------------------------------------------
  // 2️⃣ LISTEN FOR REALTIME NEW CHANNELS VIA SOCKET
  //    - Only works if socket exists (logged in user)
  //    - Guests can still see channels but won't get socket updates
  // ------------------------------------------------------------
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return; // socket exists only for logged-in users

    const handler = (channel: Channel) => {
      setChannels((prev) => {
        // prevent duplicates
        if (prev.some((c) => c._id === channel._id)) return prev;
        return [...prev, channel];
      });
    };

    socket.on("new_channel", handler);

    return () => {
      socket.off("new_channel", handler);
    };
  }, [isLoggedIn]);

  // ------------------------------------------------------------
  // 3️⃣ CREATE CHANNEL (allowed only for logged-in users)
  // ------------------------------------------------------------
  const createChannel = async () => {
    const name = newChannel.trim();
    if (!name) return;

    try {
      const res = await api.post<Channel>("/channels", { name });
      const created = res.data;

      // optimistic UI update
      setChannels((prev) => {
        if (prev.some((c) => c._id === created._id)) return prev;
        return [...prev, created];
      });

      // notify other users in real-time
      const socket = getSocket();
      socket?.emit("create_channel", created);

      setNewChannel("");
    } catch (err) {
      console.log("Error creating channel:", err);
    }
  };

  // ------------------------------------------------------------
  // MARKUP
  // ------------------------------------------------------------
  return (
    <div className="p-4">
      {/* Title */}
      <h2 className="text-xl font-bold mb-4">Channels</h2>

      {/* --------------------------------------------------------
          CHANNEL LIST (visible to everyone, logged in or not)
         -------------------------------------------------------- */}
      {channels.map((ch) => (
        <div
          key={ch._id}
          onClick={() => onSelectChannel(ch.name)}
          className="
            cursor-pointer py-2 
            hover:bg-gray-200 rounded 
            transition
          "
        >
          # {ch.name}
        </div>
      ))}

      <hr className="my-4" />

      {/* --------------------------------------------------------
          CHANNEL CREATION + LOGOUT (only if logged in)
         -------------------------------------------------------- */}
      {isLoggedIn ? (
        <>
          {/* Input to create channel */}
          <input
            value={newChannel}
            onChange={(e) => setNewChannel(e.target.value)}
            placeholder="New channel name"
            className="border p-1 w-full rounded"
          />

          {/* Create Button */}
          <button
            onClick={createChannel}
            className="
              mt-2 w-full bg-blue-500 
              text-white py-1 rounded 
              hover:bg-blue-600 transition
            "
          >
            Create Channel
          </button>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="
              mt-4 w-full bg-red-500 
              text-white py-1 rounded
              hover:bg-red-600 transition
            "
          >
            Logout ({username ?? "me"})
          </button>
        </>
      ) : (
        // -------------------------
        // Guest View (not logged in)
        // -------------------------
        <div>
          <p className="text-gray-600 text-sm">
            Login to create or manage channels.
          </p>
        </div>
      )}
    </div>
  );
};

export default ChannelList;
