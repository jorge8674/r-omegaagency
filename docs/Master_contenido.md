# MASTER_CONTENIDO.md
## OMEGA — Sistema de Contenido Ultra Avanzado
*Documento de arquitectura y producto — Febrero 2026*

---

# VISIÓN GENERAL

El generador de contenido de OMEGA pasa de ser una herramienta de creación
a un **ecosistema de contenido inteligente** que conecta generación, 
optimización, programación y publicación automática en un solo flujo.

```
FLUJO MAESTRO:
Contexto Cliente → Prompt Optimizado → Generación Multi-Modal
→ Edición/Refinamiento → Agendado → Publicación Automática
                                      ↓
                              Análisis de Performance
```

---

# MÓDULO 1 — AGENTES DE VIDEO (Nueva Categoría Premium)

## 1.1 Stack de Video AI

| Agente | API | Especialidad | Costo por video |
|--------|-----|-------------|-----------------|
| KlingVideoAgent | Kling.ai API | Videos 5-10s realistas, motion | $X |
| Veo3Agent | Google Veo 3 API | Cinematic quality, 4K | $XX |
| RunwayAgent | Runway ML API | Edición + generación | $X |
| PikaAgent | Pika Labs API | Animaciones, transiciones | $X |
| SoraAgent | OpenAI Sora API | Videos largos, storytelling | $XX |

## 1.2 Modelo de Precios — Video Add-On

Video NO está incluido en ningún plan. Es un add-on de consumo:

```
PAQUETES DE VIDEO (cliente elige):
Pack Starter:   5 videos/mes   → $49/mes
Pack Creator:   15 videos/mes  → $129/mes
Pack Agency:    50 videos/mes  → $379/mes
Pack Unlimited: Ilimitado      → $799/mes

PRECIO POR VIDEO SUELTO (sin pack):
Video corto (5-10s):  $12/video
Video medio (15-30s): $25/video
Video largo (60s+):   $49/video

CALIDAD:
Standard (720p):  precio base
HD (1080p):       +30%
4K (Veo3/Sora):   +80%
```

## 1.3 Endpoints Backend (nuevos agentes)

```python
POST /api/v1/video/generate-short      # 5-10s con Kling
POST /api/v1/video/generate-cinematic  # Veo3 calidad cinemática
POST /api/v1/video/animate-image       # Imagen → Video (Runway)
POST /api/v1/video/generate-reel       # Optimizado para Reels/TikTok
POST /api/v1/video/add-captions        # Subtítulos automáticos AI
POST /api/v1/video/status/{job_id}     # Status de generación (async)
GET  /api/v1/video/history             # Historial de videos generados
GET  /api/v1/video/credits             # Créditos disponibles del cliente
```

## 1.4 UI — Pestaña Video en Contenido

```
TAB: 🎬 Video (badge "PREMIUM")

SECCIÓN 1 — Tipo de Video:
  [Reel 9:16] [TikTok 9:16] [Story 9:16]
  [YouTube 16:9] [Ad Horizontal] [Square 1:1]

SECCIÓN 2 — Motor AI:
  ○ Kling.ai    — Realismo, personas, movimiento natural
  ○ Veo 3       — Calidad cinemática, escenas complejas  
  ○ Runway      — Edición, efectos, transiciones
  ○ Pika        — Animaciones, motion graphics
  ○ Sora        — Narrativa larga, storytelling

SECCIÓN 3 — Prompt + Referencia:
  [Textarea] Describe el video que quieres...
  [🔮 Optimizar Prompt] → PromptOptimizerAgent
  Upload: Imagen de referencia (estilo/composición)
  Upload: Video de referencia (movimiento/ritmo)
  Upload: PDF/MD con instrucciones prehechas

SECCIÓN 4 — Configuración:
  Duración: [5s] [10s] [15s] [30s] [60s]
  Calidad: [Standard] [HD] [4K]
  Audio: [Sin audio] [Música AI] [Voz en off]
  Idioma subtítulos: [ES] [EN] [Ninguno]

BOTÓN: [Generar Video] — muestra costo estimado antes

RESULTADO:
  Preview player inline
  Barra de progreso (generación async 30-120s)
  Botones: [Descargar] [Agendar] [Regenerar] [Editar]
```

---

# MÓDULO 2 — GENERADOR DE IMÁGENES ULTRA AVANZADO

## 2.1 Formatos y Tamaños

```
REDES SOCIALES:
  Instagram Post:      1080x1080 (1:1)
  Instagram Landscape: 1080x566  (1.91:1)
  Instagram Portrait:  1080x1350 (4:5)
  Instagram Story:     1080x1920 (9:16)
  Instagram Carrusel:  1080x1080 (múltiples slides)
  
  TikTok:              1080x1920 (9:16)
  TikTok Cover:        1080x1920
  
  Facebook Post:       1200x628
  Facebook Story:      1080x1920
  Facebook Cover:      1640x624
  Facebook Profile:    170x170
  
  Twitter/X Post:      1200x675
  Twitter Header:      1500x500
  
  LinkedIn Post:       1200x627
  LinkedIn Banner:     1128x191
  LinkedIn Profile:    400x400
  
  YouTube Thumbnail:   1280x720
  YouTube Banner:      2560x1440
  
  Pinterest:           1000x1500 (2:3)

MARKETING:
  Banner Web:          728x90, 300x250, 160x600
  Email Header:        600x200
  Presentación:        1920x1080

PERSONALIZADO: W x H libre
```

## 2.2 Upload de Imagen de Referencia

```
MODOS DE USO:
  ① Referencia de estilo:
     "Genera algo nuevo con este estilo/paleta/composición"
  
  ② Edición/Retoque:
     "Modifica esta imagen específica:
      - Cambia el fondo
      - Añade/elimina elementos
      - Ajusta colores/iluminación
      - Cambia texto/logos"
  
  ③ Variaciones:
     "Genera 4 variaciones de esta imagen"
  
  ④ Upscale:
     "Mejora la calidad/resolución de esta imagen"

FORMATOS ACEPTADOS: JPG, PNG, WEBP (max 10MB)
CANVAS EDIT: Editor inline básico post-generación
```

## 2.3 Upload de Documentos con Instrucciones

```
FORMATOS: PDF, .md, .txt

CASOS DE USO:
  - Brand guidelines del cliente (colores, fuentes, estilo)
  - Brief de campaña completo
  - Instrucciones de tono y voz de marca
  - Restricciones específicas (qué NO hacer)
  - Templates de prompt prehechos

FLUJO:
  1. Cliente sube su PDF de brand guidelines
  2. AgentContextProcessor extrae reglas clave
  3. Cada generación de imagen aplica esas reglas automáticamente
  4. Guidelines guardadas en perfil del cliente (persistente)
```

## 2.4 Carrusel Inteligente

```
GENERADOR DE CARRUSEL:
  Slides: [2] [3] [4] [5] [6] [7] [8] [10]
  Tema del carrusel: [input]
  
  El agente genera:
  - Slide 1: Hook/portada impactante
  - Slides 2-N-1: Contenido/valor progresivo
  - Slide N: CTA + datos de contacto
  
  Coherencia visual entre slides garantizada
  Mismo estilo, paleta, tipografía en todos
  
  Export: ZIP con slides individuales + versión PDF
```

---

# MÓDULO 3 — AGENTE OPTIMIZADOR DE PROMPTS

## 3.1 PromptOptimizerAgent

```python
# backend/app/agents/prompt_optimizer_agent.py

Función: Toma un prompt básico/vago y lo convierte en
         un prompt profesional ultra-específico

ENTRADA: "foto de café para instagram"

SALIDA:
"Fotografía de café en taza de cerámica artesanal blanca,
vapor suave ascendente, iluminación natural de ventana
lateral, bokeh suave en fondo, paleta de colores tierra
y crema, estilo editorial minimalista, ángulo superior
45 grados, grano de película sutil, mood: acogedor y
premium. Optimizado para Instagram 1:1, alta resolución."

PARAMETROS DE OPTIMIZACIÓN:
  - Plataforma destino (Instagram/TikTok/LinkedIn)
  - Tono de marca del cliente (del perfil guardado)
  - Estilo preferido (del historial de aprobaciones)
  - Restricciones (palabras/elementos prohibidos)
  - Idioma del prompt (ES → prompt en EN para mejor resultado)
```

## 3.2 Repositorio de Prompts

```
FUENTES INTEGRADAS:
  - PromptHero (API/scraping)
  - Civitai prompts database
  - PromptBase marketplace
  - Repositorio propio OMEGA (curado)
  - Historial de prompts exitosos del cliente

BÚSQUEDA POR:
  - Categoría (food, fashion, real estate, tech...)
  - Plataforma (Instagram, TikTok, LinkedIn...)
  - Estilo (minimalista, vibrante, dark, editorial...)
  - Performance histórica (los más virales)

FLUJO:
  1. Cliente escribe tema básico: "comida saludable"
  2. Sistema busca top 10 prompts de esa categoría
  3. Los adapta al brand voice del cliente
  4. Cliente elige o combina
  5. PromptOptimizer hace el refinamiento final
```

## 3.3 Endpoints

```python
POST /api/v1/prompt/optimize          # Prompt básico → ultra avanzado
POST /api/v1/prompt/generate-from-topic  # Tema → prompt completo
GET  /api/v1/prompt/repository        # Buscar en repositorio
POST /api/v1/prompt/save              # Guardar prompt exitoso
GET  /api/v1/prompt/history/{client_id}  # Prompts guardados del cliente
POST /api/v1/prompt/rate              # Calificar prompt (feedback loop)
```

---

# MÓDULO 4 — SISTEMA DE CONTEXTO POR CLIENTE

## 4.1 Onboarding Inteligente (CRÍTICO)

```
CUANDO SE CREA UN CLIENTE NUEVO:

PASO 1 — Formulario de Contexto Inicial:
  Nombre del negocio
  Industria/nicho
  Descripción del negocio (500 chars)
  Público objetivo (edad, género, intereses)
  Tono de comunicación (profesional/casual/inspiracional...)
  Competidores principales
  Plataformas donde opera
  Objetivo principal (ventas/awareness/comunidad/leads)
  Colores de marca + logo (upload)
  Palabras clave de marca
  Palabras/temas PROHIBIDOS
  URL web + redes sociales

PASO 2 — Análisis Automático:
  ClientContextAgent analiza:
  - La web del cliente (scraping)
  - Sus redes sociales actuales
  - El tono de su contenido existente
  - Sus mejores posts históricos
  - Sus competidores

PASO 3 — Generación del Client Brief:
  Documento AI generado con:
  - Perfil completo del cliente
  - Estrategia de contenido sugerida
  - Línea editorial base
  - Restricciones y consideraciones
  - KPIs objetivo

PASO 4 — Brief inyectado en CADA generación:
  Cada vez que se genera contenido para ese cliente,
  el brief completo se incluye en el contexto del agente
  = Resultados siempre alineados al cliente
```

## 4.2 Context Update (Adaptive AI)

```
CUANDO CLIENTE ACTUALIZA SU INFORMACIÓN:

  1. Cliente edita su perfil/brief
  2. ClientContextAgent detecta el cambio
  3. Regenera el brief actualizado
  4. Marca el contenido previo como "pre-actualización"
  5. Nuevas generaciones usan el contexto nuevo

TIPOS DE ACTUALIZACIÓN:
  - Cambio de línea de producto
  - Nuevo público objetivo
  - Rebranding (nuevo logo/colores)
  - Nueva campaña especial
  - Cambio de tono de comunicación

MEMORIA PERSISTENTE:
  Tabla: client_context
  Versioning de contextos (puede revertir)
  Historial de cambios con fecha
```

## 4.3 Tabla DB: client_context

```sql
CREATE TABLE client_context (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id),
  version INT DEFAULT 1,
  business_name VARCHAR,
  industry VARCHAR,
  business_description TEXT,
  target_audience JSONB,
  communication_tone VARCHAR,
  competitors JSONB,
  platforms JSONB,
  primary_goal VARCHAR,
  brand_colors JSONB,
  logo_url VARCHAR,
  keywords JSONB,
  forbidden_words JSONB,
  forbidden_topics JSONB,
  website_url VARCHAR,
  social_urls JSONB,
  ai_generated_brief TEXT,
  custom_instructions TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

# MÓDULO 5 — CALENDARIO Y PUBLICACIÓN AUTOMÁTICA

## 5.1 Bloques de Publicación por Plan

```
PLAN BÁSICO:
  - 2 bloques por día
  - 1 cuenta de red social
  - Publicación: Manual (descarga + publica tú)
  - Agendado: Solo guarda en calendario

PLAN PRO:
  - 6 bloques por día  
  - 3 cuentas de redes sociales
  - Publicación: Semi-automática (aprueba + publica)
  - Agendado: Con notificación push

PLAN ENTERPRISE:
  - Bloques ilimitados por día
  - Cuentas ilimitadas
  - Publicación: 100% automática
  - Agendado: AI sugiere mejores horarios
  - Publicación simultánea multi-cuenta

UN BLOQUE = Conjunto de:
  Imagen O Video + Caption + Hashtags + CTA
  (todo generado por OMEGA para esa publicación)
```

## 5.2 Flujo Guardar → Calendario

```
FLUJO DESDE GENERADOR DE CONTENIDO:

1. Agente genera: imagen + caption + hashtags ✅

2. Botones de acción post-generación:
   [⬇ Descargar]  [📅 Agendar]  [♻️ Regenerar]  [✏️ Editar]

3. Clic en [📅 Agendar]:
   → Modal de agendado:
     Selector de fecha y hora
     Cuenta de red social destino (dropdown de cuentas conectadas)
     Plataforma: [Instagram] [TikTok] [Facebook] [LinkedIn] [Twitter]
     Formato: [Post] [Story] [Reel] [Carrusel]
     Vista previa del bloque completo
     [Confirmar Agendado]

4. El bloque aparece en el Calendario:
   → Color por cliente (si es agente con múltiples clientes)
   → Color por plataforma
   → Indicador de status: Agendado / Publicado / Fallido

5. En la fecha/hora → publicación automática vía APIs:
   Instagram Graph API
   TikTok API
   Facebook Pages API
   LinkedIn API
   Twitter/X API
```

## 5.3 Vista Calendario Avanzada

```
VISTAS: [Mes] [Semana] [Día] [Lista]

FILTROS:
  Por cliente (si agente tiene varios)
  Por plataforma
  Por status (agendado/publicado/borrador/fallido)
  Por tipo de contenido (imagen/video/carrusel)

DRAG & DROP:
  Mover publicaciones entre fechas/horas

SMART SCHEDULING (Enterprise):
  AI sugiere mejores horarios basado en:
  - Historial de engagement del cliente
  - Trends de la plataforma
  - Comportamiento del público objetivo
  Horarios sugeridos aparecen como "slots dorados" ✨

VISTA DE CLIENTE:
  Cliente (sin acceso al sistema OMEGA) puede:
  - Ver su calendario de publicaciones
  - Aprobar/rechazar contenido pendiente
  - Ver analytics de cada publicación

LÍMITES DE BLOQUES:
  Básico: barra de progreso 0/2 por día
  Pro:    barra de progreso 0/6 por día
  Enterprise: sin límite visible
```

## 5.4 Cuentas Conectadas (Multi-cuenta)

```
CONFIGURACIÓN POR CLIENTE:
  → /configuracion/cuentas

  Tabla de cuentas conectadas:
  Plataforma | Cuenta | Status | Último sync | Acciones

  Botones de conexión OAuth:
  [+ Conectar Instagram]
  [+ Conectar TikTok]
  [+ Conectar Facebook]
  [+ Conectar LinkedIn]
  [+ Conectar Twitter/X]

PUBLICACIÓN SIMULTÁNEA (Pro/Enterprise):
  Al agendar → selector múltiple de cuentas
  "Publicar en: [✓ Instagram] [✓ TikTok] [ ] Facebook"
  Adapta formato automáticamente por plataforma
  (crop/resize para cada red social)

TABLA DB: connected_accounts
  client_id, platform, account_name, account_id,
  access_token (encrypted), refresh_token (encrypted),
  expires_at, status, followers_count
```

---

# MÓDULO 6 — NUEVOS AGENTES ESPECIALIZADOS

## 6.1 Lista Completa de Agentes Nuevos

```
AGENTES DE VIDEO:
  KlingVideoAgent     → Videos realistas 5-30s
  Veo3Agent           → Calidad cinemática 4K
  RunwayAgent         → Edición + efectos
  PikaAgent           → Animaciones
  SoraAgent           → Videos largos narrativos
  VideoCaptionAgent   → Subtítulos + captions automáticos

AGENTES DE OPTIMIZACIÓN:
  PromptOptimizerAgent → Prompts básicos → ultra avanzados
  PromptRepositoryAgent → Búsqueda en repositorios
  ContentAdaptorAgent   → Adapta contenido por plataforma
  FormatOptimizerAgent  → Optimiza tamaño/formato por red social

AGENTES DE CONTEXTO:
  ClientContextAgent    → Analiza y mantiene el brief del cliente
  WebScraperAgent       → Extrae info de web del cliente
  SocialAnalyzerAgent   → Analiza RRSS actuales del cliente
  CompetitorWatchAgent  → Monitoreo continuo de competidores

AGENTES DE PUBLICACIÓN:
  InstagramPublisherAgent → Publica vía Instagram Graph API
  TikTokPublisherAgent    → Publica vía TikTok API
  FacebookPublisherAgent  → Publica vía Facebook Pages API
  LinkedInPublisherAgent  → Publica vía LinkedIn API
  TwitterPublisherAgent   → Publica vía Twitter/X API
  PublicationSchedulerAgent → Orquesta todos los publishers

AGENTES DE ANALYTICS POST-PUBLICACIÓN:
  PostPerformanceAgent    → Métricas por publicación
  EngagementTrackerAgent  → Seguimiento de engagement
  ROICalculatorAgent      → ROI de cada contenido
  ViralPredictorAgent     → Predice performance antes de publicar
```

## 6.2 Total Agentes del Sistema

```
Agentes existentes:     15
Agentes nuevos Fase 3:  22
─────────────────────────
TOTAL AGENTES OMEGA:    37 agentes especializados
TOTAL ENDPOINTS:        150+ endpoints
```

---

# MÓDULO 7 — UI/UX DEL GENERADOR DE CONTENIDO

## 7.1 Nuevo Layout (3 columnas en desktop)

```
┌─────────────────────────────────────────────────────────┐
│  COLUMNA 1 (280px)  │  COLUMNA 2 (flex)  │  COL 3 (320px) │
│  Panel de Config    │  Editor/Resultado   │  Contexto      │
├─────────────────────┼────────────────────┼────────────────┤
│                     │                    │                │
│ Tipo de contenido   │  [TABS]            │ Cliente activo │
│ ○ Imagen            │  Imagen | Video    │ ─────────────  │
│ ○ Video             │  Carrusel | Copy   │ Brief resumen  │
│ ○ Carrusel          │                    │ Tono: casual   │
│ ○ Copy              │  [PROMPT AREA]     │ Plataforma:    │
│                     │                    │ Instagram      │
│ Plataforma          │  + Optimizar IA    │                │
│ [Selector]          │  + Subir referencia│ Bloques hoy:   │
│                     │  + Subir PDF/MD    │ ████░░ 4/6     │
│ Formato/Tamaño      │                    │                │
│ [Selector]          │  [GENERAR] →       │ Cuentas:       │
│                     │                    │ @cliente_ig    │
│ Calidad             │  [RESULTADO]       │ @cliente_tk    │
│ [Standard/HD/4K]    │  Preview           │                │
│                     │  [↓][📅][♻][✏]    │ Historial      │
│ Pack de video       │                    │ últimas 5      │
│ [Gestionar]         │                    │ generaciones   │
└─────────────────────┴────────────────────┴────────────────┘
```

## 7.2 Editor Post-Generación

```
CUANDO SE GENERA UNA IMAGEN:

ACCIONES RÁPIDAS (barra sobre la imagen):
  [📐 Redimensionar]  → cambia tamaño para otra plataforma
  [🎨 Variar estilo]  → misma composición, otro estilo
  [✏️ Editar]         → editor básico inline
  [🔍 Upscale]        → aumenta resolución 2x/4x
  [🖼 Fondo nuevo]    → cambia solo el fondo
  [📝 Añadir texto]   → overlay de texto sobre imagen

EDITOR INLINE BÁSICO:
  Crop/resize libre
  Brightness/contrast
  Saturación/temperatura
  Añadir logo del cliente
  Añadir watermark
  Texto overlay con fuentes

PARA CARRUSEL:
  Reordenar slides (drag)
  Editar slide individual
  Cambiar tema de color
  Previsualizar como carrusel real
```

---

# MÓDULO 8 — MODELO DE PRECIOS ACTUALIZADO

## 8.1 Planes Base (sin video)

```
PLAN BÁSICO — $97/mes
  ✓ 2 bloques de contenido por día
  ✓ Imagen + caption + hashtags
  ✓ 1 cuenta de red social
  ✓ Todos los formatos de imagen
  ✓ Contexto de cliente básico
  ✗ Video
  ✗ Publicación automática
  ✗ Multi-cuenta

PLAN PRO — $197/mes
  ✓ 6 bloques de contenido por día
  ✓ Todo del Básico
  ✓ 3 cuentas de redes sociales
  ✓ Publicación semi-automática
  ✓ Prompt optimizer
  ✓ Carruseles completos
  ✓ Upload de referencias
  ✓ PDF/MD instructions
  ✓ Smart scheduling
  ✗ Video (add-on disponible)

PLAN ENTERPRISE — $497/mes
  ✓ Bloques ilimitados
  ✓ Todo del Pro
  ✓ Cuentas ilimitadas
  ✓ Publicación 100% automática
  ✓ Multi-cuenta simultáneo
  ✓ AI smart scheduling
  ✓ Analytics post-publicación
  ✓ API access
  ✓ White-label disponible (add-on)
  ✓ Contexto avanzado + web scraping
```

## 8.2 Add-Ons (todos los planes)

```
VIDEO GENERATION:
  Pack Starter   5 videos/mes   $49
  Pack Creator   15 videos/mes  $129
  Pack Agency    50 videos/mes  $379
  Pack Unlimited Ilimitado      $799

POR VIDEO SUELTO (sin pack):
  Corto 5-10s    $12
  Medio 15-30s   $25
  Largo 60s+     $49
  4K Premium     +80%

WHITE-LABEL RESELLER ADD-ON:  $299/mes (requiere Enterprise)

AGENTE HUMANO ADD-ON:
  4h/mes:   $149
  8h/mes:   $279
  20h/mes:  $599
```

---

# MÓDULO 9 — FASES DE IMPLEMENTACIÓN

## Fase 3A — Contexto de Cliente (Semana 7)

```
Prioridad 1 — Alto impacto, base de todo:
  □ Tabla client_context en DB
  □ Formulario de onboarding completo
  □ ClientContextAgent (analiza web + RRSS)
  □ Inyección de contexto en CADA generación
  □ UI de edición de contexto por cliente
  □ Sistema de versioning de contexto
```

## Fase 3B — Generador Avanzado (Semana 8)

```
Prioridad 2 — Potencia el arma principal:
  □ Selector de formatos/tamaños (todos los descritos)
  □ Upload de imagen de referencia + modos de uso
  □ Upload PDF/MD con instrucciones
  □ PromptOptimizerAgent
  □ Repositorio de prompts integrado
  □ Generador de carrusel inteligente
  □ Editor post-generación básico
  □ Nuevo layout 3 columnas
```

## Fase 3C — Calendario + Publicación (Semana 9)

```
Prioridad 3 — Cierra el loop de valor:
  □ Botón [Agendar] en generador
  □ Modal de agendado con selector de cuenta
  □ Límites de bloques por plan
  □ OAuth conexión de cuentas (Instagram primero)
  □ CalendarView mejorado con colores
  □ Drag & drop de publicaciones
  □ PublicationSchedulerAgent
  □ InstagramPublisherAgent (primero)
  □ Notificaciones de publicación
```

## Fase 3D — Video AI (Semana 10)

```
Prioridad 4 — Revenue adicional:
  □ KlingVideoAgent (primero, mejor relación precio/calidad)
  □ Tab de video en generador
  □ Sistema de créditos/packs de video
  □ Flujo async de generación con status
  □ Veo3Agent (segundo)
  □ VideoCaptionAgent
  □ RunwayAgent (edición)
```

## Fase 3E — Analytics Cierre del Loop (Semana 11)

```
Prioridad 5 — Retención y prueba de valor:
  □ PostPerformanceAgent
  □ Dashboard analytics por publicación
  □ EngagementTrackerAgent
  □ ROICalculatorAgent
  □ ViralPredictorAgent
  □ Reportes de performance por cliente
```

---

# MÓDULO 10 — LO QUE ESTO CAMBIA EN OMEGA

## Antes vs Después

```
ANTES (Fase 1):
  Cliente pide contenido → OMEGA genera texto/imagen
  Cliente descarga → Cliente publica manualmente
  = Valor: ahorrar tiempo de creación

DESPUÉS (Fase 3 completa):
  Cliente configura su contexto una vez
  OMEGA genera basado en su historial y brief
  OMEGA agenda en el mejor horario
  OMEGA publica automáticamente
  OMEGA mide el performance
  OMEGA optimiza la próxima publicación
  = Valor: agencia completa en piloto automático
```

## Posicionamiento Competitivo

```
Hootsuite:     Scheduling ✓  |  AI Content ✗  |  Video AI ✗
Buffer:        Scheduling ✓  |  AI básico ✓   |  Video AI ✗
Sprout Social: Analytics ✓   |  AI básico ✓   |  Video AI ✗
Jasper:        Copy ✓        |  Imagen básica ✓| Video AI ✗
Later:         Visual plan ✓ |  AI básico ✓   |  Video AI ✗

OMEGA Fase 3:
  ✓ Scheduling automático
  ✓ AI Content ultra avanzado
  ✓ Video AI (Kling + Veo3 + Runway)
  ✓ Contexto de cliente persistente
  ✓ Multi-plataforma + multi-cuenta
  ✓ Analytics post-publicación
  ✓ Prompt optimizer
  ✓ White-label reseller
  ✓ Agente humano incluido

= NO HAY COMPETIDOR QUE TENGA TODO ESTO JUNTO
```

---

# CONCLUSIÓN

OMEGA en Fase 3 no es un software de marketing. 
Es una **agencia de marketing digital autónoma** 
que cualquier empresa puede contratar por $97-$497/mes.

El generador de contenido pasa de ser una feature 
a ser el **núcleo de un producto de categoría única**.

La combinación de:
- Contexto de cliente persistente (AI que te conoce)
- Generación multi-modal (texto, imagen, video)
- Publicación automática multi-plataforma
- Analytics de cierre del loop

...crea un sistema donde el cliente solo necesita 
**aprobar** — no crear, no publicar, no analizar.

**Ese es el producto que vale $497/mes y más.**


---

# MÓDULO 11 — SISTEMA MULTI-CUENTA Y SELECTOR DE CONTEXTO

## El Problema Real

```
SIN ESTE MÓDULO:
  Reseller con 20 clientes → ¿para cuál está generando?
  Cliente con Instagram fitness + LinkedIn consultoría → ¿qué tono usa?
  Agente humano con 8 cuentas → tiene que recordar todo manualmente

CON ESTE MÓDULO:
  Abres página de contenido
  Seleccionas: Cliente → Cuenta → Nicho
  El AI ya sabe TODO sobre esa combinación específica
  Genera perfecto desde el primer intento
```

## 11.1 Arquitectura de Identidades

```
JERARQUÍA COMPLETA:

RESELLER (opcional)
  └── CLIENTE
        └── CUENTA (red social + handle)
              └── NICHO/PERFIL DE CONTENIDO
                    └── BRIEF + CONTEXTO AI

EJEMPLO REAL:
  Reseller: Agencia Juan PR
    Cliente: Restaurante El Morro
      Cuenta: @elmorro_ig (Instagram)
        Nicho A: "Platos del día — tono casual, fotos de comida"
        Nicho B: "Eventos privados — tono premium, fotografía editorial"
      Cuenta: @elmorro_fb (Facebook)
        Nicho A: "Promociones — tono familiar, llamada a la acción"
    
    Cliente: Gym FitLife
      Cuenta: @fitlifePR (Instagram)
        Nicho A: "Motivación — tono enérgico, personas entrenando"
        Nicho B: "Nutrición — tono educativo, infografías"
      Cuenta: @fitlifePR (TikTok)
        Nicho A: "Challenges — tono viral, trending sounds"
```

## 11.2 Selector de Contexto en Página de Contenido

```
UBICACIÓN: Barra fija en la parte superior de /contenido
(siempre visible, antes del generador)

┌─────────────────────────────────────────────────────────────┐
│  🎯 GENERANDO PARA:                                         │
│                                                             │
│  [Cliente ▼]    [Cuenta ▼]    [Nicho/Perfil ▼]   [✓ Listo] │
│  Gym FitLife    @fitlifePR    💪 Motivación                 │
│                 Instagram                                    │
│                                                             │
│  Tono: Enérgico | Plataforma: Instagram | Formato: Reel    │
│  Bloques hoy: ████░░ 4/6 | Próx. publicación: 6:00pm       │
└─────────────────────────────────────────────────────────────┘

CASCADA DE SELECCIÓN (cada selector filtra el siguiente):

PASO 1 — Selector de Cliente:
  Si es CLIENTE DIRECTO: solo ve sus propias cuentas
  Si es RESELLER/AGENTE: ve todos sus clientes + cuentas
  Búsqueda: puede escribir para filtrar
  
  Dropdown:
  ─ MIS CUENTAS (cliente directo)
  ○ Restaurante El Morro
  ○ Gym FitLife ← seleccionado
  ─ (reseller ve múltiples clientes aquí)

PASO 2 — Selector de Cuenta:
  Filtra las cuentas del cliente seleccionado
  Muestra: logo plataforma + handle + followers
  
  Dropdown:
  📸 @fitlifePR — Instagram (12.4K seguidores)
  🎵 @fitlifePR — TikTok (8.1K seguidores) ← seleccionado
  💼 FitLife PR — LinkedIn (890 seguidores)

PASO 3 — Selector de Nicho/Perfil:
  Filtra los nichos configurados para esa cuenta
  
  Dropdown:
  💪 Motivación (posts de entrenamiento)
  🥗 Nutrición (infografías y tips)
  📢 Promociones (ofertas y descuentos)
  [+ Añadir nuevo nicho]

RESULTADO INSTANTÁNEO:
  Al seleccionar el nicho → el AI carga:
  - Brief completo del cliente
  - Tono específico de ese nicho
  - Ejemplos de posts exitosos
  - Hashtags pre-configurados
  - Restricciones y guidelines
  - Historial de generaciones anteriores
```

## 11.3 Configuración de Nichos (Onboarding de Cuenta)

```
PRIMERA VEZ QUE SE AGREGA UNA CUENTA:

Modal: "Configura esta cuenta para que el AI la conozca"

TAB 1 — Identidad de la Cuenta:
  Handle/username
  Plataforma
  URL del perfil
  Descripción en 2 líneas: "¿De qué trata esta cuenta?"

TAB 2 — Audiencia:
  Edad predominante: [18-24] [25-34] [35-44] [45+]
  Género: [Mayormente F] [Mayormente M] [Mixto]
  Ubicación principal: [campo libre]
  Intereses: [tags, máx 10]

TAB 3 — Nichos de Contenido:
  El cliente define sus "modos" de contenido:
  
  [+ Añadir Nicho]
  
  Por cada nicho:
  Nombre del nicho: [ej: "Motivación fitness"]
  Descripción: [qué tipo de contenido va aquí]
  Tono: [selector: Profesional/Casual/Enérgico/Inspiracional/Educativo/Humorístico]
  Tipo de contenido predominante: [Foto/Video/Carrusel/Infografía]
  Ejemplos (opcional): [URLs de posts que les gusten como referencia]
  Hashtags base: [hasta 20 hashtags pre-configurados]
  Frecuencia: [diario/3x semana/semanal]

TAB 4 — Restricciones:
  Temas prohibidos: [lista]
  Palabras prohibidas: [lista]
  Competidores a NO mencionar: [lista]
  Elementos visuales a evitar: [descripción]

TAB 5 — Instrucciones Especiales (PDF/MD):
  Upload de brand guidelines
  Upload de brief de campaña actual
  El AI extrae las reglas y las aplica siempre

→ [Guardar y Activar Cuenta] → AI genera brief automático
```

## 11.4 Límites por Plan — Lógica de Negocio

```
PLAN BÁSICO — $97/mes:
  Cuentas: 1 cuenta (1 plataforma)
  Nichos por cuenta: 2 máximo
  Bloques por día: 2
  Historial de contexto: 30 días
  
  LÓGICA: El cliente básico es un negocio pequeño
  con 1 presencia social. Dos nichos le bastan
  (ej: productos + behind the scenes).

PLAN PRO — $197/mes:
  Cuentas: 5 cuentas (múltiples plataformas)
  Nichos por cuenta: 5 máximo
  Bloques por día: 6 (total entre todas las cuentas)
  Historial de contexto: 90 días
  Multi-cuenta simultánea: Sí (misma publicación → varias cuentas)
  
  LÓGICA: Negocio mediano o creador serio con
  presencia en varias plataformas. 5x5 = 25 
  combinaciones de contexto posibles.

PLAN ENTERPRISE — $497/mes:
  Cuentas: Ilimitadas
  Nichos por cuenta: Ilimitados
  Bloques por día: Ilimitados
  Historial de contexto: Permanente
  Multi-cuenta simultánea: Sí, con adaptación automática por plataforma
  Acceso para agentes humanos: Hasta 3 agentes
  
  LÓGICA: Agencia o marca grande. Necesita manejar
  múltiples clientes/marcas sin fricción.

RESELLER (Enterprise + White-Label):
  Sus clientes tienen los límites de su plan
  Reseller puede ver y gestionar todas las cuentas de sus clientes
  Dashboard reseller muestra: total cuentas gestionadas, total bloques usados

TRIAL 7 DÍAS:
  Acceso completo a Pro
  1 cuenta, 3 nichos, 3 bloques/día
  Tarjeta requerida (cobra al día 8 si no cancela)
  Al vencer: downgrade a Básico o upgrade manual
  Email día 5: "Tu trial termina en 2 días"
  Email día 7: "Último día — elige tu plan"
```

## 11.5 Memoria y Aprendizaje por Cuenta

```
EL AI APRENDE DE CADA CUENTA:

SEÑALES POSITIVAS (el AI refuerza):
  ✓ Post agendado y no editado → le gustó al cliente
  ✓ Post con engagement alto → funcionó bien
  ✓ Nicho usado frecuentemente → es prioridad

SEÑALES NEGATIVAS (el AI ajusta):
  ✗ Post regenerado múltiples veces → algo no cuadra
  ✗ Post eliminado del calendario → no fue aprobado
  ✗ Caption editado manualmente → el tono no era correcto

RESULTADO DESPUÉS DE 30 DÍAS:
  El AI conoce tan bien la cuenta que el primer
  resultado generado ya tiene 80%+ de probabilidad
  de ser aprobado sin edición.

TABLA DB: account_learning
  account_id, signal_type, content_id,
  original_output, final_output (si fue editado),
  was_published, engagement_score,
  learning_weight, created_at
```

## 11.6 Cambio Rápido de Contexto (Power Feature)

```
PARA AGENTES/RESELLERS QUE MANEJAN MUCHAS CUENTAS:

ATAJOS DE TECLADO:
  Cmd/Ctrl + K → abre búsqueda rápida de cuenta
  Cmd/Ctrl + 1-9 → cambia a cuenta favorita N

FAVORITOS:
  Pin de las cuentas más usadas en el top del selector
  Orden drag & drop

HISTORIAL RECIENTE:
  Las últimas 5 cuentas usadas aparecen primero

MODO BATCH (Enterprise):
  Generar el mismo concepto para múltiples cuentas:
  "Genera el post de lunes para TODAS mis cuentas"
  → El AI adapta el mensaje a cada cuenta/nicho/tono
  → Revisas los N posts generados en una vista grid
  → Apruebas/editas/agendas cada uno
```

## 11.7 Vista Grid Multi-Cuenta (Enterprise)

```
CUANDO SE SELECCIONA "TODAS LAS CUENTAS":

Vista grid horizontal:

┌─────────────┬─────────────┬─────────────┬─────────────┐
│ @fitlife_ig │ @fitlife_tk │ @elmorro_ig │ @elmorro_fb │
│ Motivación  │ Challenge   │ Platos día  │ Promociones │
├─────────────┼─────────────┼─────────────┼─────────────┤
│ [Preview]   │ [Preview]   │ [Preview]   │ [Preview]   │
│ imagen      │ video       │ imagen      │ imagen      │
├─────────────┼─────────────┼─────────────┼─────────────┤
│ Caption...  │ Caption...  │ Caption...  │ Caption...  │
├─────────────┼─────────────┼─────────────┼─────────────┤
│ [✓ Agendar] │ [✓ Agendar] │ [✗ Editar]  │ [✓ Agendar] │
└─────────────┴─────────────┴─────────────┴─────────────┘

Una sola acción genera N versiones adaptadas.
Un solo clic agenda todo lo aprobado.
```

## 11.8 Tabla DB: accounts y account_niches

```sql
-- Cuentas de redes sociales por cliente
CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id),
  reseller_id UUID REFERENCES resellers(id) NULL,
  platform VARCHAR NOT NULL,        -- instagram/tiktok/facebook/linkedin/twitter
  handle VARCHAR NOT NULL,          -- @username
  platform_account_id VARCHAR,      -- ID de la plataforma
  display_name VARCHAR,
  profile_url VARCHAR,
  followers_count INT DEFAULT 0,
  access_token TEXT,                -- encrypted
  refresh_token TEXT,               -- encrypted
  token_expires_at TIMESTAMPTZ,
  status VARCHAR DEFAULT 'active',  -- active/disconnected/error
  is_favorite BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Nichos/perfiles de contenido por cuenta
CREATE TABLE account_niches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
  name VARCHAR NOT NULL,            -- "Motivación fitness"
  description TEXT,
  tone VARCHAR DEFAULT 'casual',    -- professional/casual/energetic/inspirational/educational/humorous
  content_types JSONB DEFAULT '[]', -- [photo, video, carousel, infographic]
  base_hashtags JSONB DEFAULT '[]', -- hasta 20 hashtags
  frequency VARCHAR DEFAULT 'daily',
  reference_post_urls JSONB DEFAULT '[]',
  forbidden_topics JSONB DEFAULT '[]',
  forbidden_words JSONB DEFAULT '[]',
  brand_guidelines_url VARCHAR,     -- PDF subido
  ai_brief TEXT,                    -- brief generado automáticamente por AI
  is_active BOOLEAN DEFAULT true,
  usage_count INT DEFAULT 0,        -- cuántas veces se ha usado
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Aprendizaje por cuenta
CREATE TABLE account_learning (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID REFERENCES accounts(id),
  niche_id UUID REFERENCES account_niches(id),
  content_id UUID,
  signal_type VARCHAR,              -- approved/rejected/edited/published/high_engagement
  original_output TEXT,
  final_output TEXT,
  was_published BOOLEAN DEFAULT false,
  engagement_score DECIMAL DEFAULT 0,
  learning_weight DECIMAL DEFAULT 1.0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 11.9 Endpoints Nuevos Necesarios

```python
# Cuentas
GET    /api/v1/accounts/{client_id}/all          # todas las cuentas del cliente
POST   /api/v1/accounts/create                   # crear cuenta
PATCH  /api/v1/accounts/{id}/update              # actualizar cuenta
DELETE /api/v1/accounts/{id}                     # eliminar cuenta
POST   /api/v1/accounts/{id}/connect-oauth       # conectar con OAuth
GET    /api/v1/accounts/{id}/status              # verificar token válido

# Nichos
GET    /api/v1/accounts/{id}/niches              # todos los nichos de una cuenta
POST   /api/v1/accounts/{id}/niches/create       # crear nicho
PATCH  /api/v1/niches/{id}/update                # actualizar nicho
DELETE /api/v1/niches/{id}                       # eliminar nicho
POST   /api/v1/niches/{id}/generate-brief        # AI genera brief del nicho

# Contexto unificado (el más importante)
GET    /api/v1/context/{client_id}/{account_id}/{niche_id}
  → Devuelve el contexto completo para inyectar en el AI:
    client brief + account info + niche brief + 
    learning history + active campaign + restrictions
  → Este endpoint se llama CADA VEZ que el selector cambia

# Multi-cuenta batch
POST   /api/v1/content/generate-batch
  Body: { prompt, account_niche_pairs: [{account_id, niche_id}] }
  → Genera N versiones adaptadas en paralelo
```

## 11.10 UX de Primera Vez vs Recurrente

```
PRIMERA VEZ (cliente nuevo):

  Pantalla de bienvenida en /contenido:
  
  "👋 Bienvenido a OMEGA Contenido
   Para que el AI genere resultados perfectos,
   necesitamos conocer tu(s) cuenta(s).
   
   [+ Configurar mi primera cuenta] ← CTA principal
   
   Solo toma 3 minutos y el AI recordará 
   todo para siempre."

RECURRENTE (cliente con cuentas configuradas):

  Selector pre-cargado con la última selección
  Si tiene 1 cuenta + 1 nicho → carga automático
  Si tiene múltiples → muestra la última usada
  
  Indicador de "memoria activa":
  🧠 "Basado en 47 generaciones anteriores para esta cuenta"
```

---

# RESUMEN EJECUTIVO — POR QUÉ ESTO ES DECISIVO

```
EL PROBLEMA DEL MERCADO HOY:
  Todas las herramientas son agnósticas al cliente.
  ChatGPT no sabe quién es tu cliente.
  Canva no recuerda tu marca.
  Hootsuite no adapta el tono por cuenta.
  
  Resultado: El usuario tiene que repetir el contexto
  cada vez. Eso mata la productividad.

LA SOLUCIÓN OMEGA:
  Una vez configuras → siempre sabe.
  Cambia de cuenta → el AI cambia de personalidad.
  Añades nueva cuenta → das contexto una sola vez.
  
  Resultado: En 10 segundos tienes contenido
  perfectamente alineado a ESA cuenta específica.

EL VALOR REAL PARA EL RESELLER:
  Maneja 30 clientes con 80 cuentas en total.
  Cmd+K → busca "fitlife" → selecciona → genera.
  El AI ya sabe todo sobre FitLife sin que el
  agente tenga que recordar nada.
  
  = Un agente puede manejar 3x más clientes
    con la misma calidad. Eso vale $497/mes.
```

