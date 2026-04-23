# ASTRO SYNC

ASTRO SYNC is a minimal full-stack study planner built with Next.js, Tailwind CSS, Prisma, and PostgreSQL. It includes a stopwatch-based study flow, persistent study sessions, and a daily dashboard designed for quick focus tracking.

## Stack

- Next.js App Router
- Tailwind CSS
- Prisma ORM
- PostgreSQL
- TypeScript

## Features

- Stopwatch with start, pause, resume, and reset
- Subject and sub-subject selection with suggestions learned from saved sessions
- Session persistence via Next.js API routes
- Daily dashboard grouped by date with total study time
- Live total focus time while a session is running
- Subject and sub-subject total breakdowns
- Weekly and monthly focus analysis
- Loading states, error handling, and responsive dark UI
- Modular structure prepared for future social features

## Project Structure

```text
app/
  api/
  globals.css
  layout.tsx
  page.tsx
components/
  dashboard/
  stopwatch/
  ui/
features/
  sessions/
lib/
prisma/
```

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the environment file:

   ```bash
   cp .env.example .env
   ```

   On Windows PowerShell:

   ```powershell
   Copy-Item .env.example .env
   ```

3. Set your PostgreSQL connection string in `.env`.

4. Generate the Prisma client:

   ```bash
   npm run prisma:generate
   ```

5. Create and apply your database migration:

   ```bash
   npm run prisma:migrate -- --name init
   ```

6. Start the development server:

   ```bash
   npm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000).

## Daily Local Use

For regular personal use, run ASTRO SYNC in production mode instead of development mode.

1. Build the app once after setup or after code changes:

   ```bash
   npm run build
   ```

2. Start the local production server:

   ```bash
   npm start
   ```

3. Open [http://localhost:3000](http://localhost:3000).

Keep PostgreSQL running in the background. Saved study sessions are stored permanently in PostgreSQL, so data remains available after closing the browser, stopping the app, or restarting the PC.

### Windows Startup Shortcut

To launch ASTRO SYNC automatically when Windows starts, create a file named `start-astro-sync.bat`:

```bat
@echo off
cd /d "C:\path\to\ASTROSYNC"
call npm start
```

Replace `C:\path\to\ASTROSYNC` with the real project folder path. Build the app at least once before using the startup file:

```powershell
npm run build
```

Then place `start-astro-sync.bat` in the Windows Startup folder:

```text
shell:startup
```

The app will be available at [http://localhost:3000](http://localhost:3000) after signing in to Windows. If port `3000` is already in use, stop the existing ASTRO SYNC terminal before starting another one.

## API

- `POST /api/sessions` creates a new study session
- `GET /api/sessions` returns sessions grouped by date
- `DELETE /api/sessions?id=<sessionId>` deletes a session

## Future Extensions

The codebase already separates domain logic from presentation so features like friends, live activity sharing, and groups can be added without reshaping the MVP foundations.
