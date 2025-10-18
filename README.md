# InteliiGPT 🤖

<div align="center">

![JavaScript](https://img.shields.io/badge/JavaScript-82.5%25-yellow?style=flat-square)
![CSS](https://img.shields.io/badge/CSS-15.3%25-blue?style=flat-square)
![HTML](https://img.shields.io/badge/HTML-2.2%25-orange?style=flat-square)

A modern, full-stack AI chatbot application powered by Google's Gemini API. Built with React + Vite frontend and Express.js backend with MongoDB for persistent chat history.

[Features](#features) • [Architecture](#architecture) • [Installation](#installation) • [Usage](#usage) • [API Documentation](#api-documentation)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [System Architecture](#system-architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

**InteliiGPT** is an intelligent chatbot application that leverages Google's Gemini AI to provide conversational AI capabilities. The application features a clean, modern interface with support for multiple chat threads, persistent message history, and real-time AI responses.

### Key Highlights

- 🧠 **Powered by Gemini AI** - Uses Google's latest `gemini-2.5-flash` model for fast, intelligent responses
- 💬 **Multi-Thread Support** - Create and manage multiple conversation threads
- 💾 **Persistent Storage** - MongoDB integration for chat history persistence
- ⚡ **Real-time Updates** - Instant message delivery and thread management
- 🎨 **Modern UI** - Clean, responsive interface with syntax highlighting
- 🔄 **Context-Aware** - Maintains conversation context across messages

---

## ✨ Features

### Core Features

- ✅ **AI-Powered Conversations** - Natural language processing with Gemini API
- ✅ **Thread Management** - Create, view, switch, and delete conversation threads
- ✅ **Message History** - Persistent storage of all conversations in MongoDB
- ✅ **Markdown Support** - Rich text rendering with syntax highlighting for code blocks
- ✅ **Loading States** - Visual feedback during AI response generation
- ✅ **Error Handling** - Robust error handling and user feedback
- ✅ **Responsive Design** - Mobile-friendly interface
- ✅ **Profile Integration** - User profile management

### Technical Features

- 🔐 **Environment-based Configuration** - Secure API key management
- 🚀 **Fast Development** - Vite for lightning-fast HMR
- 📦 **Modular Architecture** - Clean separation of concerns
- 🔄 **RESTful API** - Well-structured backend endpoints
- 🎯 **Context API** - Efficient state management with React Context
- 🧪 **UUID-based Threading** - Unique thread identification

---

## 🏗️ System Architecture

### High-Level Architecture

<lov-mermaid>
graph TB
    subgraph "Client Layer"
        A[React Frontend<br/>Vite + React 19]
        B[Sidebar Component]
        C[ChatWindow Component]
        D[Chat Component]
        E[MyContext Provider]
    end

    subgraph "Network Layer"
        F[HTTP/REST API<br/>Port 8080]
        G[CORS Middleware]
    end

    subgraph "Server Layer"
        H[Express.js Server]
        I[Chat Routes]
        J[Gemini Utility]
    end

    subgraph "Data Layer"
        K[(MongoDB)<br/>Thread Collection]
        L[Thread Model<br/>Mongoose Schema]
    end

    subgraph "External Services"
        M[Google Gemini API<br/>gemini-2.5-flash]
    end

    A --> B
    A --> C
    C --> D
    E --> B
    E --> C
    
    B --> F
    C --> F
    F --> G
    G --> H
    H --> I
    I --> J
    J --> M
    I --> L
    L --> K

    style A fill:#61dafb,stroke:#333,stroke-width:2px
    style H fill:#68a063,stroke:#333,stroke-width:2px
    style K fill:#4db33d,stroke:#333,stroke-width:2px
    style M fill:#4285f4,stroke:#333,stroke-width:2px
</lov-mermaid>

### Component Architecture

<lov-mermaid>
graph LR
    subgraph "Frontend Components"
        A[App.jsx] --> B[MyContext Provider]
        B --> C[Sidebar.jsx]
        B --> D[ChatWindow.jsx]
        D --> E[Chat.jsx]
        
        C --> F[Thread List]
        C --> G[New Chat Button]
        C --> H[Delete Thread]
        
        D --> I[Message Input]
        D --> J[Chat Display]
        D --> K[Profile Menu]
    end

    style A fill:#ffd700,stroke:#333,stroke-width:2px
    style B fill:#ff6b6b,stroke:#333,stroke-width:2px
    style C fill:#4ecdc4,stroke:#333,stroke-width:2px
    style D fill:#95e1d3,stroke:#333,stroke-width:2px
</lov-mermaid>

### Data Flow Diagram

<lov-mermaid>
sequenceDiagram
    participant U as User
    participant CW as ChatWindow
    participant API as Express API
    participant G as Gemini API
    participant DB as MongoDB

    U->>CW: Types message
    CW->>API: POST /api/chat<br/>{threadId, message}
    
    API->>DB: Find or Create Thread
    DB-->>API: Thread document
    
    API->>API: Add user message to thread
    API->>G: POST generateContent<br/>{message}
    
    G-->>API: AI response
    
    API->>API: Add assistant message to thread
    API->>DB: Save updated thread
    DB-->>API: Confirmation
    
    API-->>CW: {reply: "AI response"}
    CW-->>U: Display AI message
</lov-mermaid>

### Request/Response Flow

<lov-mermaid>
graph TD
    A[User Input] --> B{New Chat?}
    B -->|Yes| C[Generate UUID]
    B -->|No| D[Use Existing ThreadID]
    
    C --> E[POST /api/chat]
    D --> E
    
    E --> F{Thread Exists?}
    F -->|No| G[Create New Thread]
    F -->|Yes| H[Load Thread]
    
    G --> I[Add User Message]
    H --> I
    
    I --> J[Call Gemini API]
    J --> K{Success?}
    
    K -->|Yes| L[Add Assistant Reply]
    K -->|No| M[Return Error]
    
    L --> N[Save to MongoDB]
    N --> O[Return Response]
    M --> O
    
    O --> P[Update UI]

    style A fill:#e1f5ff,stroke:#333,stroke-width:2px
    style J fill:#fff3cd,stroke:#333,stroke-width:2px
    style N fill:#d4edda,stroke:#333,stroke-width:2px
    style M fill:#f8d7da,stroke:#333,stroke-width:2px
</lov-mermaid>

### State Management Flow

<lov-mermaid>
graph TD
    A[MyContext Provider] --> B[Global State]
    
    B --> C[prompt]
    B --> D[reply]
    B --> E[currThreadId]
    B --> F[prevChats]
    B --> G[newChat]
    B --> H[allThreads]
    
    C --> I[ChatWindow]
    D --> I
    E --> I
    E --> J[Sidebar]
    F --> I
    G --> I
    H --> J
    
    I --> K[User Interaction]
    J --> K
    
    K --> L[setState Actions]
    L --> B

    style A fill:#9b59b6,stroke:#333,stroke-width:2px,color:#fff
    style B fill:#3498db,stroke:#333,stroke-width:2px,color:#fff
    style I fill:#e74c3c,stroke:#333,stroke-width:2px,color:#fff
    style J fill:#e67e22,stroke:#333,stroke-width:2px,color:#fff
</lov-mermaid>

---

## 🛠️ Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.1.0 | UI framework |
| Vite | 7.0.4 | Build tool & dev server |
| React Router | - | Client-side routing |
| React Markdown | 10.1.0 | Markdown rendering |
| Rehype Highlight | 7.0.2 | Code syntax highlighting |
| React Spinners | 0.17.0 | Loading indicators |
| UUID | 13.0.0 | Thread ID generation |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Express.js | 5.1.0 | Web framework |
| Mongoose | 8.17.0 | MongoDB ODM |
| dotenv | 17.2.1 | Environment config |
| CORS | 2.8.5 | Cross-origin support |
| @google/genai | 1.23.0 | Gemini AI SDK |
| Node Fetch | 3.3.2 | HTTP client |

### Database

| Technology | Purpose |
|------------|---------|
| MongoDB | Document-based storage for chat threads and messages |

### External APIs

| Service | Purpose |
|---------|---------|
| Google Gemini API | AI-powered conversation generation |

---

## 📁 Project Structure

```
InteliiGPT/
│
├── Backend/
│   ├── models/
│   │   └── Thread.js                 # MongoDB schema for threads
│   ├── routes/
│   │   └── chat.js                   # API routes for chat operations
│   ├── utils/
│   │   └── gemini.js                 # Gemini API integration
│   ├── node_modules/
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   └── server.js                     # Express server entry point
│
├── Frontend/
│   ├── public/
│   │   └── ...                       # Static assets
│   ├── src/
│   │   ├── assets/                   # Images and static files
│   │   ├── App.jsx                   # Main application component
│   │   ├── App.css                   # App styles
│   │   ├── Chat.jsx                  # Individual chat message component
│   │   ├── Chat.css                  # Chat message styles
│   │   ├── ChatWindow.jsx            # Main chat interface
│   │   ├── ChatWindow.css            # Chat window styles
│   │   ├── Sidebar.jsx               # Thread management sidebar
│   │   ├── Sidebar.css               # Sidebar styles
│   │   ├── MyContext.jsx             # React Context provider
│   │   ├── index.css                 # Global styles
│   │   └── main.jsx                  # React entry point
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── README.md
│   └── vite.config.js
│
└── README.md                          # This file
```

---

## 🚀 Installation

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local or MongoDB Atlas)
- **Google Gemini API Key** ([Get one here](https://makersuite.google.com/app/apikey))

### Step 1: Clone the Repository

```bash
git clone https://github.com/ashwin1489/InteliiGPT.git
cd InteliiGPT
```

### Step 2: Backend Setup

```bash
# Navigate to Backend directory
cd Backend

# Install dependencies
npm install

# Create .env file
touch .env
```

Add the following to your `.env` file:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/intelliigpt
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/intelliigpt

# Google Gemini API Configuration
GOOGLE_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
GOOGLE_API_VERSION=v1beta

# Server Configuration
PORT=8080
```

### Step 3: Frontend Setup

```bash
# Navigate to Frontend directory (from project root)
cd Frontend

# Install dependencies
npm install
```

### Step 4: Start MongoDB

```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas connection string in .env
```

---

## ⚙️ Configuration

### Backend Configuration

The backend uses environment variables for configuration. Here's what each variable does:

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `MONGODB_URI` | MongoDB connection string | - | ✅ |
| `GOOGLE_API_KEY` | Gemini API key | - | ✅ |
| `GEMINI_MODEL` | Gemini model to use | `gemini-2.5-flash` | ❌ |
| `GOOGLE_API_VERSION` | API version | `v1beta` | ❌ |
| `PORT` | Server port | `8080` | ❌ |

### Frontend Configuration

The frontend connects to the backend on `http://localhost:8080`. If you change the backend port, update the API URLs in:

- `Frontend/src/ChatWindow.jsx` (line 30)
- `Frontend/src/Sidebar.jsx` (lines 12, 38, 51)

---

## 🎮 Usage

### Starting the Application

#### Terminal 1 - Backend Server

```bash
cd Backend
npm start
```

You should see:
```
Server is running on 8080
Connected with database
```

#### Terminal 2 - Frontend Development Server

```bash
cd Frontend
npm run dev
```

You should see:
```
VITE v7.0.4  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### Using the Application

1. **Open your browser** and navigate to `http://localhost:5173`

2. **Start a new chat**:
   - Click the "➕ New Chat" button in the sidebar
   - Type your message in the input field
   - Press Enter or click Send

3. **Manage threads**:
   - View all your chat threads in the sidebar
   - Click on any thread to switch to it
   - Delete threads using the delete button

4. **Profile menu**:
   - Click your profile icon to access user options
   - View your profile information

---

## 📡 API Documentation

### Base URL

```
http://localhost:8080/api
```

### Endpoints

#### 1. Create/Send Chat Message

**POST** `/chat`

Send a message to the AI and get a response. Creates a new thread if it doesn't exist.

**Request Body:**
```json
{
  "threadId": "550e8400-e29b-41d4-a716-446655440000",
  "message": "What is machine learning?"
}
```

**Response:**
```json
{
  "reply": "Machine learning is a subset of artificial intelligence..."
}
```

**Status Codes:**
- `200 OK` - Successful response
- `400 Bad Request` - Missing or invalid fields
- `500 Internal Server Error` - Server or API error

---

#### 2. Get All Threads

**GET** `/thread`

Retrieve all chat threads, sorted by most recently updated.

**Response:**
```json
[
  {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "threadId": "550e8400-e29b-41d4-a716-446655440000",
    "title": "What is machine learning?",
    "messages": [...],
    "createdAt": "2025-10-09T10:30:00.000Z",
    "updatedAt": "2025-10-09T11:45:00.000Z"
  }
]
```

**Status Codes:**
- `200 OK` - Success
- `500 Internal Server Error` - Database error

---

#### 3. Get Thread Messages

**GET** `/thread/:threadId`

Retrieve all messages for a specific thread.

**Parameters:**
- `threadId` (path) - The UUID of the thread

**Response:**
```json
[
  {
    "role": "user",
    "content": "What is machine learning?",
    "timestamp": "2025-10-09T10:30:00.000Z",
    "_id": "64a1b2c3d4e5f6g7h8i9j0k2"
  },
  {
    "role": "assistant",
    "content": "Machine learning is...",
    "timestamp": "2025-10-09T10:30:15.000Z",
    "_id": "64a1b2c3d4e5f6g7h8i9j0k3"
  }
]
```

**Status Codes:**
- `200 OK` - Success
- `404 Not Found` - Thread doesn't exist
- `500 Internal Server Error` - Database error

---

#### 4. Delete Thread

**DELETE** `/thread/:threadId`

Delete a specific chat thread and all its messages.

**Parameters:**
- `threadId` (path) - The UUID of the thread

**Response:**
```json
{
  "success": "Thread deleted successfully"
}
```

**Status Codes:**
- `200 OK` - Successfully deleted
- `404 Not Found` - Thread doesn't exist
- `500 Internal Server Error` - Database error

---

#### 5. Test Endpoint

**POST** `/test`

Create a test thread (for development/testing purposes).

**Response:**
```json
{
  "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
  "threadId": "test-1696851234567",
  "title": "Testing New Thread2",
  "messages": [],
  "createdAt": "2025-10-09T10:30:00.000Z",
  "updatedAt": "2025-10-09T10:30:00.000Z"
}
```

---

### Error Response Format

All error responses follow this format:

```json
{
  "error": "Description of what went wrong"
}
```

---

## 🗄️ Database Schema

### Thread Collection

```javascript
{
  _id: ObjectId,                    // MongoDB auto-generated ID
  threadId: String,                 // UUID for thread identification (unique)
  title: String,                    // Thread title (first message, max 100 chars)
  messages: [                       // Array of message objects
    {
      role: String,                 // "user" or "assistant"
      content: String,              // Message text
      timestamp: Date,              // Message creation time
      _id: ObjectId                 // Message ID
    }
  ],
  createdAt: Date,                  // Thread creation timestamp
  updatedAt: Date                   // Last modification timestamp
}
```

### Schema Diagram

<lov-mermaid>
erDiagram
    THREAD ||--o{ MESSAGE : contains
    THREAD {
        ObjectId _id PK
        String threadId UK
        String title
        Date createdAt
        Date updatedAt
    }
    MESSAGE {
        ObjectId _id PK
        String role
        String content
        Date timestamp
        ObjectId threadId FK
    }
</lov-mermaid>

### Indexes

- `threadId`: Unique index for fast thread lookups
- `updatedAt`: Index for sorting threads by recency

---

## 🔧 Development

### Running in Development Mode

**Backend:**
```bash
cd Backend
npm run start
# or for auto-reload (if nodemon configured)
npx nodemon server.js
```

**Frontend:**
```bash
cd Frontend
npm run dev
```

### Building for Production

**Frontend:**
```bash
cd Frontend
npm run build
npm run preview  # Preview production build
```

### Linting

```bash
cd Frontend
npm run lint
```

---

## 🧪 Testing

### API Testing with cURL

**Send a chat message:**
```bash
curl -X POST http://localhost:8080/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "threadId": "test-123",
    "message": "Hello, AI!"
  }'
```

**Get all threads:**
```bash
curl http://localhost:8080/api/thread
```

**Get thread messages:**
```bash
curl http://localhost:8080/api/thread/test-123
```

**Delete thread:**
```bash
curl -X DELETE http://localhost:8080/api/thread/test-123
```

---

## 🔐 Security Considerations

1. **API Keys**: Never commit `.env` files. Always use environment variables.
2. **CORS**: Configure CORS properly for production environments.
3. **Input Validation**: Always validate and sanitize user inputs.
4. **Rate Limiting**: Consider implementing rate limiting for API endpoints.
5. **MongoDB Security**: Use authentication and encryption for production databases.
6. **HTTPS**: Use HTTPS in production for secure communication.

---

## 🚀 Deployment

### Backend Deployment (Example: Heroku)

```bash
cd Backend
heroku create intelliigpt-backend
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set GOOGLE_API_KEY=your_api_key
git push heroku main
```

### Frontend Deployment (Example: Vercel)

```bash
cd Frontend
npm run build
# Deploy dist folder to Vercel, Netlify, or similar
```

**Important:** Update API URLs in frontend code to point to your deployed backend.

---

## 🛣️ Roadmap

- [ ] User authentication and authorization
- [ ] Message search functionality
- [ ] Export chat history
- [ ] File upload support
- [ ] Voice input/output
- [ ] Multi-language support
- [ ] Theme customization
- [ ] Code execution in sandbox
- [ ] Image generation integration
- [ ] Mobile app (React Native)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards

- Follow ESLint configuration
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation for new features

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- **Ashwin** - [@ashwin1489](https://github.com/ashwin1489)

---

## 🙏 Acknowledgments

- [Google Gemini](https://ai.google.dev/) for the powerful AI API
- [React](https://react.dev/) team for the amazing framework
- [Vite](https://vitejs.dev/) for the blazing fast build tool
- [MongoDB](https://www.mongodb.com/) for the flexible database
- [Express.js](https://expressjs.com/) for the robust backend framework

---

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/ashwin1489/InteliiGPT/issues) page
2. Create a new issue with detailed description
3. Contact: [Your Email/Contact]

---

## 📊 Project Stats

![GitHub last commit](https://img.shields.io/github/last-commit/ashwin1489/InteliiGPT?style=flat-square)
![GitHub issues](https://img.shields.io/github/issues/ashwin1489/InteliiGPT?style=flat-square)
![GitHub stars](https://img.shields.io/github/stars/ashwin1489/InteliiGPT?style=flat-square)
![GitHub forks](https://img.shields.io/github/forks/ashwin1489/InteliiGPT?style=flat-square)

---

<div align="center">


⭐ Star this repository if you find it helpful!

</div>
