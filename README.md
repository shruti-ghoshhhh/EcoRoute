# 🌍 EcoRoute — Gamified Environmental Logistics Platform

EcoRoute is a full-stack MERN (MongoDB, Express.js, React, Node.js) application designed to promote sustainable living through gamification, intelligent logistics, and AI-powered insights. The platform enables users to actively participate in waste management while tracking their environmental impact in real time.

---

## 🚀 Core Features

### 🔐 Authentication & Security

* JWT-based authentication with secure password hashing (bcrypt)
* Role-Based Access Control (RBAC) for Users and Admins
* Google OAuth 2.0 integration for seamless login

---

### 🎮 Gamified User Experience

* XP-based progression system with multiple ranks:

  * 🌱 Beginner Cleaner
  * ♻️ Eco Warrior
  * 🌍 Planet Guardian
  * 🦸 Earth Savior
* Achievement badges mapped to real-world environmental impact
* Daily quests to encourage consistent engagement
* Interactive dashboard with real-time user stats

---

### 🚚 Eco-Logistics System

* Map-based waste pickup requests using Leaflet (drag-and-drop pin location)
* Waste categorization (Industrial, E-Waste, Organic, etc.)
* Automated email notifications using Nodemailer for status updates:

  * Pending → In-Route → Completed

---

### 🤖 AI Route Optimization & CO₂ Tracking

* Integration with Google Gemini API for eco-friendly route suggestions
* Calculates low-emission routes (walking, cycling, public transport)
* Tracks and visualizes CO₂ emissions saved per route
* Stores route history and contributes to global CO₂ offset metrics

---

### 💬 AI Chat Assistant

* Built-in conversational assistant for:

  * Recycling guidance
  * Waste management queries
  * Environmental awareness

---

### 🛠️ Admin Dashboard

* Secure admin panel for platform management
* Real-time analytics:

  * Active users
  * Routes generated
  * Total CO₂ saved
* Data visualization using charts
* User moderation (ban/unban, XP management)
* Pickup management system (update logistics status)
* Feedback monitoring system
* CSV export for users and route data

---

### 🎨 UI/UX Design

* Fully responsive interface built with TailwindCSS
* Modern glassmorphism design with gradient themes
* Dark/Light mode support
* Smooth animations using Framer Motion

---

## 🧠 Tech Stack

**Frontend:**

* React.js
* TailwindCSS
* Framer Motion
* Leaflet

**Backend:**

* Node.js
* Express.js
* MongoDB (Mongoose)

**Integrations:**

* Google OAuth 2.0
* Gemini API (AI)
* Nodemailer (SMTP)

---

## 🌱 Vision

EcoRoute aims to bridge the gap between technology and environmental responsibility by creating a system where users are rewarded for sustainable actions while contributing to real-world impact.

---

## 📌 Future Enhancements

* Real-time pickup tracking
* Rewards marketplace
* Community-driven features
* Mobile application support

---

## ⚡ Getting Started

```bash
# Clone the repository
git clone https://github.com/your-username/ecoroute.git

# Install dependencies
cd ecoroute
npm install

# Run development server
npm run dev
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

## 📄 License

This project is licensed under the MIT License.
