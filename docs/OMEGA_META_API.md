# OMEGA_META_API.md
## Integración Meta for Developers — Fase Preparada
*Documento de infraestructura lista para activar*
*Raisen Omega — Febrero 2026*

---

# CONCEPTO

```
Este documento no es para implementar ahora.
Es para que cuando OMEGA necesite esta integración,
todo esté pensado, documentado y listo.

La diferencia entre:
"Hay que investigar cómo funciona Meta API desde cero" (3-4 semanas)
vs.
"Ya está todo preparado, solo activamos la fase" (3-4 días)

Eso es lo que este documento representa.
```

---

# PARTE I — QUÉ ES Y QUÉ RESUELVE

## El Problema Sin Esta Integración

```
HOY SIN META API:
  OMEGA genera contenido ✅
  OMEGA agenda en calendario ✅
  Cliente tiene que publicar manualmente ❌
  Cliente gestiona sus anuncios en Meta Ads Manager ❌
  OMEGA no sabe qué performance tiene el contenido ❌
  El loop está roto: generamos pero no cerramos el ciclo ❌

CON META API INTEGRADA:
  OMEGA genera contenido ✅
  OMEGA agenda en calendario ✅
  OMEGA publica automáticamente en Instagram/Facebook ✅
  OMEGA lee las métricas de cada publicación ✅
  OMEGA convierte el mejor contenido en anuncio con 1 clic ✅
  OMEGA optimiza las campañas de anuncios en tiempo real ✅
  El loop está completo: generamos, publicamos, medimos, optimizamos ✅
```

## Lo Que OMEGA Puede Hacer Con Acceso Meta

```
NIVEL 1 — PUBLICACIÓN ORGÁNICA:
  → Publicar posts, reels, stories en Instagram automáticamente
  → Publicar en páginas de Facebook automáticamente
  → Programar publicaciones desde el Calendario de OMEGA
  → Leer métricas: likes, comments, reach, impressions, saves
  → Responder comentarios desde OMEGA (opcional)

NIVEL 2 — INTELIGENCIA ORGÁNICA:
  → Analytics real de cada publicación (no estimado)
  → Detectar qué contenido generado por OMEGA performa mejor
  → Identificar el mejor horario real basado en datos de la cuenta
  → Alimentar a NEXUS con datos reales de performance

NIVEL 3 — ANUNCIOS PAGADOS (Marketing API):
  → Ver campañas activas del cliente
  → Crear nuevas campañas desde contenido generado en OMEGA
  → Pausar anuncios con bajo rendimiento automáticamente
  → Ajustar presupuestos según performance en tiempo real
  → Duplicar ad sets ganadores
  → Reportes de ROI de anuncios pagados en el dashboard de OMEGA
  → Convertir post orgánico viral en anuncio con 1 clic
```

---

# PARTE II — ARQUITECTURA DE LA INTEGRACIÓN

## Las Tres APIs de Meta

```
API 1 — INSTAGRAM GRAPH API
  Propósito: Publicación orgánica + métricas
  Permisos necesarios:
    instagram_basic
    instagram_content_publish
    instagram_manage_insights
    instagram_manage_comments (opcional)
  Dificultad de aprobación: MEDIA (2-4 semanas)
  Prioridad de implementación: PRIMERA

API 2 — FACEBOOK PAGES API
  Propósito: Gestión de páginas de Facebook
  Permisos necesarios:
    pages_manage_posts
    pages_read_engagement
    pages_show_list
    pages_manage_metadata
  Dificultad de aprobación: MEDIA (2-4 semanas)
  Prioridad de implementación: SEGUNDA (con la primera)

API 3 — META MARKETING API
  Propósito: Gestión de anuncios pagados
  Permisos necesarios:
    ads_management
    ads_read
    business_management
    leads_retrieval (para lead ads)
  Dificultad de aprobación: ALTA (6-12 semanas)
  Prioridad de implementación: TERCERA (cuando las anteriores estén estables)
```

## Flujo Completo de Autenticación OAuth

```
IBRAIN (una vez, para toda la plataforma):
  1. Crea App en developers.facebook.com
  2. Configura: App ID + App Secret → Railway variables
  3. Define redirect URIs: https://r-omega.agency/oauth/meta/callback
  4. Solicita permisos a Meta (proceso de review)
  5. Cuando aprueba → OMEGA puede iniciar flujos OAuth con clientes

CLIENTE DE OMEGA (por cuenta, cuando quiere conectar):
  1. Va a /configuracion/cuentas en OMEGA
  2. Clic "Conectar Instagram" o "Conectar Facebook"
  3. OMEGA redirige a:
     https://www.facebook.com/dialog/oauth?
       client_id={APP_ID}
       &redirect_uri={CALLBACK_URL}
       &scope={permisos_solicitados}
       &state={client_id_en_omega}
  4. Cliente ve el popup de Facebook y acepta
  5. Facebook redirige a OMEGA con un code temporal
  6. OMEGA intercambia el code por access_token
  7. OMEGA encripta y guarda el token en DB
  8. La cuenta queda conectada y lista

RESELLER (sus clientes siguen el mismo flujo):
  El reseller no necesita tocar nada técnico.
  Solo comparte el link de conexión a su cliente.
  OMEGA maneja todo el OAuth automáticamente.
```

---

# PARTE III — INFRAESTRUCTURA PREPARADA

## Variables de Entorno (Railway — Preparar Ahora)

```bash
# META APP CREDENTIALS (obtener en developers.facebook.com)
META_APP_ID=
META_APP_SECRET=
META_REDIRECT_URI=https://r-omega.agency/oauth/meta/callback
META_API_VERSION=v19.0

# WEBHOOK VERIFICATION (para recibir notificaciones de Meta)
META_WEBHOOK_VERIFY_TOKEN=omega_meta_webhook_2026

# FEATURE FLAGS (activar cuando estén listos)
FEATURE_META_ORGANIC=false      # Publicación orgánica
FEATURE_META_ANALYTICS=false    # Métricas de publicaciones
FEATURE_META_ADS=false          # Gestión de anuncios pagados
```

## Estructura de Archivos — Lista Para Crear

```
backend/app/integrations/meta/
│
├── __init__.py
├── meta_client.py              # Cliente base de Meta Graph API
├── oauth_handler.py            # Flujo OAuth completo
├── token_manager.py            # Gestión y refresh de tokens
│
├── organic/
│   ├── instagram_publisher.py  # Publicar en Instagram
│   ├── facebook_publisher.py   # Publicar en Facebook Pages
│   ├── media_uploader.py       # Subir fotos y videos a Meta
│   └── scheduler_connector.py  # Conecta con el Calendario de OMEGA
│
├── analytics/
│   ├── instagram_insights.py   # Métricas de posts de Instagram
│   ├── facebook_insights.py    # Métricas de páginas de Facebook
│   ├── performance_tracker.py  # Tracking de performance por publicación
│   └── nexus_feeder.py         # Alimenta datos a NEXUS
│
├── ads/
│   ├── campaign_manager.py     # CRUD de campañas
│   ├── adset_manager.py        # CRUD de ad sets
│   ├── ad_creator.py           # Crear anuncios desde contenido OMEGA
│   ├── budget_optimizer.py     # Optimización automática de presupuesto
│   ├── performance_monitor.py  # Monitoreo y alertas de performance
│   └── content_to_ad.py        # Convierte post orgánico en anuncio
│
└── webhooks/
    ├── meta_webhook_handler.py  # Recibe notificaciones de Meta
    ├── lead_webhook.py          # Lead ads → OMEGA CRM
    └── comment_webhook.py       # Notificaciones de comentarios
```

## Modelos de Base de Datos — Migración Preparada

```sql
-- =============================================
-- OMEGA META API — MIGRATION 003
-- Estado: PREPARADA, no ejecutada aún
-- Ejecutar cuando: Fase Meta se active
-- =============================================

-- Cuentas de Meta conectadas por cliente
CREATE TABLE IF NOT EXISTS meta_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  reseller_id UUID REFERENCES resellers(id) NULL,
  
  -- Tipo de cuenta
  account_type VARCHAR NOT NULL,    -- instagram_business, facebook_page, ad_account
  
  -- Identificadores de Meta
  meta_user_id VARCHAR,             -- Facebook User ID
  instagram_account_id VARCHAR,     -- Instagram Business Account ID
  facebook_page_id VARCHAR,         -- Facebook Page ID
  ad_account_id VARCHAR,            -- Ad Account ID (para anuncios)
  
  -- Info de la cuenta
  account_name VARCHAR,
  account_username VARCHAR,
  profile_picture_url VARCHAR,
  followers_count INT DEFAULT 0,
  
  -- Tokens (encriptados con AES-256)
  access_token_encrypted TEXT,      -- Token de acceso
  long_lived_token_encrypted TEXT,  -- Token de larga duración (60 días)
  token_expires_at TIMESTAMPTZ,
  
  -- Permisos otorgados
  granted_scopes JSONB DEFAULT '[]',
  
  -- Estado
  status VARCHAR DEFAULT 'active',  -- active / expired / revoked / error
  last_token_refresh TIMESTAMPTZ,
  connection_error TEXT,            -- último error si lo hay
  
  -- Features habilitadas para esta cuenta
  publishing_enabled BOOLEAN DEFAULT false,
  analytics_enabled BOOLEAN DEFAULT false,
  ads_enabled BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Publicaciones enviadas a Meta
CREATE TABLE IF NOT EXISTS meta_publications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meta_account_id UUID REFERENCES meta_accounts(id),
  client_id UUID REFERENCES clients(id),
  calendar_event_id UUID,           -- Link al evento del calendario OMEGA
  
  -- Contenido publicado
  content_type VARCHAR,             -- post, reel, story, carousel
  caption TEXT,
  media_urls JSONB DEFAULT '[]',
  hashtags JSONB DEFAULT '[]',
  
  -- IDs de Meta
  meta_media_id VARCHAR,            -- ID del container de media en Meta
  meta_post_id VARCHAR,             -- ID del post publicado
  
  -- Estado
  status VARCHAR DEFAULT 'pending', -- pending, published, failed, scheduled
  scheduled_for TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  error_message TEXT,
  retry_count INT DEFAULT 0,
  
  -- Métricas (se llenan después de publicar)
  impressions INT DEFAULT 0,
  reach INT DEFAULT 0,
  likes_count INT DEFAULT 0,
  comments_count INT DEFAULT 0,
  shares_count INT DEFAULT 0,
  saves_count INT DEFAULT 0,
  engagement_rate DECIMAL DEFAULT 0,
  metrics_updated_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Campañas de anuncios
CREATE TABLE IF NOT EXISTS meta_ad_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meta_account_id UUID REFERENCES meta_accounts(id),
  client_id UUID REFERENCES clients(id),
  
  -- IDs de Meta
  meta_campaign_id VARCHAR UNIQUE,
  
  -- Datos de la campaña
  campaign_name VARCHAR,
  objective VARCHAR,                -- AWARENESS, TRAFFIC, CONVERSIONS, etc.
  status VARCHAR DEFAULT 'PAUSED',  -- ACTIVE, PAUSED, DELETED
  
  -- Presupuesto
  daily_budget DECIMAL,
  lifetime_budget DECIMAL,
  currency VARCHAR DEFAULT 'USD',
  
  -- Fechas
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  
  -- Performance (sincronizado desde Meta)
  impressions BIGINT DEFAULT 0,
  clicks BIGINT DEFAULT 0,
  spend DECIMAL DEFAULT 0,
  cpm DECIMAL DEFAULT 0,
  cpc DECIMAL DEFAULT 0,
  ctr DECIMAL DEFAULT 0,
  conversions INT DEFAULT 0,
  cost_per_conversion DECIMAL DEFAULT 0,
  roas DECIMAL DEFAULT 0,
  metrics_updated_at TIMESTAMPTZ,
  
  -- Gestión OMEGA
  auto_optimize BOOLEAN DEFAULT false,   -- OMEGA ajusta presupuesto auto
  pause_if_cpm_above DECIMAL,            -- Pausar si CPM supera este valor
  scale_if_roas_above DECIMAL,           -- Escalar si ROAS supera este valor
  omega_notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Log de optimizaciones automáticas
CREATE TABLE IF NOT EXISTS meta_auto_optimizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES meta_ad_campaigns(id),
  
  action_type VARCHAR,              -- pause, scale, budget_increase, budget_decrease
  reason TEXT,
  before_value JSONB,               -- estado antes
  after_value JSONB,                -- estado después
  triggered_by VARCHAR DEFAULT 'omega_ai',
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Webhooks recibidos de Meta
CREATE TABLE IF NOT EXISTS meta_webhooks_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  webhook_type VARCHAR,             -- leadgen, feed, mention, etc.
  payload JSONB,
  processed BOOLEAN DEFAULT false,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_meta_accounts_client ON meta_accounts(client_id);
CREATE INDEX IF NOT EXISTS idx_meta_publications_account ON meta_publications(meta_account_id);
CREATE INDEX IF NOT EXISTS idx_meta_publications_status ON meta_publications(status);
CREATE INDEX IF NOT EXISTS idx_meta_campaigns_account ON meta_ad_campaigns(meta_account_id);
CREATE INDEX IF NOT EXISTS idx_meta_campaigns_status ON meta_ad_campaigns(status);
```

## Endpoints — Preparados Para Activar

```python
# backend/app/api/routes/meta_api.py
# Estado: PREPARADO, registrar en main.py cuando se active

router = APIRouter(prefix="/api/v1/meta", tags=["meta"])

# ─── OAUTH ───────────────────────────────────────────
# Iniciar flujo de conexión de cuenta Meta
GET  /api/v1/meta/oauth/init
     params: client_id, account_type (instagram/facebook/ads)
     → Retorna: URL de autorización de Meta

# Callback de Meta después de que usuario autoriza
GET  /api/v1/meta/oauth/callback
     params: code, state (client_id)
     → Intercambia code por token, guarda en DB

# Revocar acceso de una cuenta
DELETE /api/v1/meta/accounts/{account_id}/disconnect

# ─── CUENTAS ─────────────────────────────────────────
# Ver todas las cuentas Meta de un cliente
GET  /api/v1/meta/accounts/{client_id}

# Estado de una cuenta específica
GET  /api/v1/meta/accounts/{account_id}/status

# Refrescar token manualmente
POST /api/v1/meta/accounts/{account_id}/refresh-token

# ─── PUBLICACIÓN ORGÁNICA ────────────────────────────
# Publicar inmediatamente
POST /api/v1/meta/publish/now
     body: { account_id, content_type, caption, media_urls, hashtags }

# Publicar en horario específico (conecta con Calendario)
POST /api/v1/meta/publish/schedule
     body: { account_id, calendar_event_id, scheduled_for, ... }

# Estado de una publicación
GET  /api/v1/meta/publications/{publication_id}/status

# ─── ANALYTICS ORGÁNICOS ─────────────────────────────
# Métricas de una publicación específica
GET  /api/v1/meta/publications/{meta_post_id}/insights

# Métricas generales de la cuenta
GET  /api/v1/meta/accounts/{account_id}/insights
     params: period (day/week/month), metrics[]

# Mejor horario para publicar (basado en datos reales)
GET  /api/v1/meta/accounts/{account_id}/best-times

# ─── ANUNCIOS PAGADOS ────────────────────────────────
# Ver todas las campañas de un cliente
GET  /api/v1/meta/ads/campaigns/{client_id}

# Crear campaña desde contenido OMEGA
POST /api/v1/meta/ads/campaigns/create
     body: { account_id, objective, budget, content_id, audience, ... }

# Pausar/activar campaña
PATCH /api/v1/meta/ads/campaigns/{campaign_id}/status

# Ajustar presupuesto
PATCH /api/v1/meta/ads/campaigns/{campaign_id}/budget

# Convertir post orgánico en anuncio (el feature estrella)
POST /api/v1/meta/ads/boost-post
     body: { publication_id, budget, audience, duration_days }

# Performance en tiempo real de campañas
GET  /api/v1/meta/ads/campaigns/{campaign_id}/performance

# Optimización automática (OMEGA ajusta en base a reglas)
POST /api/v1/meta/ads/campaigns/{campaign_id}/enable-auto-optimize
     body: { pause_if_cpm_above, scale_if_roas_above }

# ─── WEBHOOKS ────────────────────────────────────────
# Endpoint que Meta llama para verificar (GET)
GET  /api/v1/meta/webhook
POST /api/v1/meta/webhook    # Recibe eventos de Meta
```

---

# PARTE IV — FEATURES POR PLAN

## Cómo Aplica a Cada Plan de OMEGA

```
PLAN BÁSICO ($97/mes):
  ✅ Conectar 1 cuenta Instagram
  ✅ Publicación automática desde Calendario
  ✅ Métricas básicas (likes, reach, impressions)
  ❌ Gestión de anuncios pagados
  ❌ Smart scheduling basado en datos reales
  Límite: 1 cuenta Meta, publicación incluida en los 2 bloques/día

PLAN PRO ($197/mes):
  ✅ Conectar hasta 5 cuentas Meta (Instagram + Facebook)
  ✅ Publicación automática multi-cuenta
  ✅ Analytics completo de publicaciones
  ✅ Smart scheduling basado en sus datos reales
  ✅ Gestión básica de anuncios (ver + pausar)
  ❌ Optimización automática de anuncios
  ❌ Conversión orgánico → anuncio con 1 clic
  Límite: 5 cuentas Meta, incluido en los 6 bloques/día

PLAN ENTERPRISE ($497/mes):
  ✅ Cuentas Meta ilimitadas
  ✅ Publicación automática en todas las cuentas
  ✅ Analytics completo con NEXUS integration
  ✅ Gestión completa de anuncios pagados
  ✅ Optimización automática con reglas de OMEGA AI
  ✅ Conversión orgánico → anuncio con 1 clic
  ✅ Reportes de ROI paid + organic combinado
  ✅ Multi-cuenta simultáneo con adaptación por plataforma

META ADS ADD-ON (cualquier plan):
  Si el cliente quiere gestión de anuncios en Básico o Pro:
  + $99/mes por cuenta de anuncio gestionada
  Incluye: creación, optimización, reporte mensual
```

## Para Resellers

```
EL RESELLER HEREDA LA INTEGRACIÓN DE OMEGA:

No necesita crear su App de Meta.
No necesita configurar nada técnico.
Solo usa la interfaz de OMEGA.

Sus clientes conectan sus cuentas con OAuth.
El reseller gestiona todo desde su panel.
OMEGA publica en nombre de los clientes del reseller.

BILLING:
  Si el cliente del reseller usa Meta Ads Add-On:
  + $99/mes → va al revenue del reseller
  OMEGA cobra su 30% sobre ese total
```

---

# PARTE V — PROCESO DE APROBACIÓN DE META

## Paso a Paso — Cuándo Empezar

```
CUÁNDO INICIAR EL PROCESO:
  ✅ Cuando OMEGA tenga 10+ clientes pagando
  ✅ Cuando el Calendario esté funcionando
  ✅ Cuando r-omega.agency tenga política de privacidad
  ✅ Cuando tengas casos de uso reales que mostrar a Meta

NO ANTES porque:
  Meta pide demostrar el uso real de la app
  Sin clientes es difícil justificar los permisos
  El review process requiere screenshots/videos de la app funcionando

TIEMPO ESTIMADO DEL PROCESO COMPLETO:
  Semana 1: Crear app + configuración básica (gratis, inmediato)
  Semana 2-4: Solicitar permisos básicos de publicación
  Semana 4-8: Review de Meta + posibles preguntas/correcciones
  Semana 8-12: Aprobación de publicación orgánica ✅
  Semana 8-20: Review de Marketing API (ads) — más lento y estricto
```

## Documentación Que Meta Pedirá

```
PARA PERMISOS DE PUBLICACIÓN:
  □ Política de privacidad (URL pública en r-omega.agency)
  □ Términos de servicio (URL pública)
  □ Video demo de cómo OMEGA usa los permisos
  □ Descripción detallada del caso de uso
  □ Screenshots de la app funcionando

PARA MARKETING API (anuncios):
  □ Todo lo anterior
  □ Business Verification de tu empresa
  □ Explicación de por qué necesitas acceso programático a ads
  □ Cómo proteges los datos del cliente
  □ Proceso de onboarding del cliente (el flujo OAuth documentado)
  □ Política de manejo de datos de anunciantes

POLÍTICA DE PRIVACIDAD MÍNIMA PARA META:
  Debe incluir:
  → Qué datos recolectas de Meta
  → Cómo los usas
  → Con quién los compartes
  → Cómo el usuario puede revocar acceso
  → Datos de contacto (Raisen / OMEGA)
```

---

# PARTE VI — SEGURIDAD ESPECÍFICA DE META

## Protección de Tokens OAuth

```
LOS TOKENS DE META SON COMO CONTRASEÑAS:

NUNCA:
  ❌ Guardar en texto plano en la DB
  ❌ Loggear en ningún sistema de logs
  ❌ Enviar al frontend
  ❌ Incluir en respuestas de API
  ❌ Commitear en GitHub

SIEMPRE:
  ✅ Encriptar con AES-256 antes de guardar en DB
  ✅ Desencriptar solo cuando se va a usar, en memoria
  ✅ La clave de encriptación solo existe en Railway variables
  ✅ Refresh proactivo antes de que expiren (día 55 de 60)
  ✅ Invalidar inmediatamente si el cliente revoca acceso

LONG-LIVED TOKENS (60 días):
  Los tokens iniciales de Meta duran 1-2 horas.
  OMEGA los intercambia automáticamente por long-lived tokens.
  Un job diario verifica cuáles están próximos a expirar.
  El refresh es invisible para el cliente.
```

## Verificación de Webhooks de Meta

```python
# meta_webhook_security.py

def verify_meta_webhook(request_body: bytes, x_hub_signature: str) -> bool:
    """
    Meta firma cada webhook con HMAC-SHA256.
    Si la firma no coincide → el webhook es falso → rechazar.
    """
    expected_signature = hmac.new(
        META_APP_SECRET.encode(),
        request_body,
        hashlib.sha256
    ).hexdigest()
    
    received = x_hub_signature.replace("sha256=", "")
    return hmac.compare_digest(expected_signature, received)

# NUNCA procesar un webhook sin verificar primero.
# Un webhook falso podría inyectar datos maliciosos.
```

---

# PARTE VII — DASHBOARD META EN OMEGA

## UI Para Clientes

```
/configuracion/cuentas/meta

SECCIÓN: Mis Cuentas de Meta

Estado general: 🟢 2 cuentas conectadas

LISTA DE CUENTAS:
┌──────────────────────────────────────────────────────┐
│ 📸 Instagram Business                                │
│    @miempresa_pr                                      │
│    12,400 seguidores                                  │
│    Token: ✅ Válido hasta 15 Mar 2026                 │
│    Features: Publicación ✅ Analytics ✅ Ads ❌       │
│    [Gestionar] [Desconectar]                          │
├──────────────────────────────────────────────────────┤
│ 📘 Facebook Page                                     │
│    Mi Empresa PR                                      │
│    8,200 seguidores                                   │
│    Token: ✅ Válido hasta 15 Mar 2026                 │
│    Features: Publicación ✅ Analytics ✅ Ads ❌       │
│    [Gestionar] [Desconectar]                          │
└──────────────────────────────────────────────────────┘

[+ Conectar cuenta de Meta] → Inicia OAuth

[+ Conectar cuenta de anuncios] → Requiere plan Pro/Enterprise
```

## UI Para Super Admin (Ibrain)

```
/superadmin/meta

OVERVIEW GLOBAL:
  Cuentas Meta conectadas total: 847
  Instagram accounts: 634
  Facebook Pages: 520
  Ad Accounts: 156

  Publicaciones programadas hoy: 1,247
  Publicaciones exitosas hoy: 1,198 (96%)
  Publicaciones fallidas hoy: 49 (4%) — ver detalle

  Campañas de anuncios activas: 89
  Inversión gestionada este mes: $45,230
  ROAS promedio de clientes: 3.2x

ALERTAS META:
  ⚠️ 12 tokens próximos a expirar (renovar antes del 20 Feb)
  🔴 3 publicaciones fallaron — token inválido (cliente revocó acceso)
  💡 23 campañas con ROAS <1.5 — sugerencia: pausar o ajustar

ESTADO DE LA APP META:
  App Status: ✅ Aprobada
  Permisos orgánicos: ✅ Activos
  Marketing API: ⏳ En revisión / ✅ Aprobada
  Rate limit usage: 23% del límite diario
```

---

# PARTE VIII — ROADMAP DE ACTIVACIÓN

## Las 4 Sub-Fases de Esta Integración

```
SUB-FASE META-A — PREPARACIÓN (hacer ahora, sin costo):
  □ Crear cuenta en developers.facebook.com
  □ Crear la app "OMEGA by Raisen"
  □ Obtener App ID y App Secret
  □ Agregar variables a Railway (vacías o de prueba)
  □ Crear política de privacidad en r-omega.agency
  □ Crear los archivos de infraestructura (estructura vacía)
  □ Ejecutar migration SQL 003 (tablas listas, sin datos)
  □ Registrar el router en main.py con feature flag = false
  
  Resultado: Infraestructura lista, sin funcionar aún.
  Tiempo: 1-2 días de trabajo
  Costo: $0

SUB-FASE META-B — PUBLICACIÓN ORGÁNICA (cuando haya 10+ clientes):
  □ Iniciar proceso de aprobación de permisos de publicación
  □ Implementar flujo OAuth (instagram_publisher.py)
  □ Conectar con Calendario de OMEGA
  □ Activar feature flag: FEATURE_META_ORGANIC=true
  □ Beta testing con 3-5 clientes voluntarios
  □ Fix de bugs y estabilización
  □ Activar para todos los planes
  
  Resultado: Publicación automática real en Instagram/Facebook
  Tiempo: 4-8 semanas (incluye aprobación de Meta)
  Costo: Solo tiempo de desarrollo

SUB-FASE META-C — ANALYTICS PROFUNDO (cuando B esté estable):
  □ Implementar instagram_insights.py
  □ Conectar con NEXUS (nexus_feeder.py)
  □ Smart scheduling basado en datos reales de la cuenta
  □ Dashboard de analytics en OMEGA con datos reales de Meta
  □ Reemplazar métricas estimadas por métricas reales
  
  Resultado: OMEGA sabe exactamente qué funciona para cada cliente
  Tiempo: 2-3 semanas de desarrollo

SUB-FASE META-D — ANUNCIOS PAGADOS (cuando haya 50+ clientes):
  □ Iniciar aprobación de Marketing API (proceso largo)
  □ Mientras tanto: implementar campaign_manager.py
  □ UI de campañas en OMEGA (ver, pausar, ajustar)
  □ content_to_ad.py — el feature estrella
  □ budget_optimizer.py — optimización automática
  □ Activar feature flag: FEATURE_META_ADS=true
  □ Meta Ads como add-on de revenue adicional
  
  Resultado: OMEGA gestiona paid + organic en un solo lugar
  Tiempo: 8-16 semanas (incluye aprobación de Marketing API)
  Costo adicional: Considerar costo de llamadas a Marketing API
```

---

# CONCLUSIÓN

```
OMEGA_META_API.md es un plano de construcción.

No se construye hoy.
Se construye cuando el negocio lo requiera.

Pero cuando llegue ese momento,
no habrá que investigar, no habrá que diseñar,
no habrá que tomar decisiones desde cero.

Solo habrá que decir:
"Activemos Sub-Fase META-B"

Y el equipo sabrá exactamente qué hacer,
cómo hacerlo, y en cuánto tiempo.

Eso es lo que significa estar preparado.
No apurado. Preparado.
```

