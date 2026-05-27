# Learn Tracker

## Project Structure
- `frontend/`: Next.js 15 application with Tailwind CSS and Framer Motion.
- `backend/`: FastAPI application with Prisma ORM.

## Setup Instructions

### Prerequisites
- Node.js & npm
- Python 3.8+
- PostgreSQL database

### 1. Backend Setup
Navigate to the backend directory:
```bash
cd backend
```

Create and activate a virtual environment:
```bash
python -m venv venv
venv\Scripts\activate
```

Install dependencies:
```bash
pip install -r requirements.txt
```

Generate Prisma client:
```bash
prisma generate
```

Run the server:
```bash
fastapi dev app/main.py
```

### 2. Frontend Setup
Navigate to the frontend directory:
```bash
cd frontend
```

Install dependencies:
> **Important**: The initial installation failed due to insufficient disk space on your C: drive. Please free up space and run:
```bash
npm install
npm install framer-motion lucide-react
```

Run the development server:
```bash
npm run dev
```

## Features Implemented
- **Bento Grid Dashboard**: Responsive layout with widgets.
- **Widgets**: Streak, Roadmap, Recent Logs, Quick Notes.
- **Backend API**: Skeleton for Users, Roadmaps, Resources, Notes.
- **Database Schema**: Prisma schema defined in `backend/prisma/schema.prisma`.
