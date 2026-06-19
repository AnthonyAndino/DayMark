# Diseño: Programación de hábitos, calendario individual y filtro por fecha de creación

**Fecha:** 2026-06-19
**Estado:** Aprobado

## Resumen

Tres features relacionadas que mejoran el sistema de hábitos de Daymark:

1. **Filtro por fecha de creación** — Los hábitos no aparecen en días anteriores a su creación
2. **Calendario por hábito** — Vista individual del calendario para un hábito específico
3. **Días programados** — Poder definir en qué días de la semana aplica cada hábito

---

## 1. Modelo de datos

### Cambio en `Habit` (prisma/schema.prisma)

```prisma
model Habit {
  id        Int        @id @default(autoincrement())
  name      String
  userId    Int
  daysOfWeek Int[]?                 // null = todos los días, ej: [1,2,3,4,5] = L-V
  createdAt DateTime   @default(now())
  user      User       @relation(fields: [userId], references: [id])
  logs      HabitLog[]
}
```

- `daysOfWeek`: campo opcional (`Int[]?`). Array de enteros 0-6 (0=domingo, 1=lunes... 6=sábado)
- `null` = el hábito aplica todos los días (comportamiento actual por defecto). Un array vacío `[]` no es válido (no tendría sentido).
- No se crean modelos nuevos ni tablas adicionales

### Convención de días

| Número | Día     |
|--------|---------|
| 0      | Domingo |
| 1      | Lunes   |
| 2      | Martes  |
| 3      | Miércoles |
| 4      | Jueves  |
| 5      | Viernes |
| 6      | Sábado  |

---

## 2. Server Actions y lógica de negocio

### `createHabit` (modificar)

**Ubicación:** `src/lib/actions/habits.ts`

- Schema Zod actualizado: acepta `daysOfWeek: z.array(z.number().min(0).max(6)).optional()`
- Si no se envía `daysOfWeek`, se guarda como `null` en Prisma
- Se guarda directamente como JSON array (Prisma lo maneja automáticamente)

### `createHabitSchema` (Zod)

```ts
const HabitSchema = z.object({
  name: z.string().min(1).max(50),
  daysOfWeek: z.array(z.number().min(0).max(6)).optional(),
})
```

### `toggleHabitLog` (modificar)

**Validaciones nuevas antes de crear un log:**

1. `fecha >= habit.createdAt` — No permitir marcar un hábito en días anteriores a su creación
2. Si `habit.daysOfWeek` NO es null — verificar que `fecha.getDay()` esté incluido en `daysOfWeek`
3. Si alguna validación falla, lanzar error controlado (no se crea el log)

### `getStreak(habitId)` (modificar)

**Lógica actual:** Cuenta días consecutivos desde hoy hacia atrás donde exista un log.

**Lógica nueva:**
- Si `habit.daysOfWeek` es null: misma lógica actual (consecutivo diario)
- Si `habit.daysOfWeek` tiene valores:
  - Iterar desde hoy hacia atrás
  - Saltar los días cuyo `getDay()` NO esté en `daysOfWeek`
  - Cuando encuentre un día que SÍ está en `daysOfWeek` pero NO tiene log, romper la racha
  - La racha cuenta solo los días que aplican

**Ejemplo (gym L-V = [1,2,3,4,5]):**
- Hoy lunes (marcado) → viernes (marcado) → jueves (marcado) → miércoles (marcado) → martes (no marcado) → racha = 3 (lun, vie, jue)
- El finde se salta completamente

### `getHabitStats(habitId, month, year)` (nueva)

Para la vista individual del hábito:
- `totalScheduledDays`: cuántos días del mes están en `daysOfWeek` (desde `createdAt` hasta fin de mes)
- `completedDays`: cuántos de esos días tienen log
- `completionRate`: porcentaje de completación

---

## 3. UI / Componentes

### AddHabit modificado (`src/components/AddHabit.tsx`)

**Nuevo: Selector de días**
- 7 botones circulares: D L M M J V S
- Cada botón se togglea al hacer clic (active/inactive)
- Presets rápidos debajo de los botones:
  - "Diario" → selecciona todos (guarda como `null`)
  - "Semanal L-V" → selecciona [1,2,3,4,5]
  - "Findes" → selecciona [0,6]
- Si no se selecciona nada explícitamente, se guarda como `null` (todos los días)
- El preset "Diario" es el seleccionado por defecto

### Calendario general modificado (`src/components/Calendar.tsx`)

**Filtros al mostrar checkboxes de un día:**
1. `habit.createdAt <= selectedDate`
2. Si `habit.daysOfWeek` no es null, `selectedDate.getDay()` debe estar en `daysOfWeek`
3. Si no pasa los filtros, el hábito no se renderiza en ese día

**X de "todos completados":**
- Solo aparece cuando TODOS los hábitos que APLICAN en ese día están marcados
- Los hábitos que no aplican (por fecha o por schedule) no cuentan ni a favor ni en contra

**Visualización del schedule:**
- En el panel de hábitos (al hacer clic en un día), cada hábito muestra su schedule:
  - Si `daysOfWeek` es null: muestra "Diario"
  - Si tiene días específicos: muestra "D L M M J V S" con los activos resaltados en verde

**Click en nombre del hábito:**
- El nombre del hábito es un link a `/dashboard/habits/[id]`

### Vista por hábito (nueva ruta)

**Ruta:** `/dashboard/habits/[id]`

**Comportamiento:**
- Server component que recibe `habitId` como parámetro
- Consulta el hábito específico + sus logs del mes
- Renderiza el mismo componente `Calendar` pero con `habitId` como prop
- El calendario solo muestra ese hábito
- Botón "Volver al dashboard" para regresar

**Navegación desde la lista de hábitos:**
- En `/dashboard/habits`, cada hábito en la lista tiene un botón "Ver calendario" que lleva a `/dashboard/habits/[id]`

### Editar hábito (nuevo componente o modal)

**Opcional pero recomendado:**
- Botón "Editar" junto al botón "Eliminar" en la lista de hábitos
- Modal con el mismo formulario de AddHabit (nombre + selector de días)
- Server Action `updateHabit(id, data)` para persistir cambios

---

## 4. Resumen de cambios por archivo

| Archivo | Cambio |
|---------|--------|
| `prisma/schema.prisma` | Agregar `daysOfWeek Int[]?` a `Habit` |
| `src/lib/actions/habits.ts` | Modificar `createHabit`, `toggleHabitLog`, `getStreak`. Agregar `updateHabit`, `getHabitStats` |
| `src/components/AddHabit.tsx` | Agregar selector de días + presets |
| `src/components/Calendar.tsx` | Agregar filtros por fecha/schedule. Links a vista individual |
| `src/app/dashboard/habits/[id]/page.tsx` | Nueva página de calendario por hábito |
| `src/app/dashboard/habits/page.tsx` | Agregar botón "Ver calendario" a cada hábito |
| `src/app/dashboard/page.tsx` | Actualizar consultas para incluir `daysOfWeek` |

---

## 5. Consideraciones

- `daysOfWeek` como `null` = "todos los días" mantiene compatibilidad hacia atrás con hábitos existentes
- La migración de Prisma para hábitos existentes: `daysOfWeek` será `null` (todos los días)
- El streak de hábitos existentes (sin schedule) no cambia
- Los días no programados simplemente no muestran el hábito en la UI
