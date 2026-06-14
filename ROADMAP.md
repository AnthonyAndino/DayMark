# DayMark — Roadmap de funciones y mejoras

> Estado actual: Auth funcional, dashboard con calendario, CRUD de hábitos, notas diarias, sistema de temas, i18n (EN/ES), gráfica de actividad.

---

## 🔴 Prioridad Alta — Funcionalidad core faltante

### 1. Landing page propia
- La página raíz (`/`) todavía muestra el template default de Next.js
- Crear una landing atractiva con:
  - Hero section explicando qué es DayMark
  - Preview/mockup del dashboard
  - CTAs hacia `/login` y `/register`
  - Sección de features (hábitos, notas, temas, streaks)
- Redirigir automáticamente a `/dashboard` si el usuario ya tiene sesión activa

### 2. Editar notas existentes
- Actualmente solo se pueden crear y eliminar notas, no editarlas
- Agregar botón de edición inline o modal
- Permitir actualizar el contenido de una `DayNote` existente

### 3. Editar nombre de hábitos
- No hay forma de renombrar un hábito una vez creado
- Agregar edición inline (click en el nombre → input editable)
- Server action `updateHabit(habitId, newName)`

### 4. Confirmación antes de eliminar
- Al borrar un hábito se eliminan todos sus logs asociados (irreversible)
- Al borrar una nota se pierde permanentemente
- Agregar modal/dialog de confirmación: "¿Estás seguro? Esta acción no se puede deshacer"

### 5. Responsive / Mobile
- El sidebar actual es fijo a `w-56` y el layout usa `ml-56`
- En mobile el sidebar debería colapsar a un menú hamburguesa o un drawer
- El `LeftPanel` del login/register ya tiene `hidden md:flex`, pero el dashboard no tiene adaptación mobile
- El calendario necesita redimensionarse para pantallas pequeñas

---

## 🟡 Prioridad Media — UX y calidad de vida

### 6. Feedback visual en acciones
- Al crear/eliminar un hábito no hay toast ni feedback visible más allá del refresh
- Al guardar una nota no hay confirmación visual
- Implementar sistema de notificaciones/toasts ligero:
  - "Hábito creado ✓"
  - "Nota guardada ✓"
  - "Hábito eliminado"
  - "Error: no se pudo guardar"

### 7. Vista semanal en el calendario
- Actualmente solo hay vista mensual
- Agregar toggle mensual/semanal para ver los hábitos de la semana actual con más detalle
- La vista semanal podría mostrar cada hábito como fila y cada día como columna (estilo matrix)

### 8. Categorías o etiquetas para hábitos
- Todos los hábitos están en una lista plana
- Permitir asignar categorías: Salud, Productividad, Personal, etc.
- Filtrar hábitos por categoría en el dashboard
- Requiere campo `category` en el modelo `Habit` (o tabla `HabitCategory`)

### 9. Ordenar hábitos (drag & drop o flechas)
- Los hábitos se ordenan por `createdAt`
- Permitir al usuario reordenarlos manualmente
- Agregar campo `order: Int` al modelo `Habit`
- UI: flechas arriba/abajo o drag & drop

### 10. Búsqueda de notas
- Con muchas notas, encontrar una específica es difícil
- Agregar input de búsqueda en la vista de notas
- Filtrar por contenido y/o por rango de fechas

### 11. Exportar datos
- Permitir al usuario descargar sus datos:
  - Hábitos + logs en CSV o JSON
  - Notas en Markdown o texto plano
- Útil para backups y para portafolio (demostrar que la app es "real")

### 12. Más temas preset
- Actualmente hay 4 presets (Minimal, Gris Industrial, Negro Puro, Dracula)
- Agregar más opciones populares:
  - **Nord** (azules árticos)
  - **Solarized Light/Dark**
  - **Monokai**
  - **Catppuccin**
  - **Tokyo Night**
- También considerar un color picker visual en vez de solo input hex

---

## 🟢 Prioridad Baja — Nice to have

### 13. Heatmap anual (estilo GitHub)
- Agregar una vista de heatmap de 365 días
- Cada celda coloreada según cuántos hábitos se completaron ese día
- Buena visualización para motivación a largo plazo
- Podría vivir en la vista Overview

### 14. Metas y objetivos
- Permitir definir una meta por hábito: "Completar X días seguidos" o "Completar Y veces al mes"
- Mostrar progreso hacia la meta con barra de progreso
- Notificación/badge cuando se alcanza la meta

### 15. Recordatorios (notificaciones del navegador)
- Usar la API de notificaciones del navegador para enviar recordatorios
- El usuario configura a qué hora quiere recibir el recordatorio
- Requiere Service Worker para push notifications
- Guardar preferencia en la BD (`reminderTime` en User)

### 16. Modo "Focus" o Pomodoro integrado
- Timer de productividad integrado en el dashboard
- Cuando termina un pomodoro, ofrecer marcar un hábito como completado
- Historial de sesiones de enfoque

### 17. Estadísticas avanzadas
- Mejor día de la semana (mayor consistencia)
- Peor día de la semana
- Hábito más consistente vs. menos consistente
- Gráfica de tendencia de streak a lo largo del tiempo
- Comparación mes a mes

### 18. Adjuntar imágenes a notas
- Permitir subir una imagen junto con la nota del día
- Útil para tracking visual (progreso físico, comidas, etc.)
- Requiere storage (S3, Cloudflare R2, o similar)
- Agregar campo `imageUrl` al modelo `DayNote`

### 19. Compartir progreso
- Generar una imagen/card con el resumen semanal/mensual
- Formato tipo "story" para compartir en redes sociales
- Renderizar server-side con algo como `@vercel/og` o `satori`

### 20. PWA (Progressive Web App)
- Agregar `manifest.json` y Service Worker
- Permitir instalar DayMark como app en el teléfono
- Funcionalidad offline básica (ver últimos datos cacheados)

---

## 🔧 Mejoras técnicas / Deuda técnica

### 21. Validación de seguridad en Server Actions
- `createHabit` recibe `userId` desde el cliente en vez de extraerlo del token
- Riesgo: un usuario podría enviar el `userId` de otro usuario
- **Fix:** usar `getUserId()` (ya existe) en vez de confiar en el `userId` del form
- Lo mismo aplica para `toggleHabitLog` que recibe `userId` como parámetro

### 22. Manejo de errores centralizado
- Los errores se manejan con `console.error` en la mayoría de componentes
- No hay boundary de errores (`error.tsx`) para las rutas del dashboard
- Crear `src/app/dashboard/error.tsx` con UI de error amigable
- Crear `src/app/not-found.tsx` personalizado

### 23. Loading states
- No hay `loading.tsx` en las rutas del dashboard
- Al navegar entre Overview → Dashboard → Habits, no hay skeleton/spinner
- Crear componentes de skeleton para cada vista

### 24. Cálculo de streak incorrecto
- `getStreak()` ordena logs por `date: 'asc'` pero luego itera desde `i=0` comparando con `today - i`
- Esto significa que compara el log más antiguo con hoy, el segundo más antiguo con ayer, etc.
- **Fix:** ordenar por `date: 'desc'` para comparar desde el más reciente hacia atrás

### 25. JWT_SECRET hardcodeado
- El secret actual es `"mi-secreto-por-ahora"` (mencionado en AGENTS.md)
- Antes de deploy, mover a variable de entorno con un valor seguro
- Usar `crypto.randomBytes(64).toString('hex')` para generar uno

### 26. Rate limiting
- Las rutas de login/register no tienen rate limiting
- Un atacante podría hacer brute force del password
- Implementar rate limiting básico con un Map en memoria o usar un servicio como Upstash

### 27. Tests
- No hay ningún test en el proyecto
- Agregar al menos:
  - Tests unitarios para `getStreak`, `computeScheme`, `parseColor`
  - Tests de integración para las Server Actions
  - Test E2E básico del flujo login → dashboard → crear hábito

---

## 💅 Mejoras de UI/UX específicas

### 28. Animación de transición entre páginas
- Al navegar entre rutas del dashboard no hay transición visual
- Agregar fade-in/slide sutil usando `layout.tsx` + CSS transitions
- O usar View Transitions API (soporte experimental en Next.js)

### 29. Tooltips informativos
- Los botones de la sidebar no tienen tooltip al hacer hover
- Los cuadros del selector de temas tampoco indican el nombre del tema
- Agregar tooltips nativos (atributo `title`) o un componente tooltip custom

### 30. Empty states más ricos
- Los mensajes de "no hay hábitos" y "no hay notas" son solo texto
- Agregar ilustración SVG o icono grande
- Incluir CTA directo ("Crea tu primer hábito →")

### 31. Sidebar colapsable
- En pantallas medianas el sidebar de `w-56` ocupa mucho espacio
- Permitir colapsar a solo iconos (`w-14`)
- Guardar preferencia en localStorage

### 32. Indicador de día actual en sidebar
- Mostrar la fecha actual en el sidebar
- Mostrar un mini-resumen: "3/5 hábitos completados hoy"

---

## 📋 Resumen por archivo/componente

| Área | Qué existe | Qué falta |
|------|-----------|-----------|
| Landing (`page.tsx`) | Template de Next.js | Landing propia con hero + CTAs |
| Auth | Login, Register, Logout, JWT, Middleware | Rate limiting, JWT secret seguro |
| Dashboard | Calendario mensual, toggle hábitos, notas del día | Vista semanal, loading/error states |
| Hábitos | CRUD básico, streaks, gráfica | Editar nombre, categorías, reordenar, metas |
| Notas | Crear, listar, eliminar | Editar, buscar, adjuntar imágenes |
| Overview | Métricas básicas, gráfica de area | Heatmap, estadísticas avanzadas |
| Temas | 4 presets, custom hex, auto-contrast | Más presets, color picker visual |
| i18n | EN/ES con contexto | — (completo por ahora) |
| Mobile | Panel auth responsive | Dashboard no responsive |
| Tests | Ninguno | Unit, integración, E2E |

---

*Última actualización: Junio 2026*
