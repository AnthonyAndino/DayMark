# DayMark

> A personal habit tracker and daily journal — mark your day, build your streak.

![Next.js 16](https://img.shields.io/badge/Next.js_16-000000?logo=nextdotjs&logoColor=white)
![React 19](https://img.shields.io/badge/React_19-20232A?logo=react&logoColor=61DAFB)
![TypeScript 5](https://img.shields.io/badge/TypeScript_5-3178C6?logo=typescript&logoColor=white)
![Tailwind v4](https://img.shields.io/badge/Tailwind_v4-06B6D4?logo=tailwindcss&logoColor=white)
![Prisma 7](https://img.shields.io/badge/Prisma_7-2D3748?logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?logo=jsonwebtokens&logoColor=white)
![bcrypt](https://img.shields.io/badge/bcrypt-003A70?logo=&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-22B5BF?logo=recharts&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3E67B1?logo=zod&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green)

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
