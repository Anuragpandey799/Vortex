# 🚀 Realtime Chat App — Frontend (React + Socket.IO + TypeScript)
A fully responsive, realtime chat frontend built using **React**, **TypeScript**, **TailwindCSS**, and **Socket.IO**.  
This frontend communicates with a Node.js backend using JWT authentication and websocket connections to deliver a real-time messaging experience.

---

# 📌 Table of Contents
- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Architecture](#project-architecture)
- [Folder Structure](#folder-structure)
- [Routing System](#routing-system)
- [Authentication Flow](#authentication-flow)
- [Socket.IO (Realtime) Flow](#socketio-realtime-flow)
- [Channel Management Flow](#channel-management-flow)
- [Data Flow Diagram](#data-flow-diagram)
- [Component-Level Breakdown](#component-level-breakdown)
- [UI/UX Design Decisions](#uiux-design-decisions)
- [Error Handling](#error-handling)
- [How to Run Frontend](#how-to-run-frontend)
- [Future Enhancements](#future-enhancements)

---

# 🎯 Project Overview
The frontend of this project is a **modern real-time chat interface** where:

- Users can **register/login**
- Join chat rooms (channels)
- Send & receive messages instantly via **websockets**
- Create new channels
- Automatically update UI when new channels appear globally
- Sync channel name with **URL routing**
- Show error page if URL contains invalid channels

The UI is inspired by Slack / Discord and designed to be extremely clean and intuitive.

---

# 🛠 Tech Stack
| Purpose | Technology |
|--------|------------|
| Main Library | React (with Hooks) |
| Language | TypeScript |
| Styling | TailwindCSS |
| State | Component State + URL Params |
| Realtime | Socket.IO Client |
| HTTP Requests | Axios |
| Routing | React Router v6 |
| Time Formatting | dayjs |

---

# 🌐 Project Architecture

```
React App
│
├── Authentication
│     ├── Login
│     ├── Register
│     ├── JWT storage (localStorage)
│     └── Auto socket connection on login
│
├── Chat System
│     ├── ChatWindow
│     │     ├── MessageList
│     │     ├── MessageBubble
│     │     └── MessageInput
│     ├── URL-based channel routing
│     ├── Realtime messages via Socket.IO
│     └── Fetch previous messages from API
│
└── Channels Sidebar
      ├── Fetch channels
      ├── Realtime updates for new channels
      ├── Create new channels
      └── Channel → URL sync
```

---

# 📁 Folder Structure

```
frontend/
│── src/
│     ├── App.tsx
│     ├── index.tsx
│     ├── api.ts
│     ├── sockets.ts
│     ├── types.ts
│     ├── components/
│     │       ├── ChannelList.tsx
│     │       ├── ChatWindow.tsx
│     │       ├── MessageInput.tsx
│     │       ├── MessageBubble.tsx
│     │       ├── LoginPage.tsx
│     │       └── RegisterPage.tsx
│     └── styles/index.css
```

---

# 🧭 Routing System

### 🔥 Full URL-based routing:
- `/login`
- `/register`
- `/chat/:room`

Example:
```
/chat/general
/chat/random
/chat/programming
```

### 🔒 Route Protection
- If user is not logged in → redirect to `/login`
- If channel does not exist → show **404 page**

---

# 🔐 Authentication Flow

```
[User Logs In]
       ↓
React sends email+password → Backend
       ↓
Backend returns JWT + User
       ↓
JWT stored in localStorage
       ↓
Socket.IO connects using token
       ↓
User is redirected to → /chat/general
```

### Token stored:
```
localStorage["token"]
localStorage["user"]
```

Frontend attaches token automatically for all API calls.

---

# ⚡ Socket.IO (Realtime) Flow

### Realtime Message Flow
```
User sends message
    ↓
Frontend emits → socket.emit("message", { room, text })
    ↓
Backend receives and stores message
    ↓
Backend emits → io.to(room).emit("new_message", messageObj)
    ↓
All clients update instantly
```

### Realtime Channel Creation Flow
```
User creates channel
    ↓
Frontend POST → /channels
    ↓
Backend saves channel
    ↓
Backend emits "new_channel"
    ↓
All clients update channel list immediately
```

---

# 🛰 Channel Management Flow

```
⦾ Fetch all channels on mount
⦾ Listen for "new_channel" event
⦾ Add new channel to sidebar in realtime
⦾ Clicking a channel updates URL → /chat/:room
⦾ ChatWindow loads messages for selected room
```

---

# 🔄 Data Flow Diagram

```
                 ┌──────────────┐
                 │   Frontend   │
                 └──────┬───────┘
                        │ REST API
                        ▼
                ┌───────────────┐
                │   Backend     │
                └──────┬────────┘
                        │ MongoDB Queries
                        ▼
                   ┌──────────┐
                   │ MongoDB  │
                   └──────────┘

Realtime (Socket.IO)
Frontend ⇄ Backend  (persistent websocket)
```

---

# 📦 Component-Level Breakdown

### ✔ `App.tsx`
- Main router
- Handles login redirection
- Connects/disconnects socket
- Loads user/token from localStorage

### ✔ `ChannelList.tsx`
- Displays all channels
- Fetches channels from backend
- Realtime updates for new channels
- Handles logout
- Navigates to channel routes

### ✔ `ChatWindow.tsx`
- Fetches chat messages for a channel
- Listens to `"new_message"` events
- Sends message via socket

### ✔ `MessageInput.tsx`
- Styled text input with Enter-to-send behavior

### ✔ `MessageBubble.tsx`
- Shows message differently for:
  - Current user (right side)
  - Others (left side)

---

# 🎨 UI/UX Design Decisions
- Channel list is always visible (like Slack)
- Clean color-coded chat bubbles
- Fixed-height message input
- Auto-scroll to latest message
- URL-driven room navigation for shareable links
- Mobile-friendly layout

---

# ❗ Error Handling
- Invalid credentials → error toast
- Token expired → redirect to login
- Invalid channel URL → 404 message
- Websocket disconnect → auto-reconnect
- API failure → fallback UI

---

# ▶️ How to Run Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at:
```
http://localhost:5173
```

---

# 🌱 Future Enhancements
- Typing indicators
- Read receipts
- User presence (online/offline)
- File/image sharing
- Emojis, reactions
- Threaded conversations
- Dark mode toggle
- Notifications system


