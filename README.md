# RUET Career Connect 🎓🚀

**RUET Career Connect** is a production-grade, AI-powered academic career ecosystem designed to bridge the gap between students, alumni, and university administration. It features intelligent job matching, resume parsing, and an automated applicant tracking system (ATS).

![React 19](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue)
![Gemini AI](https://img.shields.io/badge/AI-Powered-purple)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-cyan)

## ✨ Key Features

### 🤖 AI-Powered Capabilities (Powered by Google Gemini)
*   **ChatGuru Advisor**: A context-aware academic assistant providing advice and real-time web research for career trends.
*   **Smart Resume Parsing**: Upload a PDF resume, and the AI extracts skills, education, and experience to auto-fill the student profile.
*   **Job Matching Score**: Real-time compatibility scoring between student profiles and job descriptions using AI analysis.

### 👥 User Roles & Workflows
1.  **Students**:
    *   Browse jobs with **Fuzzy Search** (handles typos) and advanced filters (Salary, Experience, Remote/Hybrid).
    *   Apply for jobs and track status.
    *   Access "ChatGuru" for career guidance.
2.  **Alumni**:
    *   Post job circulars (restricted to Verified Alumni).
    *   Manage applicants via a drag-and-drop **ATS (Applicant Tracking System)** board.
3.  **Administration (DSW)**:
    *   Verify Alumni identities to ensure platform safety.
    *   Oversee user statistics.

## 🛠️ Tech Stack

*   **Frontend**: React 19, TypeScript, Vite
*   **Styling**: Tailwind CSS, Lucide React (Icons)
*   **AI Integration**: Google GenAI SDK (`@google/genai`)
*   **State Management**: React Context API
*   **Build Tool**: Vite

## 🚀 Local Setup Guide

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/ruet-career-connect.git
    cd ruet-career-connect
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment**
    *   Create a `.env` file in the root directory.
    *   Add your Google Gemini API key:
    ```env
    API_KEY=your_actual_gemini_api_key_here
    ```

4.  **Run the Development Server**
    ```bash
    npm run dev
    ```
    Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📂 Project Structure

```
/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components (JobCard, Navbar, etc.)
│   ├── context/         # Global State (User, Jobs, Applications)
│   ├── pages/           # Application Routes (Dashboard, Profile, etc.)
│   ├── services/        # Logic Layer (Auth, Gemini AI, MockDB)
│   ├── types/           # TypeScript Interfaces
│   ├── App.tsx          # Main Entry & Routing Logic
│   └── main.tsx         # React DOM Root
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

## 🔐 Mock Credentials (For Testing)

| Role | Email | Password |
|------|-------|----------|
| **Student** | `alice@ruet.ac.bd` | `password123` |
| **Alumni** | `bob@tech.com` | `password123` |
| **Admin** | `dsw@ruet.ac.bd` | `password123` |

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
