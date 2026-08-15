# Saras AI ✦

> **Learn. Recall. Understand.**  
> Transform any educational video or topic into an interactive learning system with AI-powered topic segmentation, checkpoint quiz gating, physical-style active recall cards, and distraction-free deep focus.

---

## ⚡ Overview

**Saras AI** is an AI-powered active learning platform designed to replace passive video consumption with an active retrieval loop:
- 🎬 **Smart Video Ingestion**: Paste any YouTube URL or search topics to extract structure, chapters, and core concepts.
- 🔒 **Topic Checkpoint Quiz Gating**: Enforces true understanding before allowing students to advance through subsequent video chapters.
- 🃏 **Grounded Flashcards & Active Recall**: Automatically generates flashcards directly tied to video transcript definitions with spaced repetition actions.
- 🎯 **Deep Focus Workspace**: On-device privacy-first attention monitoring powered by client-side computer vision to pause playback on cognitive drift.
- 🤖 **Saras AI Companion**: Powered by Groq's high-speed LLM inference for instant curriculum syntheses and interactive Q&A.
- 📜 **Personal Learning History**: Automatically tracks progress, completed lessons, and study streaks.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14 (App Router)](https://nextjs.org/)
- **UI & Styling**: Vanilla Tailwind CSS + Neo-Brutalist / Editorial Design System
- **Database & ORM**: SQLite / PostgreSQL with [Prisma ORM](https://www.prisma.io/)
- **AI / LLM Engine**: [Groq Cloud API](https://console.groq.com/) (LLaMA 3.3 / LLaMA 3.1)
- **Video & Player**: YouTube IFrame API with custom seek-lock boundary enforcement
- **Vision / Attention**: Client-side MediaPipe Face Landmark Attention Tracking
- **Icons**: Lucide React

---

## 🚀 Quick Start

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/badgujarkunal93-blip/Saras-AI.git
cd Saras-AI
npm install
```

### 2. Configure Environment Variables
Copy the `.env.example` template:
```bash
cp .env.example .env
```
Add your free Groq API Key in `.env`:
```env
DATABASE_URL="file:./dev.db"
GROQ_API_KEY="your_groq_api_key_here"
```

### 3. Initialize Database & Seed Lessons
```bash
npx prisma db push
npx prisma db seed
```

### 4. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 License
MIT License. Built for active learning & mastery.
