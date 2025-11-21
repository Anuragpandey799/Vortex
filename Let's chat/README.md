# 💬 Let's Chat – Full Documentation & Setup Guide

Welcome to **Let’s Chat**, a full-stack real-time chat application supporting authentication, channels, and live messaging using Socket.IO.  
This single document contains **everything** you need:

✔ Installation guide (frontend + backend)  
✔ Tech stack  
✔ Features  
✔ Project structure  
✔ ER diagram  
✔ System architecture  
✔ API documentation    
✔ How the app works internally  
✔ Troubleshooting  
✔ Ready to copy-paste as README.md  

---

# 📁 Project Structure

```
Let's Chat/
│
├── frontend/            # React + TypeScript (Vite)
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
├── backend/             # Node.js + Express + MongoDB + Socket.IO
│   ├── server.js
│   ├── .env
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── package.json
│
└── README.md            # (this file)
```

---

# 🚀 Features

### 🧑‍💻 Authentication
- Register  
- Login  
- Secure JWT tokens  
- Protected API routes  
- Auto redirect for unauthorized users  

### 💬 Real-Time Messaging
- Socket.IO based messaging  
- Messages appear instantly  
- Supports multiple users concurrently  

### 📡 Channel System
- Create channels  
- Join channels  
- URL-based routing for each channel  
- 404 error for invalid channels  

### 🌐 Modern Frontend
- React + TypeScript  
- React Router v6  
- Clean component architecture  

---

# 🛠 Tech Stack

### Frontend
- React (TypeScript)
- Vite
- Axios
- React Router
- Socket.IO Client
- Tailwind CSS (if enabled)

### Backend
- Node.js
- Express
- MongoDB + Mongoose
- JWT + bcryptjs
- Socket.IO

---

# ⚙️ Installation Guide

This section contains step-by-step instructions.

---

# 🔧 Backend Setup

### 1. Move into backend directory
```bash
cd backend
```

### 2. Install backend packages
```bash
npm install
```

### 3. Create `.env`
Create a file named `.env` inside backend folder:

```
MONGO_URI=mongodb://127.0.0.1:27017/letschat
JWT_SECRET=your_secret_here
PORT=5000
```

### 4. Start backend server
```bash
npm start
```

Backend runs at:  
👉 **http://localhost:5000**

---

# 🎨 Frontend Setup

### 1. Move into frontend directory
```bash
cd frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start app
```bash
npm run dev
```

Frontend runs at:  
👉 **http://localhost:5173**

---

# 🔗 Connect Frontend ↔ Backend

Once BOTH servers are running:

Frontend → http://localhost:5173  
Backend → http://localhost:5000  

Application entry URL:  
👉 http://localhost:5173/login

You can now:
- Register  
- Login  
- Create channels  
- Chat in real time  

---

# 🧩 Database Models (ER Diagram)

```
┌──────────────┐       ┌──────────────┐        ┌───────────────┐
│    Users      │  1  ∞ │   Messages    │ ∞   1 │    Channels     │
└──────────────┘       └──────────────┘        └───────────────┘

Users:
- username
- email
- password

Channels:
- name
- createdBy

Messages:
- room (channel name)
- userId
- username
- text
- createdAt
```

---

# 🏗 System Architecture

```
          ┌──────────────────────────┐
          │      FRONTEND (React)    │
          │ Vite + TS + Socket.IO    │
          └──────────┬───────────────┘
                     │ REST + WebSocket
                     ▼
       ┌──────────────────────────────┐
       │    BACKEND (Express + WS)    │
       │ Auth + Channels + Messages   │
       └──────────┬───────────────────┘
                  │
                  ▼
        ┌───────────────────────────┐
        │         MongoDB           │
        └───────────────────────────┘
```

---

# 📚 API Documentation (Backend)

## AUTH

---

### 🔹 **POST /auth/register**
Register a new user.

#### Request body:
```json
{
  "username": "john",
  "email": "john@gmail.com",
  "password": "123456"
}
```

#### Response:
```json
{
  "token": "...",
  "user": {
    "id": "...",
    "username": "john",
    "email": "john@gmail.com"
  }
}
```

---

### 🔹 **POST /auth/login**
Login existing user.

```json
{
  "email": "john@gmail.com",
  "password": "123456"
}
```

---

## CHANNELS

### 🔹 **GET /channels** (Protected)
Returns list of channels.

### 🔹 **POST /channels** (Protected)
Create channel.

```json
{
  "name": "gaming"
}
```

---

# 🧠 How the App Works Internally

### Step 1 — User Authentication
- User logs in → Backend validates → Returns JWT  
- Token stored in browser localStorage  
- Every request includes Authorization header  
- Socket.IO connects using JWT  

---

### Step 2 — Channel Navigation
- Sidebar shows all channels  
- Clicking a channel updates URL:  
  `/chat/general`  
- React Router loads ChatWindow  

---

### Step 3 — Real-Time Messages
- User sends message  
- Backend receives and broadcasts  
- All other clients instantly update  

---

### Step 4 — Invalid Channel Protection
If user enters something like:  
`/chat/fakeChannel`

If channel does not exist →  
Frontend shows **404 or Invalid Channel** message.

---

# 🛠 Troubleshooting

### ❌ Backend not starting?
- Check `.env`  
- Make sure MongoDB is running  
- Node version must be ≥ 16  

### ❌ Client can't fetch channels?
Token missing → login again.  
Clear localStorage.

### ❌ Socket not connecting?
Restart both backend & frontend.

### ❌ "Invalid token"?
Clear browser storage.

---
