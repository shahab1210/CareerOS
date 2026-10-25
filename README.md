# CareerOS

**CareerOS** is an AI-powered career operating system designed specifically for college students. It acts as a personalized career mentor, helping students bridge the gap between academic learning and industry expectations.

## 🌟 Key Features

*   **Profile & Skills Management**: Track your education history and map your skill gaps.
*   **AI-Generated Roadmaps**: Get deterministic, step-by-step career path generation tailored to your unique skill gaps.
*   **Opportunity Matching**: A job and internship board equipped with smart readiness scoring to find the best fit.
*   **Proof of Work**: Seamless GitHub integration to pull verifiable public repositories and showcase your projects.
*   **Community**: Peer matchmaking, LinkedIn-style connections, and an active community feed.
*   **AI Mentorship**: A Retrieval-Augmented Generation (RAG) AI powered by Google Gemini and `pgvector` that lets you chat with your study materials and receive personalized career advice.

## 🏗️ Architecture

CareerOS is built as a full-stack application with a strict separation of concerns, utilizing a Modular Monolith architecture for the backend to keep things clean and scalable without the overhead of microservices.

### Backend (`/server`)
*   **Runtime**: Node.js
*   **Framework**: Express.js
*   **Language**: Strict TypeScript
*   **Database**: PostgreSQL (with `pgvector` for AI embeddings)
*   **ORM**: Prisma (v7)
*   **Validation**: Zod
*   **AI Provider**: Google Gemini
*   **Key Modules**: `auth`, `profiles`, `onboarding`, `skills`, `roadmap`, `opportunities`, `github`, `community`, `ai`.

### Frontend (`/client`)
*   **Framework**: React 19 (Single Page Application)
*   **Build Tool**: Vite
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS v4, Framer Motion, Radix UI Primitives, Lucide React
*   **State Management**: Zustand (Global), React Query (Server State)
*   **Routing**: React Router v7 (with React.lazy Code Splitting)
*   **Forms**: React Hook Form + Zod Resolvers

## 🚀 Getting Started

To get started with local development, follow these steps:

### Prerequisites
*   Node.js 20+
*   PostgreSQL database **with the `pgvector` extension installed**.
    *(If using Docker: `docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=postgres pgvector/pgvector:pg16`)*

### 1. Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Create a `.env` file based on `.env.example` (or set up the required variables like `DATABASE_URL` and `GEMINI_API_KEY`).
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run Prisma migrations:
   ```bash
   npx prisma migrate dev
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```
   *The API will run on `http://localhost:3000`.*

### 2. Frontend Setup

1. Open a new terminal and navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend will run on `http://localhost:5173`.*

## 🐳 Docker Deployment

The project includes a multi-stage `Dockerfile` and a `docker-compose.yml` in the `server` directory that orchestrates the Node API alongside a fresh `pgvector` database for easy deployment.

1. Set your environment variables (e.g., `GEMINI_API_KEY`).
2. Run Docker Compose from the `server` directory:
   ```bash
   docker compose up --build -d
   ```
3. Run the initial database migration inside the container:
   ```bash
   docker exec -it careeros_api npx prisma migrate deploy
   ```

## 🧪 Testing

Both the frontend and backend are configured with **Vitest** for testing.

- **Test the server**: `cd server && npm test`
- **Test the client**: `cd client && npm test`
