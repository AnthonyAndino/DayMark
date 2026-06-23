<div align="center">

# DayMark · Habit Tracker & Daily Journal

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

Habit tracker · Daily journal · Streak tracking · Interactive dashboard · Dracula & custom themes

[🇪🇸 Versión en Español](#versión-en-español)

</div>

🔗 **Live demo:** [daymark-ochre.vercel.app](https://daymark-ochre.vercel.app/login)

Track your daily habits, write personal notes, and visualize your progress over time. Built with Next.js 16, React 19, Prisma 7, and PostgreSQL.

### Previews
<div align="center">
  <img src="./assets/login.gif" alt="Login Page Timeline Animation" width="600px" />
  <br />
  <em>Interactive infinite timeline on login</em>
  <br /><br />
  <img src="./assets/register.gif" alt="Register Page Mosaic Cascade" width="600px" />
  <br />
  <em>Interactive calendar cascade on register</em>
  <br /><br />
  <img src="./assets/dashboard.png" alt="Dashboard Overview" width="600px" />
  <br />
  <em>Dashboard overview, habits tracking, and dark theme support</em>
</div>

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
| `JWT_SECRET` | Secret key for JWT signing | Generate with: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |

Copy `.env.example` to `.env` and fill in your values.

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

---

# Versión en Español

<div align="center">

# DayMark · Rastreador de Hábitos y Diario Personal

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

Seguimiento de hábitos · Diario personal · Racha de días · Dashboard interactivo · Dracula y temas personalizados

[🇬🇧 English Version](#daymark--habit-tracker--daily-journal)

</div>

🔗 **Demo en vivo:** [daymark-ochre.vercel.app](https://daymark-ochre.vercel.app/login)

Realiza un seguimiento de tus hábitos diarios, escribe notas personales y visualiza tu progreso a lo largo del tiempo. Construido con Next.js 16, React 19, Prisma 7 y PostgreSQL.

### Vista Previa
<div align="center">
  <img src="./assets/login.gif" alt="Animación de inicio de sesión" width="600px" />
  <br />
  <em>Línea de tiempo infinita e interactiva al iniciar sesión</em>
  <br /><br />
  <img src="./assets/register.gif" alt="Cascada de mosaico al registrarse" width="600px" />
  <br />
  <em>Cascada de calendario interactiva en el registro</em>
  <br /><br />
  <img src="./assets/dashboard.png" alt="Vista general del dashboard" width="600px" />
  <br />
  <em>Panel de control, seguimiento de hábitos y soporte para temas oscuros</em>
</div>

## Características

- **Seguimiento de hábitos** — Crea hábitos y regístralos diariamente con un solo clic.
- **Cálculo de rachas** — Seguimiento automático de rachas para mantener la motivación.
- **Notas diarias** — Escribe una nota personal para cada día.
- **Calendario del dashboard** — Vista mensual con el estado de finalización de hábitos.
- **Gráficos y vista general** — Gráfico de actividad, tasas de finalización y tendencias (a través de Recharts).
- **Temas personalizados** — 4 preajustes (Minimal, Gris Industrial, Negro Puro, Dracula) + colores hexadecimales personalizados con contraste automático.
- **i18n** — Inglés y Español (ES/EN) con cambio basado en el contexto.
- **Autenticación** — Autenticación basada en JWT con cookies httpOnly (bcrypt + jsonwebtoken).

## Primeros Pasos

### Requisitos Previos

- Node.js >= 20
- PostgreSQL ejecutándose localmente en el puerto 5432 (o configúralo mediante `DATABASE_URL`)

### Configuración

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar el entorno
cp .env.example .env   # o edita .env directamente

# 3. Generar el cliente de Prisma
npx prisma generate

# 4. Ejecutar migraciones
npx prisma migrate dev

# 5. Iniciar el servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) para ver la aplicación.

### Variables de Entorno

| Variable | Descripción | Por defecto |
|----------|-------------|-------------|
| `DATABASE_URL` | Cadena de conexión de PostgreSQL | `postgresql://postgres:postgres@localhost:5432/daymark` |
| `JWT_SECRET` | Clave secreta para la firma de JWT | Generar con: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |

Copia `.env.example` a `.env` y completa tus valores.

## Estructura del Proyecto

```
src/
├── app/
│   ├── api/auth/       # Rutas de API de autenticación (login, registro, logout)
│   ├── dashboard/      # Dashboard protegido (hábitos, notas, vista general)
│   │   ├── habits/
│   │   ├── notes/
│   │   └── overview/
│   ├── login/
│   ├── register/
│   └── layout.tsx
├── components/         # Componentes de React
├── lib/
│   ├── actions/        # Acciones de servidor (hábitos, notas, autenticación)
│   ├── auth.ts         # Utilidades de autenticación (JWT, cookies)
│   ├── prisma.ts       # Singleton del cliente de Prisma
│   ├── lang.tsx        # i18n (ES/EN)
│   └── theme-context.tsx  # Sistema de temas
├── middleware.ts       # Protección de rutas
└── globals.css
```

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Iniciar servidor de desarrollo |
| `npm run build` | Construcción para producción |
| `npm run start` | Iniciar servidor de producción |
| `npm run lint` | Ejecutar ESLint |
| `npx prisma studio` | Abrir Prisma Studio (interfaz gráfica de la BD) |
| `npx prisma migrate dev` | Ejecutar migraciones pendientes |

## Estado del Proyecto

DayMark está bajo desarrollo activo. Consulta los [hitos (milestones)](https://github.com/AnthonyAndino/DayMark/milestones) e [issues](https://github.com/AnthonyAndino/DayMark/issues) en GitHub para ver la hoja de ruta completa.

## Licencia

MIT
