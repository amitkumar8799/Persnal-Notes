# My Simple Notes - Full-Stack Application

A beautiful, simple, and responsive full-stack notes application built with the MERN stack (MongoDB, Express, React, Node.js). 
This project serves as a take-home assignment solution, featuring a sleek modern UI, full authentication, and CRUD operations for notes.

## 🚀 Built With

- **Frontend:** React, Vite, CSS (Vanilla Custom Design), React Router, Context API, Axios
- **Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT Auth, bcryptjs
- **Deployment:** Netlify (target for frontend), Railway (target for backend)

---

## 💻 Local Setup Steps

### 1. Prerequisites
- Node.js installed (v16+)
- MongoDB locally installed, or a free MongoDB Atlas URI

### 2. Backend Setup
Navigate into the `backend` folder and install dependencies:
```bash
cd backend
npm install
```

Start the backend development server:
```bash
npm run dev
```
*The server will run on port 5000 by default.*

### 3. Frontend Setup
Open a new terminal, navigate into the `frontend` folder, and install dependencies:
```bash
cd frontend
npm install
```

Start the frontend Vite development server:
```bash
npm run dev
```
*The application should now be accessible at `http://localhost:5173`.*

---

## 🔐 Required Environment Variables

You need to set up environment variables for both the backend and frontend.

### Backend (`/backend/.env`)
Create a `.env` file in the `backend/` directory with the following variables:
```
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.db.mongodb.net/notesapp
JWT_SECRET=your_super_secret_jwt_key
```

### Frontend (`/frontend/.env` -> optional for local, required for production)
When deploying the frontend, or to point it to a remote API locally, create `.env` in the `frontend/` directory (or set it in Netlify settings):
```
VITE_API_URL=https://your-backend-railway-url.up.railway.app/api
```

---

## 🐳 How to Run with Docker

This project includes Dockerfiles for both services and a `docker-compose.yml` for easy multi-container orchestration out-of-the-box.

Make sure you have [Docker](https://www.docker.com/) and Docker Compose installed.

1. Ensure your ports `5000` (Backend), `5173` (Frontend), and `27017` (Mongo) are available.
2. From the root directory of the project, run:
```bash
docker-compose up --build
```

Docker will:
- Spin up a persistent `mongo:latest` database instance locally.
- Build and run the `backend` on `http://localhost:5000`.
- Build and run the `frontend` on `http://localhost:5173`.

To stop the containers, run:
```bash
docker-compose down
```

---

## ☁️ Deployment Instructions

### Deploying the Backend to Railway
1. Push your code to a public/private GitHub repository.
2. Go to [Railway](https://railway.app/), start a new project, and deploy from your GitHub repo as a sub-directory (`/backend`).
3. Under your project variables in Railway, add `MONGO_URI` and `JWT_SECRET`. Since Railway runs its own port checking, it usually sets `PORT` automatically.
4. Copy the public domain URL once the app goes live.

### Deploying the Frontend to Netlify
1. Go to [Netlify](https://www.netlify.com/), start a new site, and import from GitHub.
2. Set the *Base directory* to `frontend`.
3. Build command: `npm run build`
4. Publish directory: `frontend/dist`
5. In Netlify's Environment Variables setting, add:
   `VITE_API_URL = <your-backend-railwayurl>/api`
6. Deploy the site.

---

> NOTE: Make sure there are no `.env` files checked into your Git history! The provided `.gitignore` files automatically ignore these and `node_modules`.
