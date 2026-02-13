# OMEGA PLATFORM — DOCUMENTO MAESTRO DE ARQUITECTURA
> Versión 1.0 | Confidencial | Solo uso interno OMEGA
> Claude Sonnet 4.5 — Arquitecto Principal

---

## 1. VISIÓN GENERAL

OMEGA es una plataforma SaaS de automatización de marketing con IA para agencias. Opera como herramienta interna primero, luego escala a producto multi-cliente con portales diferenciados por rol.

**Stack actual:**
- Frontend: Next.js / React en Lovable → r-omega.agency
- Backend: FastAPI + 15 agentes AI en Railway → omegaraisen-production.up.railway.app
- DB: Supabase (PostgreSQL)
- AI Principal: Claude (Anthropic) — protagonista de todos los agentes
- AI Complementario: OpenAI GPT-4o + DALL-E 3
- Pagos: Stripe

---

## 2. ARQUITECTURA DE ROLES Y ACCESO

### Niveles de acceso (3 roles)

```
NIVEL 1 — OWNER (Tú / OMEGA)
- Ve absolutamente todo
- Acceso al Reserve Dashboard (PIN 6 dígitos)
- Puede redistribuir presupuesto entre clientes
- Ve el 40% de reserva de TODOS los clientes
- Puede depositar reservas en cuenta bancaria OMEGA
- Configura precios por hora de agentes humanos
- Asigna agentes humanos a cuentas

NIVEL 2 — AGENTE HUMANO (empleados de OMEGA)
- Ve solo sus clientes asignados
- Ve el presupuesto como si fuera 100% (es el 60% real)
- NUNCA ve el 40% de reserva
- Usa herramientas AI según plan del cliente
- Puede subir contexto y referencias al agente AI
- Reporta métricas de sus cuentas asignadas

NIVEL 3 — CLIENTE
- Ve solo su dashboard personal
- Ve su consumo de posts vs su plan
- Sube documentos de su negocio
- Agrega cuentas de referencia/competidores
- Ve resultados de contenido generado
- Gestiona sus métodos de pago
- Puede comprar posts adicionales (overage)
```

### URLs de portales

```
r-omega.agency                    → Landing pública + registro
r-omega.agency/admin              → Portal Owner (tú)
r-omega.agency/agent              → Portal Agente Humano
r-omega.agency/client             → Portal Cliente
r-omega.agency/client/onboarding  → Onboarding nuevo cliente
```

---

## 3. MODELO DE PRECIOS

### Filosofía de pricing
- El cliente paga MEMBRESÍA de acceso a herramientas
- NO ve el costo individual de cada API call
- Ve "Posts usados: 23/100" — nunca "$0.002 por request"
- Precio adicional por horas de agente humano
- Precio adicional por campañas
- Overage si supera límite de plan (paga por post extra)

### Planes (precios a definir — estructura confirmada)

```
PLAN BÁSICO
├── Acceso: Lovable AI integrado
├── Contenido: X posts/mes (texto + imagen básica)
├── Redes sociales: hasta 2 cuentas activas
├── Soporte: solo documentación
├── Agente humano: OPCIONAL — ver sección Human Add-on
└── Overage: $Y por post adicional

PLAN PRO
├── Acceso: OpenAI GPT-4o + Claude + Lovable
├── Contenido: X posts/mes (texto + imagen + audio)
├── Redes sociales: hasta 5 cuentas activas
├── Soporte: chat en horario laboral
├── Agente humano: OPCIONAL — ver sección Human Add-on
└── Overage: $Y por post adicional

PLAN ENTERPRISE
├── Acceso: TODOS los proveedores AI
│   (Claude, OpenAI, ElevenLabs, Gemini, Midjourney, Runway ML, Stability AI)
├── Contenido: Ilimitado (video, voz, imágenes HD, campañas)
├── Redes sociales: ilimitado
├── Soporte: dedicado + SLA garantizado
├── Agente humano: incluido — ver sección Human Add-on
└── Campañas: precio personalizado por campaña
```

### Human Add-on (Supervisión humana)

```
El cliente puede activar/desactivar supervisión humana
Checkbox en perfil: "Deseo supervisión de agente humano"

Si NO lo activa: precio de plan baja, sin soporte ni asistencia

Si lo activa — paquetes disponibles:
├── Pack 10 horas/mes   → $XXX
├── Pack 20 horas/mes   → $XXX
├── Pack 40 horas/mes   → $XXX
└── Input libre: precio por hora configurable desde Admin

El Owner define el precio/hora desde configuración.
El cliente ve el precio final, no el costo interno.
```

### Campañas (Add-on separado)

```
El cliente puede agregar presupuesto de campaña adicional
Separado de su membresía mensual
El Owner/Agente define el alcance y precio de cada campaña
El cliente paga por campaña desde su portal
```

---

## 4. SISTEMA PRESUPUESTO 60/40

### REGLA DE ORO (confidencial — solo Owner sabe)

```
Lo que el cliente paga → se divide automáticamente:
├── 60% → "Presupuesto Operativo" (lo ve el agente humano como 100%)
└── 40% → "Reserva OMEGA" (solo lo ve el Owner con PIN)

EJEMPLO:
Cliente paga $300/mes →
├── $180 aparece en dashboard del agente como "Presupuesto: $180"
└── $120 va a Reserva OMEGA (invisible para agente y cliente)
```

### Reserve Dashboard (Owner — protegido con PIN 6 dígitos)

```
Funcionalidades:
├── Ver reserva total acumulada de todos los clientes
├── Ver reserva por cliente con estado de metas
├── Redistribuir reserva a cliente que necesita refuerzo
├── Depositar reserva en cuenta bancaria OMEGA
├── Con reserva de OMEGA se pagan las horas humanas internas
└── Si cliente logró metas → retener o reasignar su reserva

VISTA:
┌─────────────────────────────────────────────┐
│ 🔐 OMEGA RESERVE [PIN: ●●●●●●]              │
│ Total reservas: $4,800                       │
│                                              │
│ Cliente A (Johanny):  $120  ✅ Metas → retener│
│ Cliente B (Empresa X): $240  ❌ Sin metas → reforzar│
│ Cliente C (Empresa Y): $80   ✅ Metas → liberar│
│                                              │
│ [Redistribuir] [Depositar en banco] [Asignar]│
└─────────────────────────────────────────────┘
```

### Costos estimados por request (SOLO OWNER ve esto)

```
GPT-4o texto:    ~$0.002
DALL-E 3:        ~$0.040
Claude Sonnet:   ~$0.015
Claude Opus:     ~$0.075
ElevenLabs voz:  ~$0.010
Runway video:    ~$0.500
```

---

## 5. FLUJO NUEVO CLIENTE

### Paso 1 — Landing pública (r-omega.agency)

```
Hero page de OMEGA con:
├── Propuesta de valor
├── Planes y precios
├── Botón "Comenzar"
└── Formulario de registro
```

### Paso 2 — Registro + Plan + Pago (Stripe)

```
Formulario:
├── Nombre completo *
├── Email *
├── Teléfono
├── Empresa
├── Plan seleccionado (Básico/Pro/Enterprise)
├── ¿Desea supervisión humana? [Checkbox]
│   └── Si sí → selecciona paquete de horas
├── Métodos de pago (Stripe):
│   ├── Tarjeta crédito/débito
│   └── ACH
├── Notas adicionales
└── [Crear Cliente]
```

### Paso 3 — Onboarding (cliente lo completa solo)

```
SECCIÓN 1 — Perfil de Negocio
├── Upload PDF / .md de información del negocio
│   (Misión, visión, resumen ejecutivo, PRD, todo)
├── Descripción breve del negocio
└── Industria / sector

SECCIÓN 2 — Cuentas Sociales Activas
└── Las redes sociales que OMEGA va a gestionar
    (Instagram, TikTok, Facebook, YouTube, LinkedIn, etc.)

SECCIÓN 3 — Cuentas de Referencia (MÍNIMO 3 POR RED)
├── Competidores directos
├── Marcas de referencia / aspiracionales
├── URLs de websites a analizar
└── OMEGA hace scraping automático de estas cuentas
    → El agente AI analiza, mapea y aprende de ellas
    → Forma el contexto base del cliente

SECCIÓN 4 — Información Adicional
├── Tono de voz de la marca
├── Colores/identidad visual (upload)
└── Objetivos de marketing
```

### Paso 4 — Asignación por Owner

```
Owner accede a nuevo cliente y:
├── Asigna agente humano (si aplica)
├── Selecciona proveedores AI activos según plan
├── Sistema aplica 60/40 automáticamente al pago
└── Cliente recibe acceso a su portal personal
```

---

## 6. CONTEXTO AI POR CLIENTE

### Cada cliente tiene su "Cerebro AI"

```
CONTEXTO PERSISTENTE POR CLIENTE:
├── business_context/
│   ├── business_overview.md (sube el cliente)
│   ├── brand_voice_profile.json (aprende con el tiempo)
│   └── uploaded_documents/ (PDFs, markdowns)
│
├── competitors_intelligence/
│   ├── competitor_1_analysis.json
│   ├── competitor_2_analysis.json
│   └── reference_accounts_data.json
│   (Todo generado por scraping automático)
│
├── content_history/
│   ├── generated_posts/
│   ├── performance_data.json
│   └── learnings.json (qué funcionó, qué no)
│
└── campaign_context/
    └── active_campaigns/
```

### Prompt base del agente (se construye dinámicamente)

```python
system_prompt = f"""
Eres el agente de marketing digital de {empresa}.

NEGOCIO:
{business_context}

COMPETIDORES Y REFERENCIAS:
{competitors_data}

HISTORIAL Y APRENDIZAJES:
{performance_learnings}

VOZ DE MARCA:
{brand_voice}

OBJETIVO ACTUAL:
{current_objective}

Genera contenido optimizado, preciso y alineado al plan del cliente.
Prioriza calidad sobre cantidad. Cada pieza de contenido debe ser 
estratégica y medible.
"""
```

### Cross-learning (aprendizaje entre cuentas)

```
Los agentes aprenden:
├── Por cliente: qué funciona en SU audiencia
├── Cross-cliente: patrones globales de éxito por industria
└── El sistema se vuelve más experto con cada iteración
```

---

## 7. PROVEEDORES AI Y ESCALABILIDAD DE APIs

### Proveedores disponibles por plan

```
BÁSICO:
└── Lovable AI (integrado, sin costo adicional)

PRO:
├── OpenAI GPT-4o + DALL-E 3 (textos + imágenes)
├── Anthropic Claude (análisis, estrategia, textos largos)
└── Lovable AI

ENTERPRISE:
├── Anthropic Claude — PROTAGONISTA PRINCIPAL
│   (Todas las versiones: Haiku, Sonnet, Opus)
├── OpenAI GPT-4o + DALL-E 3
├── ElevenLabs (voz y audio)
├── Google Gemini + VEO3 (multimodal + video)
├── Midjourney (imágenes artísticas)
├── Runway ML (video generativo)
├── Stability AI (Stable Diffusion)
└── Lovable AI
```

### UNA API KEY por proveedor es suficiente AHORA

```
ARQUITECTURA ACTUAL (0-100 clientes):
├── 1 API Key OpenAI (organización OMEGA)
├── 1 API Key Anthropic (organización OMEGA)
├── 1 API Key ElevenLabs
├── 1 API Key Google AI
└── El sistema trackea uso por cliente internamente

CAPACIDAD: 1 API Key de OpenAI maneja ~500 req/min
50 clientes activos = ~10 req/min c/u → suficiente

ARQUITECTURA FUTURA (100+ clientes):
├── Sub-organizations por proveedor
├── Rate limiting por cliente en el backend
├── Múltiples API keys si se necesita separar facturación
└── La arquitectura se prepara desde HOY para esto
```

### Preparación arquitectural desde HOY

```python
# En el backend, cada request incluye metadata del cliente:
headers = {
    "X-Client-ID": client_id,
    "X-Plan": client_plan,
    "X-Budget-Remaining": budget_60_percent
}

# Tracking de uso por cliente en Supabase:
table: ai_usage_log
├── client_id
├── provider (openai/anthropic/elevenlabs)
├── model (gpt-4o/claude-sonnet/etc)
├── tokens_used
├── cost_usd
├── timestamp
└── content_type (caption/image/script/etc)
```

---

## 8. PÁGINAS Y FUNCIONALIDADES POR ROL

### Portal Owner (admin completo)

```
Dashboard Owner:
├── Métricas globales (todos los clientes)
├── Revenue total y por cliente
├── Uso de AI por cliente
├── [🔐 RESERVE DASHBOARD] — PIN 6 dígitos
│   └── Ver/redistribuir el 40% de reservas
├── Lista de todos los clientes
├── Lista de agentes humanos y sus cuentas asignadas
├── Configuración de precios por hora
├── Configuración de planes
└── Alertas del sistema (agentes, errores, overage)
```

### Portal Agente Humano

```
Dashboard Agente:
├── Mis clientes asignados (solo los suyos)
├── Estado de cada cuenta (metas, consumo, alertas)
├── Acceso a herramientas AI por cada cliente
│   └── Generador de contenido, crisis, competitive, etc.
├── Presupuesto del cliente (VE EL 60% COMO SI FUERA 100%)
├── Subir contexto adicional al agente AI
├── Reportes de performance por cliente
└── Comunicación con el cliente (notas internas)
```

### Portal Cliente (acceso limitado)

```
Dashboard Cliente:
├── Mi Plan (plan activo, posts usados, renovación)
├── Mi Contenido (historial de posts generados)
├── Mis Cuentas Sociales
├── Mis Referencias y Competidores
├── Mi Negocio (documentos subidos, contexto)
├── Facturación (historial de pagos, métodos de pago)
├── Comprar posts adicionales (overage)
└── Agregar presupuesto de campaña

NO VE:
├── Otros clientes de OMEGA
├── Costo real de las API calls
├── El 40% de reserva
├── Cuántos clientes tiene OMEGA
└── Métricas financieras internas
```

---

## 9. BASE DE DATOS — TABLAS CLAVE

```sql
-- Clientes
clients (
  id, name, email, phone, company,
  plan (basic/pro/enterprise),
  stripe_customer_id,
  monthly_budget_total,      -- Lo que paga real
  budget_operative_60,       -- 60% para trabajar
  budget_reserve_40,         -- 40% para OMEGA
  human_supervision (bool),
  human_hours_package,
  status (active/suspended/churned),
  created_at
)

-- Métodos de pago (Stripe maneja el detalle)
payment_methods (
  id, client_id, stripe_payment_method_id,
  type (card/ach), last4, is_default
)

-- Cuentas sociales del cliente
social_accounts (
  id, client_id, platform, username, 
  account_url, is_active (cuenta gestionada o referencia),
  account_type (managed/reference/competitor),
  scraped_data (jsonb), last_scraped_at
)

-- Documentos de negocio
business_documents (
  id, client_id, filename, file_type,
  content_text, embedding_vector,
  uploaded_at
)

-- Agentes humanos
human_agents (
  id, name, email, hourly_rate,
  specializations (jsonb)
)

-- Asignaciones agente-cliente
agent_client_assignments (
  id, agent_id, client_id, 
  hours_allocated_monthly, status
)

-- Log de uso AI
ai_usage_log (
  id, client_id, agent_id,
  provider, model, tokens_used,
  cost_usd, content_type, timestamp
)

-- Contenido generado
generated_content (
  id, client_id, content_type,
  platform, topic, result_text,
  result_url, performance_data (jsonb),
  generated_at
)

-- Ciclos de facturación
billing_cycles (
  id, client_id, cycle_start, cycle_end,
  amount_charged, posts_used, posts_limit,
  overage_amount, status
)
```

---

## 10. STRIPE INTEGRATION

```
FLUJOS DE PAGO:
├── Suscripción mensual (plan)
├── Add-on horas humanas (si aplica)
├── Overage (posts adicionales al final del ciclo)
├── Campaña (pago puntual por campaña)
└── Presupuesto adicional (depósito extra del cliente)

WEBHOOKS A ESCUCHAR:
├── payment_intent.succeeded → activar/renovar cuenta
├── payment_intent.failed → alertar al cliente
├── customer.subscription.deleted → suspender cuenta
└── invoice.payment_succeeded → registrar en billing_cycles

SPLIT 60/40 AUTOMÁTICO:
Cuando entra un pago:
├── 60% → budget_operative_60 (disponible para agente)
└── 40% → budget_reserve_40 (solo Owner puede ver/usar)
```

---

## 11. SCRAPING DE COMPETIDORES Y REFERENCIAS

```
TRIGGER: Cliente agrega cuenta de referencia/competidor

PROCESO AUTOMÁTICO:
1. Queue job para scraping
2. Extraer: posts recientes, engagement, hashtags,
   horarios de publicación, tono, tipo de contenido
3. Analizar con Claude: patrones, estrategias, insights
4. Guardar en competitors_intelligence/ del cliente
5. Actualizar contexto del agente AI
6. Re-scraping semanal automático

ENDPOINTS:
POST /api/v1/competitive/analyze-account
POST /api/v1/competitive/compare-accounts
GET  /api/v1/competitive/client/{id}/insights
```

---

## 12. INSTRUCCIONES PARA AGENTES

### Para el agente de Consola (backend):

```
PRIORIDADES INMEDIATAS:
1. Terminar verificación de páginas pendientes:
   - /competitive
   - /growth  
   - /analytics
   - /dashboard (fix agents 0/15)

PRÓXIMAS IMPLEMENTACIONES (Fase 2):
1. Crear tabla clients en Supabase con schema definido
2. Sistema de roles en backend (Owner/Agent/Client JWT)
3. Middleware de autorización por rol
4. Endpoints de gestión de clientes (CRUD)
5. Sistema 60/40 automático en webhook de Stripe
6. Reserve Dashboard endpoint (protegido con PIN)
7. Tracking de uso AI por cliente (ai_usage_log)
8. Sistema de contexto por cliente (upload docs)
9. Queue de scraping de competidores

ARQUITECTURA A PREPARAR DESDE HOY:
- Toda llamada AI debe incluir client_id en metadata
- Rate limiting por cliente en el backend
- Logging de costo por request por cliente
- La API key única de OpenAI/Anthropic atiende todos los clientes
- Preparar estructura para sub-organizations futuras
```

### Para el agente de Lovable (frontend):

```
PRIORIDADES INMEDIATAS:
1. Terminar verificación de páginas pendientes
2. Fix Dashboard (agents count)

PRÓXIMAS IMPLEMENTACIONES (Fase 2):
1. Landing page pública con planes y precios
2. Formulario de registro con Stripe (Stripe.js)
3. Onboarding flow multi-paso para nuevos clientes:
   - Perfil de negocio + upload de documentos
   - Cuentas sociales activas
   - Cuentas de referencia/competidores (mínimo 3)
4. Portal Cliente (acceso limitado, diseño diferente)
5. Portal Agente Humano (sus clientes asignados)
6. Portal Owner con Reserve Dashboard (PIN 6 dígitos)
7. Sistema de consumo visual (posts usados vs plan)
8. Overage flow (comprar posts adicionales)
9. Gestión de métodos de pago (Stripe Elements)

REGLAS DE UI POR ROL:
- Cliente NO ve: costos AI, otros clientes, reservas OMEGA
- Agente ve presupuesto como 100% (es el 60% real)
- Owner ve todo + Reserve Dashboard con PIN
```

---

## 13. SISTEMA DE TRIAL 7 DÍAS

### Filosofía del trial
- Experiencia completa pero con límite TOTAL (no por día)
- El usuario puede usar cuando quiera, no se siente restringido cada día
- Ve el valor real del sistema antes de pagar
- Costo máximo por usuario en trial: ~$0.24 de AI

### Límites del trial (7 días totales)

```
TRIAL — 7 DÍAS GRATIS (tarjeta requerida)
├── 5 captions   → costo OMEGA: ~$0.01
├── 5 imágenes   → costo OMEGA: ~$0.20
├── 10 hashtags  → costo OMEGA: ~$0.02
├── 5 scripts    → costo OMEGA: ~$0.01
└── TOTAL costo por usuario: ~$0.24

100 usuarios en trial simultáneo = ~$24 de costo AI
Riesgo financiero: MÍNIMO
```

### Flujo del trial

```
DÍA 0 — REGISTRO
├── Llena datos + selecciona plan de interés
├── Agrega tarjeta (Stripe valida sin cobrar — $0)
├── Verificación de email (link de confirmación)
├── Verificación de teléfono (SMS code)
├── Mensaje claro al usuario:
│   "Tu trial de 7 días comienza ahora.
│    Tienes hasta el [fecha] a las 11:59pm para cancelar
│    sin ningún costo. Si no cancelas, se cobra
│    automáticamente el Plan Básico ($XX/mes)."
└── Acceso inmediato al portal con límites de trial

DÍAS 1-7 — TRIAL ACTIVO
├── Barra de progreso visible: "3 de 5 imágenes usadas"
├── Email día 3: "¿Cómo va tu experiencia con OMEGA?"
├── Email día 5: "Te quedan 2 días — ¿listo para continuar?"
├── Email día 6: "Mañana termina tu trial gratuito"
└── Email día 7: "Último día — cancela antes de las 11:59pm"

DÍA 8 — AUTO-CONVERSIÓN (si no canceló)
├── Stripe cobra plan básico automáticamente
├── Límites se resetean a los del plan contratado
├── Email: "Bienvenido al Plan Básico de OMEGA 🎉"
└── Puede hacer upgrade a Pro/Enterprise cuando quiera

CANCELACIÓN (si decide cancelar)
├── Puede cancelar en cualquier momento días 1-7
├── No se cobra absolutamente nada
├── Acceso continúa hasta el día 7
└── Puede volver a registrarse (con nueva tarjeta, detectado)
```

### Upgrade durante o después del trial

```
En cualquier momento el cliente puede:
├── Subir de Basic → Pro → Enterprise
├── El cobro se prora al día del upgrade
└── Los límites del plan nuevo aplican inmediatamente
```

---

## 14. SISTEMA ANTI-FRAUDE

### Capa 1 — Stripe Radar (incluido gratis)

```
├── Detecta tarjetas prepago/virtuales de un solo uso
├── Bloquea tarjetas reportadas como fraudulentas
├── Score de riesgo por transacción (0-100)
├── Reglas personalizadas configurables
└── Bloqueo automático de tarjetas de alto riesgo
```

### Capa 2 — OMEGA Internal (construir en Fase 2)

```
IDENTIFICADORES QUE SE GUARDAN AL REGISTRO:
├── Email (verificado por link)
├── Número de teléfono (verificado por SMS)
├── IP address (máx 1 trial por IP cada 90 días)
├── Browser fingerprint (device ID único)
├── Stripe card_fingerprint (única por tarjeta física)
└── Nombre completo

REGLAS DE DETECCIÓN:
├── Mismo email → bloqueado ("Ya usaste tu trial")
├── Mismo teléfono → bloqueado
├── Misma IP en últimos 90 días → alerta + review manual
├── Misma card_fingerprint → bloqueado (misma tarjeta física)
├── VPN/proxy detectado → marcar para review
└── Múltiples cuentas desde mismo dispositivo → bloquear
```

### Capa 3 — El filtro más efectivo: tarjeta requerida

```
99% de abusadores NO ponen tarjeta real.
El simple requisito de tarjeta elimina la mayoría del fraude.

Stripe verifica validez con charge de $0 (sin cobrar).
Si la tarjeta no es válida → no puede hacer trial.
```

### Mensajes al detectar fraude

```
"Esta dirección de email ya tiene una cuenta en OMEGA."
"Este número de teléfono ya está registrado."
"Ya existe una cuenta desde esta ubicación."
→ En todos los casos: "Contáctanos si crees que es un error."
```

---

## 15. ESTADO ACTUAL DEL SISTEMA

```
COMPLETADO ✅
├── 15 agentes AI en Railway
├── 84 endpoints funcionando
├── CORS configurado
├── Modelos actualizados (gpt-4o, claude-sonnet-4-5)
├── Página /content — 4 tabs 100% (GPT-4o + DALL-E 3)
└── Página /crisis — 5 paneles 100%

PENDIENTE ⏳
├── /competitive — por verificar
├── /growth — por verificar
├── /analytics — por verificar
├── /dashboard — agents 0/15 por corregir
└── Fase 2 en adelante (multi-tenant, billing, portales)
```

---

## 14. FILOSOFÍA DE DESARROLLO

```
"No velocity, only precision"
├── Calidad sobre velocidad
├── El cliente paga por resultados, no por experimentos
├── Claude es el protagonista principal de todos los agentes
├── La arquitectura se prepara para escalar desde el día 1
├── El 40% de reserva siempre nos da margen de control
└── Cada iteración alimenta el aprendizaje del sistema
```

---

*Documento generado por Claude Sonnet 4.5 | OMEGA Internal | Confidencial*
