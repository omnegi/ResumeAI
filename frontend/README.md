# ResumeAI — Frontend

React + TypeScript frontend for the AI Resume Analyzer, built to match the
provided product mockups (split-screen auth, stats dashboard, drag-and-drop
upload, and the analysis results layout).

## Tech stack

- **React 18 + TypeScript**
- **Vite** — dev server & build
- **Tailwind CSS** — styling (custom design tokens: indigo/blue brand gradient, Plus Jakarta Sans display font, Inter body font)
- **React Router v6** — routing
- **Axios** — API client, with a JWT interceptor
- **lucide-react** — icons

## Setup

```bash
cd resume-frontend
npm install
cp .env.example .env
# edit .env if your backend isn't on localhost:8000
npm run dev
```

App runs at **http://localhost:5173** — point it at the FastAPI backend
(default `http://localhost:8000`, override with `VITE_API_URL`).

> Note: this project was scaffolded in a sandboxed environment without
> registry access, so `npm install` hasn't been run here — run it locally
> and it will pull cleanly from npm.

## Pages / routes

| Route | Description |
|---|---|
| `/login` | Split-screen sign-in (gradient brand panel + form) |
| `/register` | Split-screen sign-up |
| `/dashboard` | Welcome banner, stat cards, recent activity table, quick-action cards |
| `/upload` | Drag-and-drop resume upload + job description → runs the analyzer |
| `/results/:id` | Match score gauge, strengths/gaps, AI suggestions, action buttons |
| `/builder` | Structured form (education/experience arrays) → AI-generated resume + PDF download |
| `/cover-letter` | Pick a saved resume + job description → generated cover letter + PDF download |

## Structure

```
src/
  api/            # axios calls per feature (auth, resume, builder, coverLetter, dashboard)
  context/        # AuthContext (JWT stored in localStorage, current user)
  components/
    layout/        # AuthLayout (split screen), AppShell (navbar)
    ui/             # Button, Input/Textarea, Card, Badge, StatCard, MatchScoreGauge
    ProtectedRoute.tsx
  pages/          # one file per route, listed above
  types/          # shared TS interfaces matching backend Pydantic schemas
```

## Design notes

- Brand gradient (indigo → blue) used for the auth panel and dashboard hero banner.
- The circular **match score gauge** animates in on the results page — built as
  a plain SVG component (`MatchScoreGauge.tsx`), no chart library needed.
- Score color coding: ≥75% green, 50–74% amber, <50% rose — consistent across
  the dashboard table and results page.
- All interactive elements have visible focus rings and respect
  `prefers-reduced-motion`.

## Connecting to the backend

Make sure the FastAPI backend (from `resume-backend/`) is running first —
CORS is already configured there for `localhost:5173`. Register a user, then
every other route "just works" since the JWT is attached automatically by
the axios interceptor in `src/api/client.ts`.
