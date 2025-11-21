# ⚙️ Realtime Chat App — Backend (Node.js + Express + MongoDB + Socket.IO)

This backend powers a realtime chat application using a **REST API** for authentication + channels, and **Socket.IO websockets** for live messaging.

---

# 📌 Table of Contents
- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Environment Variables](#environment-variables)
- [System Architecture](#system-architecture)
- [Database Models](#database-models)
- [Authentication Flow](#authentication-flow)
- [Channel API](#channel-api)
- [Message Flow (Socket.IO)](#message-flow-socketio)
- [Realtime Data Flow Diagram](#realtime-data-flow-diagram)
- [Middleware Explanation](#middleware-explanation)
- [Error Handling](#error-handling)
- [How to Run Backend](#how-to-run-backend)
- [Future Improvements](#future-improvements)

---

# 🧩 Overview
The backend provides:

- JWT-based authentication (login/register)
- Channel creation & retrieval
- Realtime bidirectional chat using Socket.IO
- MongoDB persistence for:
  - Users
  - Channels
  - Messages
- Broadcast of new channels & messages to all clients

The backend ensures **secure access**, **fast lookups**, and **scalable message delivery**.

---

# ⚙️ Tech Stack
| Purpose | Technology |
|--------|------------|
| Runtime | Node.js |
| Framework | Express.js |
| Realtime | Socket.IO |
| DB | MongoDB + Mongoose |
| Auth | JWT |
| Security | bcrypt |
| Environment | dotenv |

---

# 📁 Folder Structure

```
backend/
│── server.js
│── .env
│── models/
│     ├── Users.js
│     ├── Channel.js
│     └── Message.js
│
│── routes/
│     ├── auth.js
│     └── channelRoutes.js
│
└── middleware/
      └── auth.js
```

---

# 🔐 Environment Variables

Create **`.env`** file:

```
MONGO_URI=mongodb://localhost:27017/chatapp
JWT_SECRET=your_secret_key
PORT=5000
```

---

# 🏛 System Architecture

```
Client (React)
│
├── REST API (Login, Register, Channels)
│
└── Websocket (Messages & New Channel Updates)
       ↓
Socket.IO Server
       ↓
MongoDB (Messages, Channels, Users)
```

REST API handles **authentication & channel CRUD**, while Socket.IO handles **chat events**.

---

# 🗄 Database Models

### 1️⃣ **User Model**

```
username — unique
email — unique
password — hashed with bcrypt
createdAt
```

### 2️⃣ **Channel Model**

```
name — unique
createdBy — user ID
timestamps
```

### 3️⃣ **Message Model**

```
room — string channel name
userId — ObjectId
username — denormalized for speed
text — string
createdAt — indexed
```

---

# 🔐 Authentication Flow

```
[User Login/Register]
        ↓
Backend validates credentials
        ↓
Backend generates JWT token
        ↓
Client stores token locally
        ↓
All protected routes require:  Authorization: Bearer <token>
```

The middleware validates token on every request:

```js
const auth = require("../middleware/auth");
```

If token is invalid → `401 Unauthorized`.

---

# 📡 Channel API

### Create Channel
```
POST /channels
Authorization: Bearer <token>
```

### Get All Channels
```
GET /channels
Authorization: Bearer <token>
```

Both require authentication.

---

# ⚡ Message Flow (Socket.IO)

```
Client sends "send_message"
    ↓
Server saves message
    ↓
Server emits "new_message" to all clients in room
    ↓
Clients update UI instantly
```

---

# 🔄 Realtime Data Flow Diagram

```
   ┌─────────────┐          ┌───────────────┐
   │   Frontend   │          │    Backend    │
   └──────┬────────┘          └─────────┬─────┘
          │ HTTP Login/Register          │
          │----------------------------->│
          │                              │
          │<-----------------------------│
          │      JWT Token Returned      │
          │                              │
          │   WebSocket Connection       │
          │----------------------------->│
          │                              │
          │   send_message Event         │
          │----------------------------->│
          │                              │
          │<-----------------------------│
          │     new_message Event        │
```

---

# 🧱 Middleware Explanation

### **auth.js**

Protects endpoints by verifying:

- Token existence
- Token validity
- User existence in DB

Adds the user object to `req.user` for use in routes.

---

# ⚠️ Error Handling

### Common responses:
- `400` — Missing fields
- `401` — Invalid token
- `404` — Channel not found
- `500` — Server error

Backend always returns consistent JSON:

```json
{ "error": "Message here" }
```

---

# ▶️ How to Run Backend

```bash
cd backend
npm install
npm start
```

Backend runs at:
```
http://localhost:5000
```

---

# 🚀 Future Improvements
- Admin-only channel deletion
- Private channels
- Typing indicators
- Rate limiting for spam
- Message editing & deletion
- Pagination for large message history
- Docker deployment
- Redis adapter for websockets scaling

