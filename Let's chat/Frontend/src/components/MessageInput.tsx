import React, { useState } from 'react';

// MessageInput receives a prop "onSend" which is a function.
// This function will be called when the user clicks "Send" or presses Enter.
export default function MessageInput({ onSend }: { onSend: (text: string) => void }) {

  // Local state to store the text user is typing
  const [text, setText] = useState('');

  // This function handles sending the message
  const submit = () => {
    // If the message is empty or only spaces, don't send it
    if (!text.trim()) return;

    // Pass the message to the parent component via onSend()
    onSend(text.trim());

    // Clear the input box after sending
    setText('');
  };

  return (
    // Main wrapper container with styling
    // flex → places input + button horizontally
    // bg-black/20 → transparent black background
    // backdrop-blur-md → glass blur effect
    // rounded-xl → rounded corners
    <div className="flex items-center gap-2 bg-black/20 p-3 rounded-xl backdrop-blur-md border border-white/10 shadow-md">

      {/* ------------ Input Field ------------ */}
      {/* Controlled input with value={text} */}
      <input
        value={text}
        onChange={(e) => setText(e.target.value)} // update text state
        onKeyDown={(e) => { 
          if (e.key === "Enter") submit(); // allow Enter press to send message
        }}
        className="
          flex-1 px-4 py-2.5 
          bg-white/10 text-white 
          rounded-full 
          outline-none border border-white/20
          placeholder-gray-400
          focus:ring-2 focus:ring-blue-500 
          transition
        "
        placeholder="Type a message…"
      />

      {/* ------------ Send Button ------------ */}
      {/* Button triggers submit() to send the message */}
      <button
        onClick={submit}
        className="
          px-5 py-2.5 
          bg-blue-600 hover:bg-blue-700 
          text-white font-medium 
          rounded-full 
          transition-all shadow
        "
      >
        Send
      </button>

    </div>
  );
}
