# ThinkBoard

A full-stack notes board built with the MERN stack. You can create, read, edit and delete notes on a shared board, with no login needed. It has a REST API with validation and rate limiting, and a responsive React interface.

**Live demo:** https://mern-think-board-tawny.vercel.app

> The API runs on a free hosting plan, so the first load may take up to a minute while the server wakes up. The app shows a loading screen in Arabic and English while it waits.

## Screenshots

<p>
  <img src="https://res.cloudinary.com/a57m0ysa/image/upload/v1791327880/Screenshot_2026-10-07_015900_fgox0m.png" width="49%" alt="Screenshot 1" />
  <img src="https://res.cloudinary.com/a57m0ysa/image/upload/v1791327878/Screenshot_2026-10-07_015953_ybwuqr.png" width="49%" alt="Screenshot 2" />
</p>
<p>
  <img src="https://res.cloudinary.com/a57m0ysa/image/upload/v1791327879/Screenshot_2026-10-07_015938_alskty.png" width="49%" alt="Screenshot 3" />
  <img src="https://res.cloudinary.com/a57m0ysa/image/upload/v1791327879/Screenshot_2026-10-07_015917_jnxyug.png" width="49%" alt="Screenshot 4" />
</p>

## Features

- Full CRUD for notes, with the newest notes shown first
- A dedicated page for each note, with inline editing
- Validation on both sides: required fields, with limits of 100 characters for the title and 5,000 for the content
- Rate limiting on the API (100 requests per 15 minutes for each visitor), with a clear "rate limit reached" screen in the app
- Loading states, error messages and a retry button when the server is unreachable
- A wake-up screen in Arabic and English while the free-tier server starts
- Centralized error handling on the API, with clear responses for invalid IDs and unknown routes
- Delete confirmation, and a responsive grid that works from phones to desktops

## Tech Stack

| Layer | Technologies |
| --- | --- |
| Frontend | React, Vite, React Router, Tailwind CSS, daisyUI, Lucide icons |
| Backend | Node.js, Express, Mongoose, express-rate-limit, CORS |
| Database | MongoDB Atlas |
| Deployment | Vercel (frontend), Render (API) |

## Project Structure

```
MERN-ThinkBoard
├── backend
│   ├── src
│   │   ├── config        # MongoDB connection
│   │   ├── controllers   # note logic
│   │   ├── middlewares   # rate limiter
│   │   ├── models        # Note schema
│   │   └── routes        # note routes
│   └── server.js         # Express app entry point
└── frontend
    └── src
        ├── components    # NoteCard, Navbar, RateLimitedUI, ServerGate, ...
        ├── lib           # API helper
        └── pages         # Home, Create, NoteDetails
```

## API Endpoints

| Method | Route | Description |
| --- | --- | --- |
| GET | `/health` | Health check, used by the wake-up screen |
| GET | `/api/v1/note` | List all notes, newest first |
| GET | `/api/v1/note/:noteId` | Get one note |
| POST | `/api/v1/note` | Create a note (`title`, `content`) |
| PATCH | `/api/v1/note/:noteId` | Update a note |
| DELETE | `/api/v1/note/:noteId` | Delete a note |

Responses use the shape `{ success, data }`, and errors return `{ success: false, message }`. The `/health` route sits before the rate limiter, so it never counts toward the limit.

## Getting Started

### Prerequisites

- Node.js 18 or newer
- A MongoDB database (a free MongoDB Atlas cluster works)

### 1. Clone the repo

```bash
git clone https://github.com/saif11001/MERN-ThinkBoard.git
cd MERN-ThinkBoard
```

### 2. Run the API

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
MONGO_URI=your_mongodb_connection_string
CLIENT_URL=http://localhost:5173
PORT=5000
```

`CLIENT_URL` can hold several origins separated by commas. `http://localhost:5173` is always allowed.

```bash
npm run dev
```

### 3. Run the client

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The client runs on http://localhost:5173 and talks to `http://localhost:5000/api/v1` by default. To use another API, create `frontend/.env`:

```env
VITE_API_URL=https://your-api.example.com/api/v1
```

## Deployment

- **Frontend (Vercel):** set `VITE_API_URL` to the API address ending in `/api/v1`. `vercel.json` rewrites every route to `index.html` so refreshing a note page works.
- **API (Render):** set `MONGO_URI` and `CLIENT_URL` (the Vercel domain). Express runs with `trust proxy` set to 1, so the rate limiter counts each visitor separately instead of treating everyone as the proxy.
