# OMEGA PLATFORM — PROTOCOLO DE AGENTES DE IA
## Reglas de Coexistencia: Claude Code ↔ Lovable
**Versión 1.0 — Documento Oficial**
**Fecha de firma: 14 de marzo de 2026 | Puerto Rico, AST**

---

## 1. Propósito

Este documento establece con carácter de ley interna las reglas de operación, responsabilidades y límites de cada agente de IA que participa en el desarrollo de OMEGA Platform. Su cumplimiento es obligatorio para todos los agentes involucrados.

Rige a partir de la fecha de firma y permanece vigente hasta que Ibrain (CEO/CTO, Raisen Agency / OMEGA) emita una nueva versión firmada.

---

## 2. Repositorios y Agentes

### 2.1 Repositorios del Proyecto

| Repositorio | URL / Ruta Local |
|-------------|-----------------|
| Backend (OmegaRaisen) | github.com/jorge8074/OmegaRaisen → `C:\Users\muscl\Desktop\Master redes` |
| Frontend (r-omegaagency) | github.com/jorge8074/r-omegaagency → `C:\Users\muscl\Desktop\r-omegaagency` |
| Desplegado en | r-omega.agency (Lovable hosting) |
| Backend prod | omegaraisen-production-2031.up.railway.app |

### 2.2 Agentes Involucrados

| Agente | Rol |
|--------|-----|
| Claude Code (terminal) | Arquitecto de código — backend + frontend lógica/DDD |
| Lovable | Diseño visual — UI, componentes, landing pages |
| Claude (chat/coordinador) | Coordinación estratégica, prompts, documentación |
| Ibrain | CEO/CTO — autoridad máxima, aprobación final |

---

## 3. Responsabilidades por Agente

### 3.1 Claude Code — Propietario del Código

| Hace ✅ | NO hace ❌ |
|---------|-----------|
| Backend 100% (FastAPI, workers, auth) | Tocar archivos mientras Lovable trabaja en ellos |
| Frontend: lógica, hooks, rutas, DDD | Operar sin diff aprobado por Ibrain |
| Refactors que violan R-LINES-001 | Saltarse R-DDD-001 (Router→Handler→Supabase) |
| Push a ambos repos: backend + frontend | Hardcodear UUIDs o mock data |
| Lee todo el proyecto antes de actuar | Llamadas directas a Supabase desde frontend |
| Muestra diff antes de commitear | Modificar password_hash o credenciales protegidas |

### 3.2 Lovable — Propietario del Diseño Visual

| Hace ✅ | NO hace ❌ |
|---------|-----------|
| Componentes UI nuevos desde cero | Tocar archivos en los que Claude Code trabaja |
| Diseño visual, landing pages, marketing | Violar R-LINES-001 (Claude Code corregirá) |
| Preview visual en tiempo real | Conectar directamente a Supabase |
| Push a github/r-omegaagency | Mezclar lógica de negocio con UI |
| Deployment automático a r-omega.agency | Crear archivos > 200 líneas sin aviso |

---

## 4. Protocolo de Coexistencia — Regla MUTEX

```
⚡ REGLA CRÍTICA — MUTEX DE ARCHIVOS
─────────────────────────────────────────────────────
Un archivo solo puede ser modificado por UN agente a la vez.

Si Claude Code trabaja un archivo → Lovable NO toca ese archivo.
Si Lovable trabaja un componente  → Claude Code NO toca ese archivo.
Nunca dos agentes en el mismo archivo simultáneamente.

Violación = conflicto de merge = código roto en producción.
─────────────────────────────────────────────────────
```

### 4.1 Flujo Oficial de Trabajo

| Tipo de Tarea | Agente Responsable |
|---------------|-------------------|
| Lógica, hooks, rutas, DDD, fixes | Claude Code |
| Refactors por violación de reglas | Claude Code |
| Backend endpoints, workers, auth | Claude Code |
| Componentes UI nuevos (diseño) | Lovable |
| Landing pages, páginas de marketing | Lovable |
| Ajustes visuales finos | Lovable |
| Coordinación, documentación, prompts | Claude (chat) |
| Aprobación final de cualquier cambio | Ibrain |

### 4.2 Cómo Ibrain Asigna el Agente

Antes de pedir cualquier tarea que involucre código, Ibrain especifica explícitamente:

- **«Claude Code: [tarea]»** → Claude Code ejecuta en terminal
- **«Lovable: [tarea]»** → Lovable ejecuta en su editor
- **Si no se especifica** → Claude (chat) pregunta «¿Quién ejecuta esto?» antes de proceder

---

## 5. Flujo de Push y Deployment

| Paso | Qué ocurre |
|------|-----------|
| 1. Claude Code hace cambio en frontend | Modifica archivos en `C:\...\r-omegaagency` |
| 2. Claude Code hace push | `git push origin main` → github/r-omegaagency |
| 3. Lovable detecta el push | Sincroniza automáticamente con el repo |
| 4. Lovable despliega | Build automático → r-omega.agency ✅ |
| 5. Lovable hace cambio visual | Push desde Lovable → github/r-omegaagency |
| 6. Claude Code hace pull | `git pull` antes de trabajar esa área |

```
⚠️ REGLA ANTI-CONFLICTO
─────────────────────────────────────────────────────
Antes de que Claude Code trabaje en el frontend, SIEMPRE ejecutar:

  cd C:\Users\muscl\Desktop\r-omegaagency && git pull origin main

Esto previene conflictos de merge con cambios de Lovable.
─────────────────────────────────────────────────────
```

---

## 6. Reglas Absolutas del Proyecto

Estas reglas aplican a TODOS los agentes sin excepción:

| ID | Regla |
|----|-------|
| R-LINES-001 | Máximo 200 líneas por archivo. Sin excepción. |
| R-DDD-001 | Router → Handler → Supabase. No saltar capas. |
| R-TENANT-001 | client_id inyectado siempre. No hardcodear. |
| R-AGENT-002 | Claude Code puede tocar frontend. Lovable: solo diseño. |
| R-SUPABASE-001 | RLS DISABLED en tablas nuevas. IDs como UUID. |
| R-AUTH-001 | password_hash siempre bcrypt $2b$12$. Jamás tocar. |
| R-MOCK-000 | CERO mock data. CERO placeholders. CERO hardcode. |
| R-DIFF-001 | Siempre mostrar diff antes de commitear. |
| R-MUTEX-001 | Un archivo = un agente a la vez. Siempre. |

---

## 7. Credenciales Protegidas

```
🔐 ESTAS CUENTAS NUNCA SE TOCAN
─────────────────────────────────────────────────────
raisenagencypr@gmail.com  → role: owner — NUNCA modificar password ni role
clients.password_hash     → SIEMPRE bcrypt $2b$12$ — NUNCA texto plano
ANTHROPIC_API_KEY         → solo en variables Railway, nunca en código
SUPABASE_SERVICE_KEY      → solo en backend, nunca en frontend

Ningún agente puede modificar estas credenciales
sin aprobación explícita de Ibrain.
─────────────────────────────────────────────────────
```

---

## 8. Firmas y Aceptación del Protocolo

Al firmar este documento, cada agente confirma que ha leído, comprendido y acepta cumplir todas las reglas establecidas. El incumplimiento faculta a Ibrain a revocar el acceso del agente a cualquier repositorio.

---

### ✍️ IBRAIN — CEO / CTO
**Raisen Agency / OMEGA Platform — Puerto Rico**
Estado: **AUTORIDAD MÁXIMA ✔ Aprobado**
Fecha: 14 de marzo de 2026

---

### ✍️ CLAUDE CODE
**Agente de Código — Backend + Frontend Lógica/DDD**
Estado: **ENTENDIDO Y PACTADO ✔ Acepto todas las reglas**
Fecha: 14 de marzo de 2026

Compromisos específicos:
- Ejecutar `git pull` antes de tocar cualquier archivo frontend
- Mostrar diff siempre antes de commitear
- Verificar R-LINES-001 en cada archivo que toque
- Nunca operar en archivos que Lovable esté editando activamente

---

### ✍️ LOVABLE
**Agente de Diseño Visual — UI / Componentes / Landing Pages**
Estado: **ENTENDIDO Y PACTADO ✔ Acepto todas las reglas**
Fecha: 14 de marzo de 2026

Compromisos específicos:
- Operar únicamente en diseño visual y componentes UI
- No tocar archivos de lógica, hooks o rutas que Claude Code gestiona
- Notificar a Ibrain si detecta violaciones de DDD para que Claude Code corrija
- No conectar directamente a Supabase desde el frontend

---

### ✍️ CLAUDE (Chat / Coordinador)
**Arquitecto Estratégico — Documentación / Prompts / Coordinación**
Estado: **ENTENDIDO Y PACTADO ✔ Acepto todas las reglas**
Fecha: 14 de marzo de 2026

Compromisos específicos:
- Especificar siempre qué agente ejecuta cada tarea antes de proceder
- Preguntar «¿Quién ejecuta esto?» si Ibrain no especifica
- Mantener PENDIENTES.md y PROGRESOS.md actualizados al cierre de cada sesión
- Nunca dar instrucciones que contradigan este protocolo

---

```
═══════════════════════════════════════════════════════════════
OMEGA Platform © 2026 — Raisen Agency, Puerto Rico
Documento generado: 14 de marzo de 2026 | 03:30 AM AST
Versión: 1.0 — Oficial y vigente

🐢💎 No velocity, only precision.
═══════════════════════════════════════════════════════════════
```
