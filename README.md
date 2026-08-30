# Vynce 🚀

**Vynce** is a full-stack social media platform built with the **MERN stack**, designed to let users connect with people, share photos and videos, interact with posts, and communicate in real time.

The platform combines a social feed with a friend system and real-time chat to provide a complete social networking experience.

---

## ✨ Features

### 🔐 Authentication & User Management

* User signup and login
* JWT-based authentication
* Secure password hashing using bcrypt
* HTTP-only cookies for authentication
* Protected API routes
* User onboarding
* Profile management
* Profile picture support

### 👥 Social Connections

* Discover recommended users
* Send friend requests
* Accept friend requests
* View incoming friend requests
* View outgoing friend requests
* Manage friends
* Friend-based social connections

### 📝 Posts

* Create posts with captions
* Upload photos and videos
* View posts from users across the platform
* Edit post captions
* Delete posts
* Display author information with posts
* Chronological feed

### ❤️ Post Interactions

* Like / unlike posts
* Save / unsave posts
* View saved posts
* Comment on posts
* Edit comments
* Delete comments
* Display comment counts

### 💬 Real-Time Chat

* Real-time one-to-one messaging
* Stream Chat integration
* Friend-based conversations
* Real-time message delivery

### ☁️ Media Management

* Image and video uploads
* Cloudinary integration
* Cloud-based media storage
* Media URLs stored with posts

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Tailwind CSS
* DaisyUI
* Redux Toolkit
* Vite

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcrypt.js

### Third-Party Services

* Cloudinary — Image and video storage
* Stream Chat — Real-time messaging

### Development Tools

* Git
* GitHub
* Postman
* VS Code

---

## 🏗️ Architecture

Vynce follows a client-server architecture:

```text
                    ┌──────────────────┐
                    │      React       │
                    │    Frontend      │
                    └────────┬─────────┘
                             │
                       REST API / HTTP
                             │
                             ▼
                    ┌──────────────────┐
                    │     Express      │
                    │     Backend      │
                    └────────┬─────────┘
                             │
                 ┌───────────┴───────────┐
                 │                       │
                 ▼                       ▼
        ┌────────────────┐      ┌────────────────┐
        │    MongoDB     │      │   Cloudinary   │
        │    Database    │      │ Media Storage  │
        └────────────────┘      └────────────────┘
                                         
                             ┌────────────────┐
                             │  Stream Chat   │
                             │ Real-time Chat │
                             └────────────────┘
```

---

## 📁 Project Structure

```text
Vynce/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── lib/
│   ├── uploads/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/
│   │   └── ...
│   └── package.json
│
└── README.md
```

---

## 🔄 Application Flow

### Authentication

```text
Signup / Login
      ↓
JWT generated
      ↓
JWT stored in HTTP-only cookie
      ↓
Protected requests
      ↓
Authentication middleware
      ↓
User identified
```

### Creating a Post

```text
User selects image/video
          ↓
Media uploaded to Cloudinary
          ↓
Cloudinary returns media URL
          ↓
Post created through REST API
          ↓
Post stored in MongoDB
          ↓
Post appears in feed
```

### Friend Request

```text
User A
  ↓
Send Friend Request
  ↓
FriendRequest stored in MongoDB
  ↓
User B accepts request
  ↓
Both users added to each other's friends list
```

### Real-Time Chat

```text
User
  ↓
Authenticated Stream token
  ↓
Connect to Stream Chat
  ↓
Open conversation
  ↓
Real-time messages
```

---

## 🔑 API Overview

### Authentication

```text
POST   /api/auth/signup
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me
POST   /api/auth/onboarding
```

### Users & Friends

```text
GET    /api/users
GET    /api/users/friends
GET    /api/users/friend-requests
GET    /api/users/outgoing-friend-requests

POST   /api/users/friend-request/:id
POST   /api/users/friend-request/:id/accept
```

### Posts

```text
GET    /api/posts
GET    /api/posts/:id
GET    /api/posts/user/:userId

POST   /api/posts/createPost
PUT    /api/posts/:id
DELETE /api/posts/:id

POST   /api/posts/:id/like
POST   /api/posts/:id/save
```

### Comments

```text
GET    /api/posts/:id/comments
POST   /api/posts/:id/comments

PUT    /api/posts/comments/:id
DELETE /api/posts/comments/:id
```

### Chat

```text
GET    /api/chat/token
```

> API routes may vary depending on the final backend route configuration.

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Anand-Verma05/Vynce.git
cd Connect
```

---

### 2. Install backend dependencies

```bash
cd backend
npm install
```

---

### 3. Install frontend dependencies

```bash
cd ../frontend
npm install
```

---

## 🔑 Environment Variables

Create a `.env` file inside the backend directory.

```env
PORT=5001

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_api_secret
```

Do not commit your `.env` file to GitHub.

---

## ▶️ Running the Application

### Start the backend

```bash
cd backend
npm run dev
```

The backend will run on:

```text
http://localhost:5001
```

### Start the frontend

Open another terminal:

```bash
cd frontend
npm run dev
```

The frontend will be available at the Vite development URL shown in your terminal.

---

## 🔒 Security

Vynce implements several basic security practices:

* Password hashing using bcrypt
* JWT-based authentication
* HTTP-only authentication cookies
* Protected backend routes
* Authorization checks for modifying posts and comments
* User ownership validation before editing/deleting content
* Environment variables for API credentials

---

## 🚀 Future Improvements

Planned features and possible improvements include:

* 🔔 Real-time notifications
* 🔍 User and post search
* #️⃣ Hashtags
* 📈 Trending / Explore feed
* 🧵 Comment replies
* 🔒 Private accounts and post visibility
* 📱 Improved mobile-first experience
* ❤️ Notifications for likes and comments
* 👤 Follow/unfollow system
* 📊 User activity and analytics
* ⚡ Optimistic UI updates
* 🗄️ Feed pagination and infinite scrolling
* 🚀 Production deployment and performance optimization

---

## 🎯 Learning Goals

This project was built to gain practical experience with:

* Full-stack MERN development
* REST API design
* Authentication and authorization
* MongoDB data modeling
* Mongoose relationships and population
* Media upload and cloud storage
* Real-time communication
* React state management
* Frontend/backend integration
* API testing with Postman

---

## 👨‍💻 Author

**Anand Verma**

B.Tech — Robotics & Automation
National Institute of Technology, Kurukshetra

* GitHub: [Anand-Verma05](https://github.com/Anand-Verma05)
* LinkedIn: [Anand Verma](https://www.linkedin.com/in/anand-verma-bps870/)

---

## ⭐ Support

If you find this project interesting, consider giving the repository a ⭐ on GitHub.

```
```
