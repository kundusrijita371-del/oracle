# 🔮 Oracle: The Autonomous, Gamified Learning Planner

> *"Turn your academic journey from an exhausting chore into an epic RPG adventure."*

**Oracle** is an AI-powered, autonomous EdTech web application designed for **Hackathon Track 2 (Education)**. Unlike traditional study planners that hand you a static, blind timetable on day one, Oracle features a hardcore **autonomous agent** that operates on a closed feedback loop—continuously monitoring performance, detecting knowledge gaps, and dynamically rewriting your study schedule when life happens. 

Wrapped in an immersive **LifeRPG gamification layer**, Oracle keeps students motivated, focused, and free from burnout.

---

## 🌙 Immersive UI & Cozy Login Experience
* **Study Room Aesthetic:** Features a cozy nighttime study table background complete with a warm, glowing desk lamp and a shaking/ringing alarm clock.
* **Interactive Animations:** Fluid book page-turning animations that smoothly transition users into the application.
* **Quest-Themed Modal:** Glassmorphism login and signup interface (`"LIFERPG ACADEMY — YOUR QUEST AWAITS"`).
* **Ambient Vibe:** Designed to replace academic anxiety with a comforting, immersive study atmosphere.

---

## 🤖 The Autonomous Agent Engine (The Core Logic)
Oracle doesn't just store calendar events; it thinks and adapts like a personal AI tutor:
* **Diagnostic Engine:** Automatically evaluates quiz results from a synthetic LMS or question bank to flag sub-topics below mastery thresholds (e.g., scores $<60\%$).<br>
* **Educational RAG Pipeline:** Fetches targeted remedial learning materials (articles, video snippets, and practice sets) tailored precisely to the student's identified weaknesses.<br>
* **Dynamic Scheduler & Replanning Engine:** Continuously tracks calendar constraints. If a student misses a study slot or fails a quiz, Oracle instantly aborts downstream tasks, inserts remedial modules, and shifts deadlines in real-time.<br>
* **Agent Activity Audit Log:** A transparent developer panel displaying the agent's thought process, decisions, and manual override simulation controls for judges.<br>

---

## 🎮 LifeRPG Gamification Layer
To maximize student engagement and make studying addictive, Oracle integrates core gaming mechanics:
* **Campaigns & Quests:** Traditional syllabi and modules are rebranded as epic main campaigns and daily quests.
* **AI Guild Master:** Your autonomous companion drops in-character dialogue and guidance when you stumble or succeed.
* **XP, Skill Trees & Ranks:** Completing study blocks and quizzes awards Experience Points (XP), leveling students up from an *F-Rank Noob* to an *S-Rank Scholar*.
* **The Reward Marketplace:** Students earn **Gold Coins** by completing quests, which they can spend in the in-app marketplace on custom, guilt-free real-world treats (like gaming breaks, snacks, or street food).
* **Potion of Revival (Streak Saver):** Missing a day doesn't instantly destroy your active streak; students can spend Gold Coins on a revival potion to keep their momentum alive.
* **Dynamic Difficulty Adjustment (DDA):** Automatically scales task difficulty up if a student aces a module, or scales it down with easier foundational drills if they struggle.

---

## 📊 App Dashboard & Management Modules
* **Overview Dashboard:** Features mastery progress bars, today's action items, and a live "Agent Status" banner.
* **Syllabus Setup Wizard:** Quick inputs for setting target subjects, deadlines, and daily study hours.
* **Interactive Calendar View:** A color-coded timeline tracking completed, upcoming, missed, and replanned study blocks.
* **Diagnostic Hub & Quiz Engine:** Interactive assessments that feed real-time performance data back into the autonomous agent loop.
* **Resource Hub:** A centralized content feed for curated remedial study materials.

---

## 🛠️ Tech Stack
* **Frontend:** React.js / Next.js, Tailwind CSS, Framer Motion (for page folding and UI animations)
* **Backend:** Python (FastAPI) handling core agent workflows and API integrations
* **Database:** PostgreSQL / MongoDB storing user profiles, mastery metrics, and quest logs
* **AI Core:** LangGraph / custom state machines integrated with advanced LLMs for real-time scheduling and RAG retrieval

---

<h2>📌 Project link: https ://liferpg-subham-539.firebaseapp.com/</h2><br>
<h2>📌 Project Demo link : https://drive.google.com/file/d/11Q9US9X14MZ9b5umeLwjGDzHx9cMAHrk/view?usp=drivesdk</h2><br>

## 🚀 Getting Started

### Prerequisites
* Node.js (v18+)
* Python (v3.10+)

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/your-username/oracle-learning-planner.git](https://github.com/your-username/oracle-learning-planner.git)
   cd oracle-learning-planner
