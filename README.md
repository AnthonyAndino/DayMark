# DayMark

> A personal habit tracker and daily journal — mark your day, build your streak.

Track your daily habits, write personal notes, and visualize your progress over time. Built with Next.js 16, React 19, Prisma 7, and PostgreSQL.

## Features

- **Habit tracking** — Create habits and log them daily with a single click
- **Streak calculation** — Automatic streak tracking to keep you motivated
- **Daily notes** — Write a personal note for each day
- **Dashboard calendar** — Monthly view with habit completion status
- **Overview & charts** — Activity graph, completion rates, and trends (via Recharts)
- **Custom themes** — 4 presets (Minimal, Gris Industrial, Negro Puro, Dracula) + custom hex colors with auto-contrast
- **i18n** — English and Spanish (ES/EN) with context-based switching
- **Authentication** — JWT-based auth with httpOnly cookies (bcrypt + jsonwebtoken)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS v4 |
| Database | PostgreSQL via Prisma 7 |
| Auth | JWT (httpOnly cookie), bcryptjs |
| Charts | Recharts |
| Validation | Zod |
| Language | TypeScript 5 |

## Getting Started

### Prerequisites

- Node.js >= 20
- PostgreSQL running locally on port 5432 (or configure via `DATABASE_URL`)

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env   # or edit .env directly

# 3. Generate Prisma client
npx prisma generate

# 4. Run migrations
npx prisma migrate dev

# 5. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:postgres@localhost:5432/daymark` |
| `JWT_SECRET` | Secret key for JWT signing | *(change before production)* |

## Project Structure

```
src/
├── app/
│   ├── api/auth/       # Auth API routes (login, register, logout)
│   ├── dashboard/      # Protected dashboard (habits, notes, overview)
│   │   ├── habits/
│   │   ├── notes/
│   │   └── overview/
│   ├── login/
│   ├── register/
│   └── layout.tsx
├── components/         # React components
├── lib/
│   ├── actions/        # Server actions (habits, notes, auth)
│   ├── auth.ts         # Auth utilities (JWT, cookies)
│   ├── prisma.ts       # Prisma client singleton
│   ├── lang.tsx        # i18n (ES/EN)
│   └── theme-context.tsx  # Theme system
├── middleware.ts       # Route protection
└── globals.css
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npx prisma studio` | Open Prisma Studio (DB GUI) |
| `npx prisma migrate dev` | Run pending migrations |

## Project Status

DayMark is under active development. See the [milestones](https://github.com/AnthonyAndino/DayMark/milestones) and [issues](https://github.com/AnthonyAndino/DayMark/issues) on GitHub for the full roadmap.

## License

MIT
