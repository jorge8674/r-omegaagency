# OMEGA — PROMPT DE CONTEXTO COMPLETO
*Para usar al inicio de cada nueva conversación*

---

## QUIÉN SOY
Soy Ibrain, CTO y fundador de OMEGA (Raisen Omega).
Filosofía de desarrollo: "no velocity, only precision" — calidad sobre velocidad.
Tengo 8 años de experiencia empresarial (meal prep, BuildStream, ahora OMEGA).

---

## QUÉ ES OMEGA
**OMEGA** es una plataforma SaaS de marketing digital con AI para agencias.
- **URL producción:** https://r-omega.agency
- **Marca:** RAISEN. OMEGA
- **Stack:** Next.js/React (Lovable) + FastAPI (Railway) + Supabase (Lovable Cloud)
- **GitHub:** https://github.com/Software2026/OMEGA.git

---

## INFRAESTRUCTURA ACTUAL

### Frontend — Lovable
- Proyecto en Lovable (plataforma no-code/AI)
- URL: r-omega.agency
- Supabase de Lovable: https://kbuwykooisxwkjazbadw.supabase.co
- ANON KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtidXd5a29vaXN4d2tqYXpiYWR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5MzU0MDgsImV4cCI6MjA4NjUxMTQwOH0.EmfwGJrY9v0Nt86BEaw_eiJYzf_U9W0jeE5wu4hMy1c
- ⚠️ NO se puede cambiar el Supabase de Lovable ni acceder al service_role key

### Backend — Railway (FastAPI)
- URL: https://omegaraisen-production.up.railway.app
- 95+ endpoints operacionales (84 agentes AI + 11 resellers)
- 15 agentes AI especializados
- Variables en Railway:
  - SUPABASE_URL = https://jsxuhutiduxjjuqtyoml.supabase.co (Supabase propio)
  - SUPABASE_ANON_KEY = sb_publishable_SDPoCgHvC-NzMkBTGkc-TA_X2lq3yVJ
  - SUPABASE_SERVICE_ROLE_KEY = [configurado en Railway]

### Supabase Propio (para Railway)
- URL: https://jsxuhutiduxjjuqtyoml.supabase.co
- Tablas: resellers, reseller_branding, reseller_agents
- Bucket Storage: reseller-media (público, max 15MB)

### Dos Agentes de Desarrollo
- **Agente Consola** = Backend/Railway/FastAPI/Supabase
- **Agente Lovable** = Frontend/UI/React/Componentes

---

## SISTEMA DE DISEÑO OMEGA

```
Paleta HSL (dark mode único):
--background:  225 15% 5%   (#0D0E12)
--primary:     38 85% 55%   (Oro/Ámbar — CTAs)
--secondary:   225 12% 14%  (Cards/Inputs)
--card:        225 15% 8%
--border:      225 12% 16%

Tipografía:
- font-display: Syne (títulos, badges, botones, logo)
- font-body:    DM Sans (párrafos, labels)

Cursor personalizado global (oro)
Sin light mode
```

---

## PÁGINAS COMPLETADAS — FASE 1 ✅

| Página | Status | Features |
|--------|--------|----------|
| Dashboard | ✅ | 14/15 agentes, workflows, alertas |
| Contenido | ✅ | 4 tabs, GPT-4o + DALL-E 3 |
| Calendario | ✅ | Scheduling |
| Analytics | ✅ | Métricas, insights, forecast 30d, reporte |
| Competitive | ✅ | Benchmark, trends, viralidad, oportunidades |
| Crisis Room | ✅ | 5 features completos |
| Growth | ✅ | Brand voice, oportunidades, experimentos A/B |

---

## FASE 2 — EN PROGRESO

### Completado ✅
- Tablas en Supabase: resellers, reseller_branding, reseller_agents
- Campos nuevos en clients: reseller_id, monthly_budget_total, budget_operative_60/40, plan, stripe_customer_id, trial_active, etc.
- 11 endpoints Railway: /api/v1/resellers/...
- Página /admin/resellers con KPIs, tabla, switches de suspensión
- Página /reseller/dashboard con KPIs, clientes, agentes, estado con OMEGA
- Lazy initialization de Supabase service en Railway
- email-validator==2.1.0 agregado a requirements.txt
- Railway verde y operacional ✅

### Pendiente 🔄
- [ ] Crear primer reseller de prueba desde /admin/resellers
- [ ] /reseller/branding — Editor visual con tabs
- [ ] /landing/:slug — Landing parametrizada white-label
- [ ] Storage upload (logo + hero media)
- [ ] Stripe + billing
- [ ] Auth por roles (Owner/Reseller/Agent/Client)

---

## MODELO DE NEGOCIO RESELLER

```
JERARQUÍA:
OMEGA Super-Admin (Ibrain) — ve TODO
  └── Reseller (Enterprise + White-Label Add-on)
        ├── Subdomain: {slug}.r-omega.agency
        ├── 100% white-label (OMEGA invisible)
        ├── Su propio Stripe para cobrar clientes
        ├── OMEGA cobra 30% de su revenue mensual
        ├── Ve SOLO sus propios clientes
        └── 90 días sin pago → OMEGA hereda sus clientes

ENFORCEMENT:
Día 1:  Email warning
Día 7:  Segundo warning
Día 15: Suspensión automática (switch)
Día 30: OMEGA contacta clientes directamente
Día 90: Clientes migran a OMEGA permanentemente

PLANES: Reseller vende Básico/Pro/Enterprise de OMEGA
COMISIÓN: 30% fija, no negociable
STRIPE: Reseller conecta su propio Stripe
```

---

## LANDING PAGE RESELLER

```
Misma arquitectura que landing RAISEN pero parametrizada:
- Logo propio
- Hero: video (mp4/webm) O imagen (max 15MB)
- Colores HSL personalizables
- Todas las secciones editables
- Sin ninguna referencia a OMEGA
- Leads van a tabla leads con reseller_id

Editor en: /reseller/branding (5 tabs)
TAB 1: Identidad Visual (logo, colores, nombre)
TAB 2: Hero (upload media, CTA text)
TAB 3: Secciones (pain, solutions, servicios, métricas, proceso)
TAB 4: Social Proof (testimonios, logos clientes)
TAB 5: Contacto y Footer
```

---

## ENDPOINTS RAILWAY ACTIVOS

```
BASE: https://omegaraisen-production.up.railway.app

RESELLERS (nuevos):
POST   /api/v1/resellers/create
GET    /api/v1/resellers/all
GET    /api/v1/resellers/{id}/dashboard
PATCH  /api/v1/resellers/{id}/status
POST   /api/v1/resellers/{id}/branding
GET    /api/v1/resellers/{id}/branding
GET    /api/v1/resellers/{id}/clients
POST   /api/v1/resellers/{id}/clients/add
GET    /api/v1/resellers/slug/{slug}  ← PÚBLICO
POST   /api/v1/resellers/{id}/upload-hero-media

AI AGENTS (84 endpoints):
/api/v1/content/*, /api/v1/analytics/*, 
/api/v1/competitive/*, /api/v1/trends/*,
/api/v1/growth/*, /api/v1/brand-voice/*,
/api/v1/ab-testing/*, /api/v1/crisis/*,
/api/v1/orchestrator/*, /api/v1/reports/*
```

---

## RUTAS FRONTEND

```
/                        → Landing OMEGA (Raisen)
/dashboard               → Dashboard principal OMEGA
/contenido               → Generación de contenido AI
/calendario              → Calendario de publicaciones
/analytics               → Analytics + reportes
/competitive             → Inteligencia competitiva
/crisis-room             → Crisis management
/growth                  → Growth & Brand Voice
/clientes                → Gestión de clientes
/configuracion           → Configuración

FASE 2 (nuevas):
/admin/resellers         → ✅ Lista y gestión de resellers
/reseller/dashboard      → ✅ Panel del reseller
/reseller/branding       → 🔄 Editor de landing
/landing/:slug           → 🔄 Landing pública del reseller
```

---

## REGLAS DE DESARROLLO

```
1. Page-by-page: no avanzar hasta que página actual = 100% funcional
2. Button-by-button: cada botón probado con screenshot
3. Agente Consola primero para backend, luego Lovable conecta
4. Todos los payloads deben matchear EXACTAMENTE los modelos Pydantic
5. Cuando hay 422 → pedir schema exacto del modelo al agente Consola
6. Sin infraestructura nueva de Lovable Cloud (todo va a Railway/Supabase propio)
7. Lovable NO accede a Supabase directamente para resellers → todo vía Railway API
8. Archivos max 200 líneas (filosofía de precisión)
```

---

## PRÓXIMO PASO INMEDIATO

```
1. Verificar que /admin/resellers puede crear resellers
   (Railway verde, endpoints respondiendo)

2. Crear reseller de prueba:
   slug: testagencia
   agency_name: Agencia Test PR
   owner_email: test@agenciatest.com
   owner_name: Juan Test

3. Si funciona → arrancar /reseller/branding editor

4. Luego → /landing/:slug parametrizada

5. Luego → Stripe + auth por roles
```

---

## ARCHIVOS CLAVE

```
Frontend (Lovable):
src/lib/api-client.ts     → Todos los endpoints (Railway)
src/pages/AdminResellers.tsx
src/pages/ResellerDashboard.tsx
src/pages/Competitive.tsx, Growth.tsx, Analytics.tsx

Backend (Railway/GitHub):
backend/app/main.py
backend/app/api/routes/resellers.py
backend/app/infrastructure/supabase_service.py
backend/requirements.txt
backend/supabase_migrations/002_resellers_multitenant.sql

Documentación:
OMEGA_MASTER_ARCHITECTURE.md (incluye addendum white-label reseller)
```

