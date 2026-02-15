# OMEGA_PRECEDENTS.md
## Raisen Omega — Registro Completo de Decisiones y Precedentes
*Documento vivo — Actualizado Febrero 2026*

---

# QUIÉN ES RAISEN Y POR QUÉ EXISTE OMEGA

## El Origen Real

Raisen es una agencia boutique de marketing digital operando con:
- Clientes reales activos
- Community managers en equipo
- Influencers en la red
- AI de terceros (Claude, ChatGPT, Midjourney, etc.) para producción de contenido

**El problema que creó OMEGA:**
Raisen pagaba múltiples suscripciones fragmentadas para hacer el mismo
trabajo que una sola plataforma debería hacer. Cada herramienta era
un silo. Los CMs cambiaban entre 6 tabs. La calidad dependía de quién
usaba qué. Imposible escalar con ese modelo.

**La decisión:**
En vez de seguir pagando a terceros, construir la plataforma propia.
Abrirla al público. Convertir el costo operacional en un activo.

**El fundador:**
Ibrain — CTO y fundador. 8 años de experiencia empresarial.
Meal prep, construcción (WUDI/BuildStream), ahora OMEGA.
Filosofía: "No velocity, only precision."

---

# DECISIONES ARQUITECTÓNICAS — CON SU RAZÓN

## STACK TECNOLÓGICO

```
DECISIÓN: Next.js/React (Lovable) + FastAPI (Railway) + Supabase

RAZÓN:
- Lovable acelera el frontend sin sacrificar código real
- Railway es simple, confiable, y escala automáticamente
- Supabase es Postgres con auth, storage y realtime incluidos
- FastAPI es el mejor framework Python para APIs de AI

ALTERNATIVAS DESCARTADAS:
- Django → más lento para APIs AI
- Node.js backend → Python es superior para AI/ML
- Firebase → vendor lock-in peligroso
- Vercel DB → limitaciones de Postgres
```

## SEPARACIÓN DE BASES DE DATOS

```
DECISIÓN: Dos Supabase separados

Lovable Cloud: kbuwykooisxwkjazbadw.supabase.co
  → Tablas del proyecto existente (Lovable las gestiona)
  → Sin acceso al service_role key (limitación de Lovable)
  → Tablas: site_sections, testimonials, leads base, etc.

Supabase Propio: jsxuhutiduxjjuqtyoml.supabase.co
  → Nuevas tablas de OMEGA (resellers, clientes, contexto)
  → Acceso total, control total
  → Railway apunta aquí

RAZÓN:
Lovable Cloud no permite cambiar la URL de Supabase ni
compartir el service_role key. Decisión de plataforma no negociable.

MITIGACIÓN:
Todo dato nuevo va al Supabase propio vía Railway API.
Lovable nunca accede a Supabase directamente para resellers.
Todo pasa por los endpoints de Railway.

MIGRACIÓN FUTURA:
Cuando se salga de Lovable (mes 15-18), exportar SQL dump
de Lovable Cloud e importar al Supabase propio.
Un día de trabajo técnico.
```

## ARQUITECTURA DE RESELLERS

```
DECISIÓN FINAL (después de 8 preguntas de alineación):

JERARQUÍA:
  OMEGA Super-Admin (Ibrain)
    └── Reseller (Enterprise + White-Label Add-on)
          ├── Subdomain: {slug}.r-omega.agency
          ├── 100% white-label (OMEGA invisible)
          ├── Su propio Stripe para cobrar a sus clientes
          ├── OMEGA cobra 30% de su revenue mensual
          └── Ve SOLO sus propios clientes

ENFORCEMENT DE PAGOS:
  Día 1:  Email warning automático
  Día 7:  Segundo warning + indicator en portal
  Día 15: suspend_switch = true → portal suspendido
  Día 30: OMEGA contacta clientes del reseller directamente
  Día 90: Clientes migran a OMEGA permanentemente

COMISIÓN: 30% fija. No negociable.

RAZÓN:
- Reseller vende OMEGA sin OMEGA invertir en ventas
- 30% cubre infraestructura + soporte + profit
- 90 días es el tiempo máximo de exposición financiera
- Clientes heredados compensan la pérdida del reseller moroso
```

## MODELO DE PRECIOS

```
PLAN BÁSICO:     $97/mes
  1 cuenta, 2 nichos, 2 bloques/día
  Sin publicación automática
  1 red social

PLAN PRO:        $197/mes
  5 cuentas, 5 nichos/cuenta, 6 bloques/día
  Publicación semi-automática
  3 redes sociales
  Prompt optimizer, carruseles, uploads

PLAN ENTERPRISE: $497/mes
  Cuentas ilimitadas, nichos ilimitados
  Bloques ilimitados
  Publicación 100% automática
  Multi-cuenta simultáneo
  AI smart scheduling
  Analytics post-publicación
  Hasta 3 agentes humanos
  White-label disponible

TRIAL: 7 días, acceso Pro, tarjeta requerida
  Email día 5: "Termina en 2 días"
  Email día 7: "Último día"
  Sin cancelar → cobra automático al día 8

ADD-ONS (cualquier plan):
  Video Pack Starter (5 videos): $49/mes
  Video Pack Creator (15 videos): $129/mes
  Video Pack Agency (50 videos): $379/mes
  Video Pack Unlimited: $799/mes
  Video suelto corto: $12
  Video suelto medio: $25
  Video suelto largo: $49

RESELLER ADD-ON: $299/mes (requiere Enterprise)
```

## LOVABLE — DECISIÓN DE PERMANENCIA

```
DECISIÓN: Mantener Lovable hasta mes 15-18

CAPACIDAD REAL CONFIRMADA:
  1,500 clientes + 500 resellers = ~200-300 usuarios concurrentes
  Supabase Pro ($25/mes): ilimitado para estos números
  Railway Pro ($20/mes): escala automático
  Lovable CDN: trivial para estos volúmenes
  Infraestructura total: ~$45/mes para $295K MRR potencial

CUÁNDO MIGRAR:
  Cuando alguna de estas condiciones se cumpla:
  1. Feature compleja que Lovable no puede generar bien
  2. Deuda técnica que bloquee el desarrollo
  3. Mes 12 con ingresos para financiar la migración

ESTRATEGIA DE MIGRACIÓN (cuando llegue):
  Strangler Fig Pattern — página por página
  Backend (Railway) NO cambia nunca
  Solo el frontend evoluciona
  Nuevo repo Next.js 14, mismo design system
  Tiempo: 6-8 semanas con un dev

CÓDIGO SIEMPRE DISPONIBLE:
  GitHub: https://github.com/Software2026/OMEGA.git
  Lovable pushea automáticamente
  Si Lovable cierra mañana → el código está en GitHub
  Deploy en Vercel/Netlify en 10 minutos
```

---

# DECISIONES TÉCNICAS CRÍTICAS RESUELTAS

## CONFLICTOS DE DEPENDENCIAS

```
PROBLEMA RESUELTO: supabase==2.3.0 vs httpx==0.26.0
SOLUCIÓN: supabase==2.7.0 compatible con httpx==0.26.0
FECHA: Febrero 2026

PROBLEMA RESUELTO: email-validator faltante
SOLUCIÓN: email-validator==2.1.0 en requirements.txt
FECHA: Febrero 2026

PROBLEMA RESUELTO: Supabase eager initialization
  El servidor entero caía si Supabase fallaba al inicio
SOLUCIÓN: Lazy initialization con get_supabase_service()
  El error solo afecta los endpoints de resellers
  Los 84 agentes AI siguen funcionando
FECHA: Febrero 2026
```

## MIGRACIÓN SQL EXITOSA

```
TABLAS CREADAS EN PRODUCCIÓN:
  resellers (con todos sus campos de enforcement)
  reseller_branding (logo, colores, hero, secciones)
  reseller_agents (equipo del reseller)

CAMPOS AGREGADOS A clients:
  reseller_id FK (NULL = cliente directo de OMEGA)
  white_label_plan, monthly_budget_total
  budget_operative_60, budget_reserve_40
  human_supervision, human_hours_package
  plan, stripe_customer_id, trial_active, trial_ends_at

STORAGE BUCKET:
  reseller-media (público, max 15MB)

NOTA: Column "plan" ya existía en clients — se omitió duplicado
NOTA: Table "leads" no existía aún — reseller_id en leads diferido
```

---

# INVENTARIO COMPLETO DEL SISTEMA

## Páginas Frontend Completadas

```
FASE 1 — COMPLETADAS ✅
/                    Landing OMEGA (Raisen)
/dashboard           Dashboard principal, 14/15 agentes, workflows
/contenido           Generación AI (imagen, copy, hashtags, scripts)
/calendario          Scheduling de publicaciones
/analytics           Métricas, insights, forecast 30d, exportar reporte
/competitive         Benchmark, trends, viralidad, oportunidades
/crisis-room         Crisis management, 5 features completos
/growth              Brand voice, oportunidades, experimentos A/B

FASE 2 — EN PROGRESO 🔄
/admin/resellers     ✅ KPIs, tabla, switches, banner mora, modal crear
/reseller/dashboard  ✅ KPIs, clientes, agentes, estado con OMEGA
/reseller/branding   ⏳ Editor 5 tabs (pendiente)
/landing/:slug       ⏳ Landing pública white-label (pendiente)
```

## Endpoints Backend Activos

```
BASE URL: https://omegaraisen-production.up.railway.app

RESELLERS (11 endpoints):
POST   /api/v1/resellers/create
GET    /api/v1/resellers/all
GET    /api/v1/resellers/{id}/dashboard
PATCH  /api/v1/resellers/{id}/status
POST   /api/v1/resellers/{id}/branding
GET    /api/v1/resellers/{id}/branding
GET    /api/v1/resellers/{id}/clients
POST   /api/v1/resellers/{id}/clients/add
GET    /api/v1/resellers/slug/{slug}    ← PÚBLICO
POST   /api/v1/resellers/{id}/upload-hero-media

AI AGENTS (84 endpoints):
/api/v1/content/*       Generación de contenido
/api/v1/analytics/*     Analytics e insights
/api/v1/competitive/*   Inteligencia competitiva
/api/v1/trends/*        Análisis de tendencias
/api/v1/growth/*        Estrategias de crecimiento
/api/v1/brand-voice/*   Voz de marca
/api/v1/ab-testing/*    Experimentos A/B
/api/v1/crisis/*        Gestión de crisis
/api/v1/orchestrator/*  Orquestador de agentes
/api/v1/reports/*       Reportes exportables

TOTAL: 95 endpoints en producción
```

## Agentes AI del Sistema

```
EXISTENTES (15 agentes):
1.  ContentGeneratorAgent     Genera copy e ideas
2.  ImagePromptAgent          Prompts para generación de imágenes
3.  HashtagAgent              Hashtags optimizados por plataforma
4.  AnalyticsInsightAgent     Análisis de métricas
5.  CompetitiveAnalysisAgent  Análisis de competidores
6.  TrendDetectorAgent        Detección de tendencias
7.  CrisisDetectorAgent       Detección de crisis
8.  CrisisResponseAgent       Respuesta a crisis
9.  GrowthStrategyAgent       Estrategias de crecimiento
10. BrandVoiceAgent           Análisis y guía de voz de marca
11. ABTestingAgent            Diseño de experimentos
12. ReportGeneratorAgent      Generación de reportes
13. ScriptWriterAgent         Scripts para video/audio
14. OrchestratorAgent         Coordina todos los agentes
15. MonitorAgent              Monitoreo del sistema

FASE 3 — PLANIFICADOS (22 agentes):
Video: KlingVideoAgent, Veo3Agent, RunwayAgent, PikaAgent, SoraAgent, VideoCaptionAgent
Optimización: PromptOptimizerAgent, PromptRepositoryAgent, ContentAdaptorAgent, FormatOptimizerAgent
Contexto: ClientContextAgent, WebScraperAgent, SocialAnalyzerAgent, CompetitorWatchAgent
Publicación: InstagramPublisherAgent, TikTokPublisherAgent, FacebookPublisherAgent,
             LinkedInPublisherAgent, TwitterPublisherAgent, PublicationSchedulerAgent
Analytics: PostPerformanceAgent, EngagementTrackerAgent, ROICalculatorAgent, ViralPredictorAgent

TOTAL PLANIFICADO: 37 agentes
```

---

# DOCUMENTOS VIVOS DEL PROYECTO

```
OMEGA_MASTER_ARCHITECTURE.md   → Arquitectura completa + White-Label addendum
OMEGA_CONTEXT_PROMPT.md        → Prompt para nuevos chats (usar siempre al inicio)
Master_contenido.md            → Sistema de contenido ultra avanzado (11 módulos)
OMEGA_SUPER_AGENT.md           → NEXUS: El super agente de inteligencia colectiva
OMEGA_GUARDIAN.md              → Sistema de seguridad y mantenimiento autónomo
OMEGA_PRECEDENTS.md            → Este documento
```

---

# REGLAS DE DESARROLLO ESTABLECIDAS

```
1. Page-by-page: no avanzar hasta que la página actual = 100% funcional
2. Button-by-button: cada botón probado con screenshot antes de continuar
3. Agente Consola primero (backend) → luego Lovable conecta (frontend)
4. Todos los payloads deben matchear EXACTAMENTE los modelos Pydantic
5. Cuando hay error 422 → pedir schema exacto del modelo al Agente Consola
6. Sin infraestructura nueva de Lovable Cloud (todo va a Railway/Supabase propio)
7. Lovable NO accede a Supabase directamente para resellers → todo vía Railway API
8. Archivos máximo 200 líneas (filosofía de precisión)
9. Commit con mensaje descriptivo después de cada cambio funcional
10. Railway redeploy se activa automáticamente con push a GitHub main
```

---

# CREDENCIALES Y ACCESOS (REFERENCIA)

```
⚠️ ESTE DOCUMENTO ES PRIVADO — NO COMPARTIR

RAILWAY:
  URL: https://omegaraisen-production.up.railway.app
  Dashboard: railway.app

SUPABASE LOVABLE:
  Project ref: kbuwykooisxwkjazbadw
  URL: https://kbuwykooisxwkjazbadw.supabase.co
  Anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtidXd5a29vaXN4d2tqYXpiYWR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5MzU0MDgsImV4cCI6MjA4NjUxMTQwOH0.EmfwGJrY9v0Nt86BEaw_eiJYzf_U9W0jeE5wu4hMy1c
  ⚠️ Sin acceso a service_role (limitación de Lovable)

SUPABASE PROPIO:
  Project ref: jsxuhutiduxjjuqtyoml
  URL: https://jsxuhutiduxjjuqtyoml.supabase.co
  Anon key: sb_publishable_SDPoCgHvC-NzMkBTGkc-TA_X2lq3yVJ
  ✅ Service role key configurado en Railway

GITHUB:
  Repo: https://github.com/Software2026/OMEGA.git
  
FRONTEND:
  URL producción: https://r-omega.agency
  Plataforma: Lovable
```

