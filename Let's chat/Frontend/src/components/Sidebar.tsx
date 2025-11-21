import React from "react";

type Props = {
  channels: string[];
  current: string;
  onSelect: (c: string) => void;
  username?: string | null;
  onLogout: () => void;
  newChannel: string;
  setNewChannel: (v: string) => void;
  onCreateChannel: () => void;
  isLoggedIn: boolean;
};

export default function Sidebar({
  channels,
  current,
  onSelect,
  username,
  onLogout,
  newChannel,
  setNewChannel,
  onCreateChannel,
  isLoggedIn
}: Props) {
  return (
    // MAIN SIDEBAR WRAPPER
    // Fixed width + vertical layout + dark background
    <div className="w-64 h-screen flex flex-col bg-gradient-to-b from-gray-950 via-black to-gray-900 text-gray-200 border-r border-white/10">

      {/* ---------------------------------------------- */}
      {/* HEADER SECTION */}
      {/* Shows project title + username if logged in     */}
      {/* ---------------------------------------------- */}
      <div className="p-5 border-b border-white/10 bg-black/40 backdrop-blur">
        <div className="text-2xl font-bold text-white">Realtime Chat</div>

        <div className="text-sm text-gray-400 mt-1">
          {isLoggedIn ? (
            <>
              Hi, <span className="text-green-400">{username}</span>
            </>
          ) : (
            "Not logged in"
          )}
        </div>
      </div>

      {/* ---------------------------------------------- */}
      {/* CHANNEL LIST SECTION                             */}
      {/* Scrollable area that shows all available channels */}
      {/* ---------------------------------------------- */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
        <div className="text-xs font-semibold text-gray-500 uppercase mb-2">
          Channels
        </div>

        <ul className="space-y-1">
          {channels.map((c) => (
            <li key={c}>
              {/* Channel button */}
              <button
                onClick={() => onSelect(c)}
                className={`
                  w-full py-2 px-3 rounded-lg text-sm transition
                  ${
                    current === c
                      ? "bg-green-500/10 text-green-300 border border-green-500/20"
                      : "text-gray-300 hover:bg-white/5 hover:text-white"
                  }
                `}
              >
                # {c}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* ---------------------------------------------- */}
      {/* FOOTER SECTION                                  */}
      {/* Contains: Create channel input + buttons         */}
      {/* Only visible when logged in                      */}
      {/* ---------------------------------------------- */}
      <div className="p-4 border-t border-white/10 bg-black/40 backdrop-blur space-y-3">

        {isLoggedIn ? (
          <>
            {/* INPUT → New channel name */}
            <input
              value={newChannel}
              onChange={(e) => setNewChannel(e.target.value)}
              placeholder="Create new channel"
              className="
                w-full p-2 text-sm rounded-lg
                bg-gray-900 border border-gray-700
                text-gray-200 placeholder-gray-500
                focus:ring-2 focus:ring-green-400 focus:border-transparent
              "
            />

            {/* BUTTON → Create channel */}
            <button
              onClick={onCreateChannel}
              className="
                w-full py-2 rounded-lg font-semibold text-sm
                bg-green-600 text-white
                hover:bg-green-700 transition
              "
            >
              Create Channel
            </button>

            {/* BUTTON → Logout */}
            <button
              onClick={onLogout}
              className="
                w-full py-2 rounded-lg font-semibold text-sm
                bg-red-600 text-white
                hover:bg-red-700 transition
              "
            >
              Logout
            </button>
          </>
        ) : (
          <p className="text-gray-400 text-sm text-center">
            Login to create channels
          </p>
        )}
      </div>
    </div>
  );
}
