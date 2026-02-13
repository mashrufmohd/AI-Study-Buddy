# AI Study Buddy

An intelligent, AI-powered study companion that helps students learn smarter with personalized explanations, summaries, quizzes, and flashcards.

## 🎯 Project Overview

**AI Study Buddy** is a comprehensive learning platform built with modern web technologies and artificial intelligence. It provides students with:

- 📚 **AI-Powered Explanations** - Get detailed explanations at Easy, Medium, and Hard difficulty levels
- 📝 **Smart Summarization** - Summarize notes, text, and PDF documents instantly
- ❓ **Quiz Generation** - Generate custom quizzes to test your knowledge
- 🎴 **Interactive Flashcards** - Create and study with AI-generated flashcards
- 👤 **User Authentication** - Sign up, login, and manage your profile
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices

## 🚀 Quick Start

### Prerequisites

- **Node.js** v16+ (with npm)
- **Python** 3.8+ (with pip)
- Git

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/ai-study-buddy.git
cd ai-study-buddy
```

#### 2. Setup Frontend
```bash
cd study-buddy-ai-main

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Add your credentials to .env.local
# (Firebase config, Gemini API key, etc.)

# Start development server
npm run dev
```

#### 3. Setup Backend
```bash
cd ../backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env

# Add your Gemini API key to .env

# Start the server
python main.py
```

#### 4. Access the Application

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:8000

## 📋 Environment Variables

### Frontend (`.env.local`)
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_API_BASE_URL=http://localhost:8000
```

### Backend (`.env`)
```env
GOOGLE_API_KEY=your_gemini_api_key
FIREBASE_PROJECT_ID=your_project_id
API_PORT=8000
API_HOST=localhost
ENVIRONMENT=development
```

## 🛠 Technologies Used

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library
- **React Router v6** - Navigation
- **Firebase** - Authentication

### Backend
- **FastAPI** - Web framework
- **Python 3.8+** - Programming language
- **Google Generative AI** - Gemini API for AI content
- **Pydantic** - Data validation
- **CORS** - Cross-origin support

## ✨ Features in Detail

### 📚 Explain a Concept
- Select difficulty level (Easy, Medium, Hard)
- Get AI-generated explanations up to 5000+ words
- Pagination support for long content
- Different content depth based on difficulty

### 📄 Summarize Notes
- Summarize text content
- Extract and summarize PDF documents
- Configurable summary length
- Clean, readable output

### ❓ Quiz Generator
- Generate multiple-choice questions
- Customizable number of questions
- Interactive quiz interface
- Reveal answers and check results
- Score calculation

### 🎴 Flashcards
- Create flashcards on any topic
- Flip cards to reveal answers
- Shuffle for randomized study
- Track progress through deck

### 👤 User Management
- Sign up with email and password
- Login to your account
- Profile page with user details
- Logout functionality

## 📁 Project Structure

```
ai-study-buddy/
├── study-buddy-ai-main/          # Frontend (React + Vite)
│   ├── src/
│   │   ├── pages/               # Page components
│   │   │   ├── Index.tsx        # Home page
│   │   │   ├── Landing.tsx      # Landing page
│   │   │   ├── Login.tsx        # Login page
│   │   │   ├── Signup.tsx       # Signup page
│   │   │   ├── Profile.tsx      # User profile
│   │   │   ├── Explain.tsx      # Explain feature
│   │   │   ├── Summarize.tsx    # Summarize feature
│   │   │   ├── Quiz.tsx         # Quiz feature
│   │   │   └── Flashcards.tsx   # Flashcards feature
│   │   ├── components/          # Reusable components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Layout.tsx
│   │   │   └── ...
│   │   ├── lib/                 # Utilities
│   │   │   ├── firebase.ts      # Firebase config
│   │   │   ├── api.ts           # API calls
│   │   │   └── mockAuth.ts      # Mock authentication
│   │   └── App.tsx
│   ├── .env.example             # Environment template
│   └── package.json
│
├── backend/                     # Backend (FastAPI + Python)
│   ├── app/
│   │   ├── ai_service.py       # AI generation logic
│   │   ├── models.py           # Data models
│   │   └── utils.py            # Utility functions
│   ├── main.py                 # FastAPI app
│   ├── requirements.txt        # Python dependencies
│   ├── .env                    # Environment variables
│   └── .env.example            # Environment template
│
├── README.md                   # This file
├── LICENSE                     # MIT License
└── .gitignore                  # Git ignore rules
```

## 🔐 Security

- All credentials stored in `.env` files (not committed to git)
- Environment variables used for all sensitive data
- Mock authentication for development
- Firebase integration ready for production authentication

## 🚀 Deployment

The application can be deployed to:
- **Frontend**: Vercel, Netlify, GitHub Pages, or any static host
- **Backend**: Heroku, Railway, AWS, or any Python-capable host

## 📝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋 Support

If you have any questions or need help, please open an issue on GitHub.

## 👨‍💻 Author

**Developer:** Mohd Mashruf  
**Email:** aalammashruf724@gmail.com  

Created for Educational Purposes

---

**Made with ❤️ for students everywhere**
