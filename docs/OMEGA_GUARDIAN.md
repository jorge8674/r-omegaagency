# OMEGA_GUARDIAN.md
## GUARDIAN — Sistema de Defensa, Seguridad y Mantenimiento Autónomo
*El ejército de agentes que vive dentro del proyecto*
*Raisen Omega — Febrero 2026*

---

# CONCEPTO

```
GUARDIAN no es un agente. Es un ejército.

Mientras Ibrain duerme, GUARDIAN no duerme.
Mientras el equipo trabaja en features, GUARDIAN patrulla.
Mientras los clientes usan la plataforma, GUARDIAN los protege.

GUARDIAN es la razón por la que OMEGA puede decir:
"Construido para durar décadas, no meses."

Misión: Que el sistema sea tan sólido, tan vigilado,
y tan autocorrectivo que ningún hacker, ningún bug,
y ningún fallo técnico pueda dañar a OMEGA ni a sus clientes.
```

---

# PARTE I — ARQUITECTURA DEL EJÉRCITO

## Los 7 Escuadrones de GUARDIAN

```
ESCUADRÓN 1: SENTINEL — Seguridad y Defensa
  Protege contra hackers, SQL injection, rate limiting,
  auth bypass, exposición de datos de clientes y tarjetas.

ESCUADRÓN 2: INSPECTOR — Auditoría de Código
  Recorre CADA línea de código de backend y frontend.
  Detecta vulnerabilidades, código muerto, deuda técnica.

ESCUADRÓN 3: MEDIC — Salud del Sistema
  Monitorea uptime, latencia, errores, memory leaks.
  Auto-repara lo que puede. Alerta lo que no puede.

ESCUADRÓN 4: COMPLIANCE — Regulación y Datos
  GDPR, PCI DSS (tarjetas), CCPA, privacidad de usuarios.
  Audita que OMEGA cumpla con todas las regulaciones.

ESCUADRÓN 5: PERFORMANCE — Optimización Continua
  Detecta queries lentas, endpoints con alta latencia,
  componentes React que renderizan de más.

ESCUADRÓN 6: PROPHET — Anticipación de Riesgos
  Analiza patrones para predecir problemas antes de que ocurran.
  "Este endpoint va a fallar en 3 días si no se escala."

ESCUADRÓN 7: CHRONICLER — Memoria del Sistema
  Documenta CADA cambio, CADA decisión, CADA incidente.
  Genera reportes semanales para Ibrain.
  Mantiene el historial completo del proyecto vivo.
```

---

# PARTE II — ESCUADRÓN 1: SENTINEL (Seguridad)

## 2.1 Amenazas que SENTINEL Neutraliza

```
CAPA 1 — AUTENTICACIÓN Y AUTORIZACIÓN:
  □ JWT tokens con expiración correcta (15min access, 7d refresh)
  □ Verificación de rol en CADA endpoint (no solo en el frontend)
  □ Rate limiting por IP y por usuario
  □ Brute force protection en login (bloqueo tras 5 intentos)
  □ Session invalidation al cambiar contraseña
  □ Tokens de un solo uso para reset de contraseña
  □ 2FA obligatorio para Super Admin (Ibrain)
  □ 2FA opcional para resellers (recomendado)

CAPA 2 — PROTECCIÓN DE DATOS:
  □ Nunca exponer service_role key en frontend
  □ Nunca loggear contraseñas, tokens, o datos de tarjetas
  □ Sanitización de TODOS los inputs antes de queries SQL
  □ Parámetros preparados (nunca SQL string concatenation)
  □ Campos sensibles encriptados en DB (tokens OAuth, tarjetas)
  □ Variables de entorno NUNCA en el código fuente
  □ .gitignore verificado — ningún .env en GitHub

CAPA 3 — PROTECCIÓN DE API:
  □ CORS configurado correctamente (solo dominios permitidos)
  □ Rate limiting por endpoint (ej: /generate máx 10 req/min)
  □ Request size limits (evitar ataques de payload gigante)
  □ Headers de seguridad HTTP (HSTS, CSP, X-Frame-Options)
  □ API keys rotación automática cada 90 días
  □ Webhook signature verification (Stripe, etc.)

CAPA 4 — PROTECCIÓN DE TARJETAS Y PAGOS:
  □ NUNCA almacenar números de tarjeta en OMEGA DB
  □ Todo manejo de tarjetas exclusivamente vía Stripe
  □ PCI DSS compliance — solo usar Stripe Elements/Checkout
  □ Stripe webhooks verificados con signature secret
  □ Alertas automáticas ante pagos fallidos o fraude detectado
  □ Logs de auditoría de TODAS las transacciones

CAPA 5 — INFRAESTRUCTURA:
  □ Railway environment variables — nunca en código
  □ Supabase RLS policies en TODAS las tablas
  □ Storage bucket — verificar permisos de archivos
  □ No exponer puertos innecesarios
  □ DDoS protection vía Cloudflare
  □ Backup automático de DB cada 24h
```

## 2.2 SENTINEL — Agentes Específicos

```python
# backend/app/security/sentinel/

auth_guardian.py
  → Verifica JWT en cada request
  → Valida rol del usuario vs. endpoint requerido
  → Registra intentos fallidos de autenticación
  → Bloquea IPs con comportamiento sospechoso

input_sanitizer.py
  → Sanitiza TODOS los inputs entrantes
  → Detecta patrones de SQL injection
  → Detecta patrones de XSS
  → Detecta payloads maliciosos
  → Valida tipos de datos antes de cualquier operación

rate_limiter.py
  → Rate limiting por IP (global)
  → Rate limiting por usuario (por endpoint)
  → Rate limiting por API key
  → Backoff exponencial para reintentadores
  → Redis para almacenar contadores de rate

pci_guardian.py
  → Verifica que ningún dato de tarjeta toque la DB de OMEGA
  → Audita logs buscando números de tarjeta accidentales
  → Verifica que Stripe es el único procesador
  → Genera reporte de compliance PCI mensual

data_encryptor.py
  → Encripta tokens OAuth de redes sociales
  → Encripta datos sensibles de clientes
  → Gestiona rotación de claves de encriptación
  → AES-256 para datos en reposo
  → TLS 1.3 para datos en tránsito
```

## 2.3 Dashboard de Seguridad (Super Admin)

```
/superadmin/guardian/security

PANEL EN TIEMPO REAL:
  🟢 Estado general: SEGURO / 🔴 ALERTA ACTIVA

  MÉTRICAS EN VIVO:
  ├── Intentos de login fallidos (últimas 24h): 47
  ├── IPs bloqueadas actualmente: 3
  ├── Requests rechazados por rate limit: 234
  ├── Ataques SQL injection bloqueados: 0
  └── Webhooks verificados correctamente: 100%

  ÚLTIMOS EVENTOS DE SEGURIDAD:
  [timestamp] IP 192.168.x.x bloqueada — 5 intentos fallidos
  [timestamp] Rate limit activado — endpoint /api/v1/content/generate
  [timestamp] Token expirado rechazado — user@email.com

  ALERTAS PENDIENTES:
  [Ninguna] ✅

  ACCIONES RÁPIDAS:
  [Bloquear IP] [Revocar Token] [Forzar 2FA] [Ver Logs Completos]
```

---

# PARTE III — ESCUADRÓN 2: INSPECTOR (Auditoría de Código)

## 3.1 Qué Audita INSPECTOR

```
AUDITORÍA CONTINUA DEL REPOSITORIO:

BACKEND (Railway/FastAPI):
  □ Cada endpoint tiene verificación de auth
  □ Todos los inputs tienen validación Pydantic
  □ No hay credenciales hardcodeadas
  □ No hay prints/logs de datos sensibles
  □ Todas las queries usan parámetros preparados
  □ Error handlers no exponen stack traces en producción
  □ Dependencias sin vulnerabilidades conocidas (CVE check)
  □ Requirements.txt sin versiones inseguras

FRONTEND (Lovable/Next.js):
  □ No hay API keys en el código del cliente
  □ Variables de entorno correctamente nombradas (NEXT_PUBLIC_ solo para públicas)
  □ Componentes sin memory leaks (useEffect cleanup)
  □ No hay console.log con datos sensibles
  □ Formularios con validación en cliente Y servidor
  □ No hay fetch directo a Supabase con service_role desde el frontend

BASE DE DATOS (Supabase):
  □ RLS habilitado en TODAS las tablas
  □ Políticas RLS correctamente definidas
  □ Índices en columnas de búsqueda frecuente
  □ No hay datos sensibles en columnas sin encriptar
  □ Foreign keys con ON DELETE configurado correctamente
```

## 3.2 INSPECTOR — Proceso Automatizado

```
FRECUENCIA DE AUDITORÍA:
  Cada push a GitHub → scan automático (CI/CD)
  Cada domingo → auditoría completa profunda
  Cada mes → reporte ejecutivo para Ibrain

HERRAMIENTAS INTEGRADAS:
  Bandit → seguridad de código Python
  Safety → vulnerabilidades en dependencias Python
  ESLint → código JavaScript/TypeScript
  Semgrep → patrones de seguridad multi-lenguaje
  GitLeaks → detección de secretos en commits
  Trivy → vulnerabilidades en containers Docker

PROCESO:
  1. Push a GitHub
  2. GitHub Actions activa los scanners
  3. Si encuentra vulnerabilidad crítica → bloquea el merge
  4. Si encuentra warning → crea issue automáticamente
  5. Slack/email notification a Ibrain
  6. Log en /superadmin/guardian/code-audit
```

## 3.3 El Recorrido Completo del Proyecto

```
INSPECTOR hace esto CADA SEMANA:

PASO 1 — Inventario de archivos:
  Lista TODOS los archivos del proyecto
  Detecta archivos nuevos (¿fueron agregados intencionalmente?)
  Detecta archivos eliminados (¿fue intencional?)
  Detecta archivos modificados (¿qué cambió exactamente?)

PASO 2 — Análisis de cada endpoint:
  Para CADA endpoint en el backend:
  → ¿Tiene auth verificación?
  → ¿Tiene rate limiting?
  → ¿Tiene validación de input?
  → ¿Maneja errores correctamente?
  → ¿Los logs son seguros?

PASO 3 — Análisis de la base de datos:
  Para CADA tabla:
  → ¿Tiene RLS?
  → ¿Las políticas son correctas?
  → ¿Hay datos sensibles sin encriptar?
  → ¿Los índices están optimizados?

PASO 4 — Análisis de dependencias:
  → ¿Hay CVEs conocidos en las versiones usadas?
  → ¿Hay versiones desactualizadas críticas?
  → ¿Hay dependencias que ya no se usan?

PASO 5 — Reporte:
  Score de salud del código: 0-100
  Issues críticos: lista con solución sugerida
  Issues de advertencia: lista
  Mejoras recomendadas: lista priorizada
```

---

# PARTE IV — ESCUADRÓN 3: MEDIC (Salud del Sistema)

## 4.1 Qué Monitorea MEDIC

```
SALUD EN TIEMPO REAL (cada 30 segundos):

RAILWAY (FastAPI):
  ├── Uptime: 99.9% objetivo
  ├── Response time promedio: <200ms objetivo
  ├── Error rate: <0.1% objetivo
  ├── Memory usage: <80% del límite
  ├── CPU usage: <70% promedio
  └── Requests en cola: <100

SUPABASE:
  ├── Connection pool: uso vs. disponible
  ├── Query time promedio: <50ms objetivo
  ├── Storage usado vs. disponible
  ├── Realtime connections activas
  └── Auth requests por minuto

FRONTEND (r-omega.agency):
  ├── Time to First Byte (TTFB): <200ms
  ├── Core Web Vitals (LCP, FID, CLS)
  ├── Error rate JavaScript (window.onerror)
  └── Disponibilidad desde múltiples regiones

AGENTES AI:
  ├── Agentes online vs. offline
  ├── Tiempo de respuesta por agente
  ├── Tasa de éxito por agente
  └── Tokens consumidos por hora (costo OpenAI/Anthropic)
```

## 4.2 Auto-Reparación

```
LO QUE MEDIC PUEDE REPARAR AUTOMÁTICAMENTE:

✅ Restart de servicio caído (Railway auto-restart)
✅ Limpieza de cache cuando memoria sube >85%
✅ Cierre de conexiones DB zombie
✅ Retry automático de webhooks fallidos
✅ Reconexión de agentes AI caídos
✅ Limpieza de logs antiguos (>30 días)
✅ Rotación de archivos de log muy grandes

LO QUE MEDIC ALERTA (no puede reparar solo):
⚠️ Supabase sin espacio en storage
⚠️ Rate limits de OpenAI/Anthropic alcanzados
⚠️ Stripe webhook fallando repetidamente
⚠️ Error en deployment de Railway
⚠️ Certificado SSL próximo a vencer
⚠️ Backup de DB fallido
```

## 4.3 Sistema de Alertas por Severidad

```
NIVEL 1 — CRÍTICO (alerta inmediata, 24/7):
  → SMS + Email + Push notification a Ibrain
  → El sistema está completamente caído
  → Brecha de seguridad detectada
  → Datos de clientes potencialmente comprometidos
  → Stripe dejó de procesar pagos

NIVEL 2 — URGENTE (alerta en <15 minutos):
  → Email + Push notification
  → Un agente AI caído por más de 5 minutos
  → Error rate >5% en los últimos 10 minutos
  → Response time >2 segundos por más de 5 minutos
  → Intento de hack detectado

NIVEL 3 — WARNING (alerta en <1 hora):
  → Email
  → Performance degradada pero funcional
  → Dependencia con CVE descubierta
  → Storage de DB al 70%
  → Reseller con mora >7 días

NIVEL 4 — INFO (reporte diario):
  → Resumen diario de salud del sistema
  → Métricas de uso por cliente
  → Costo de APIs consumido
  → Patrones inusuales detectados
```

---

# PARTE V — ESCUADRÓN 4: COMPLIANCE

## 5.1 GDPR y Privacidad

```
REQUERIMIENTOS IMPLEMENTADOS:

DERECHOS DEL USUARIO:
  □ Derecho al olvido: endpoint para eliminar todos los datos
  □ Portabilidad: exportar todos sus datos en JSON
  □ Acceso: ver qué datos tiene OMEGA sobre ellos
  □ Rectificación: corregir datos incorrectos

CONSENTIMIENTO:
  □ Checkbox explícito en registro (no pre-marcado)
  □ Política de privacidad clara y accesible
  □ Registro de consentimiento con timestamp
  □ Opt-out de emails de marketing

RETENCIÓN DE DATOS:
  □ Datos de clientes inactivos: purgar después de 2 años
  □ Logs de seguridad: retener 1 año
  □ Datos financieros: retener 7 años (obligación legal)

TRANSFERS:
  □ Documentar qué datos van a Railway (US)
  □ Documentar qué datos van a Supabase (AWS)
  □ Documentar qué datos van a Stripe
  □ SCCs (Standard Contractual Clauses) si aplica
```

## 5.2 PCI DSS (Tarjetas de Crédito)

```
NIVEL DE COMPLIANCE OBJETIVO: SAQ A (el más simple)
Solo aplica cuando NUNCA tocas datos de tarjeta directamente.

REGLAS ABSOLUTAS:
  ✅ Solo Stripe Elements/Checkout para capturar tarjetas
  ✅ NUNCA pedir número de tarjeta en formularios propios
  ✅ NUNCA almacenar CVV (ni temporalmente)
  ✅ NUNCA almacenar número de tarjeta completo
  ✅ Almacenar solo Stripe payment_method_id (token)
  ✅ HTTPS obligatorio en todas las páginas de pago
  ✅ Stripe webhook con signature verification

AUDITORÍA MENSUAL POR COMPLIANCE AGENT:
  → Verificar que no hay campos de tarjeta en formularios propios
  → Verificar que los logs no contienen números de tarjeta
  → Verificar que la DB no tiene columnas de tarjeta sin tokenizar
  → Generar certificado de compliance mensual
```

---

# PARTE VI — ESCUADRÓN 5: PERFORMANCE

## 6.1 Optimización Continua

```
BACKEND:
  □ Query analyzer en Supabase — detecta queries lentas
  □ Índices sugeridos automáticamente por patrones de uso
  □ Cache de respuestas frecuentes (Redis)
  □ Paginación en TODOS los endpoints de lista
  □ Compression de respuestas (gzip)
  □ Connection pooling optimizado

FRONTEND:
  □ Bundle size monitoring (alerta si sube >10%)
  □ Image optimization (WebP automático)
  □ Lazy loading de componentes pesados
  □ Code splitting por ruta
  □ Prefetch de páginas más visitadas

AI AGENTS:
  □ Caché de respuestas similares (evitar tokens innecesarios)
  □ Prompt optimization (menos tokens = menos costo)
  □ Batch requests cuando es posible
  □ Fallback a modelos más baratos para tareas simples
  □ Monitoreo de costo por cliente (para billing justo)
```

---

# PARTE VII — ESCUADRÓN 6: PROPHET (Anticipación)

## 7.1 Predicciones Que PROPHET Hace

```
PROPHET analiza patrones históricos para predecir:

CAPACIDAD:
  "Al ritmo actual de crecimiento, Supabase Pro
   se quedará sin storage en 47 días."
   → Alerta 30 días antes con solución sugerida

  "Los endpoints de video generation van a necesitar
   horizontal scaling cuando superes 200 usuarios simultáneos.
   Estimas llegar a ese punto en ~3 meses con el crecimiento actual."

SEGURIDAD:
  "Hay 3 IPs que han intentado login fallido 4 veces.
   Aún no llegan al límite de bloqueo (5), pero el patrón
   sugiere un ataque coordinado inminente."
   → Pre-bloqueo preventivo sugerido

NEGOCIO:
  "3 clientes no han generado contenido en 14 días.
   Históricamente, clientes inactivos por 21+ días
   tienen 78% probabilidad de churn."
   → Alerta de intervención sugerida antes de que cancelen

TÉCNICO:
  "El endpoint /api/v1/content/generate tiene memory leak.
   La memoria sube 0.3MB por request sin liberarse.
   Al ritmo actual, el servidor necesitará restart en ~72 horas."
   → Fix sugerido antes de que el problema sea visible
```

---

# PARTE VIII — ESCUADRÓN 7: CHRONICLER (Memoria)

## 8.1 Qué Documenta CHRONICLER

```
CADA CAMBIO EN EL SISTEMA:
  → Quién hizo el cambio
  → Qué cambió exactamente
  → Por qué (si hay commit message)
  → Cuándo
  → Impacto: ¿algo se rompió después?

CADA INCIDENTE:
  → Qué pasó
  → Cuándo empezó y terminó
  → Cuántos clientes afectados
  → Cómo se resolvió
  → Tiempo de resolución
  → Cómo prevenir que pase de nuevo

CADA DECISIÓN TÉCNICA:
  → Qué se decidió
  → Las alternativas consideradas
  → Por qué se tomó esa decisión
  → Quién la tomó
  → Fecha

MÉTRICAS DIARIAS:
  → Uptime del día
  → Requests procesados
  → Errores y su tipo
  → Costo de APIs
  → Clientes activos
  → Revenue del día
```

## 8.2 Reportes Automáticos para Ibrain

```
REPORTE DIARIO (7am):
  ─────────────────────────────────────
  OMEGA Guardian — Reporte Diario
  Fecha: [fecha]
  ─────────────────────────────────────
  🟢 Estado general: SALUDABLE
  
  Uptime ayer: 99.98%
  Requests procesados: 24,847
  Errores: 12 (0.05%) — todos resueltos automáticamente
  Costo APIs (OpenAI+Anthropic): $23.40
  Clientes activos: 147
  Revenue del día: $4,720
  
  🔐 Seguridad: Sin incidentes
  ⚡ Performance: Nominal
  📊 Sin alertas pendientes
  ─────────────────────────────────────

REPORTE SEMANAL (lunes 9am):
  Resumen de la semana
  Tendencias detectadas
  Issues resueltos automáticamente
  Issues que requieren atención de Ibrain
  Proyecciones de capacidad para próximas 4 semanas
  Recomendaciones de optimización
  Costo total de infraestructura

REPORTE MENSUAL:
  Auditoría completa de código
  Reporte de compliance (GDPR + PCI)
  Análisis de seguridad profundo
  Evolución de métricas del mes
  Plan de acción para el mes siguiente
  Aprendizajes del sistema NEXUS del mes
```

---

# PARTE IX — IMPLEMENTACIÓN

## 9.1 Archivos del Sistema GUARDIAN

```
backend/
├── guardian/
│   ├── sentinel/
│   │   ├── auth_guardian.py
│   │   ├── input_sanitizer.py
│   │   ├── rate_limiter.py
│   │   ├── pci_guardian.py
│   │   └── data_encryptor.py
│   │
│   ├── inspector/
│   │   ├── code_auditor.py
│   │   ├── dependency_scanner.py
│   │   ├── db_auditor.py
│   │   └── secrets_detector.py
│   │
│   ├── medic/
│   │   ├── health_monitor.py
│   │   ├── auto_repair.py
│   │   ├── alert_dispatcher.py
│   │   └── uptime_tracker.py
│   │
│   ├── compliance/
│   │   ├── gdpr_agent.py
│   │   ├── pci_compliance.py
│   │   └── data_retention.py
│   │
│   ├── performance/
│   │   ├── query_analyzer.py
│   │   ├── cache_manager.py
│   │   └── cost_optimizer.py
│   │
│   ├── prophet/
│   │   ├── capacity_predictor.py
│   │   ├── churn_predictor.py
│   │   ├── security_prophet.py
│   │   └── tech_debt_forecaster.py
│   │
│   └── chronicler/
│       ├── change_logger.py
│       ├── incident_tracker.py
│       ├── report_generator.py
│       └── decision_recorder.py
│
├── .github/
│   └── workflows/
│       ├── security_scan.yml     → en cada push
│       ├── dependency_check.yml  → diario
│       └── weekly_audit.yml      → domingo
```

## 9.2 Dashboard GUARDIAN (Super Admin)

```
RUTA: /superadmin/guardian

OVERVIEW:
  Estado general del sistema (semáforo)
  7 escuadrones con su estado individual
  Alertas activas ordenadas por severidad
  Métricas en tiempo real

SUB-PÁGINAS:
  /superadmin/guardian/security      → SENTINEL dashboard
  /superadmin/guardian/code-audit    → INSPECTOR reportes
  /superadmin/guardian/health        → MEDIC monitoring
  /superadmin/guardian/compliance    → Certificados y estado
  /superadmin/guardian/performance   → Optimizaciones sugeridas
  /superadmin/guardian/predictions   → PROPHET forecasts
  /superadmin/guardian/history       → CHRONICLER logs
```

## 9.3 Fases de Implementación

```
FASE GUARDIAN 0 — Base (implementar con Stripe/Auth):
  □ auth_guardian.py — lo más urgente de todo
  □ input_sanitizer.py — protección básica
  □ rate_limiter.py — protección de API
  □ health_monitor.py — uptime básico
  □ alert_dispatcher.py — notificaciones a Ibrain
  Tiempo: 1-2 semanas
  Prioridad: ANTES del primer cliente real

FASE GUARDIAN 1 — Seguridad Completa (mes 2-3):
  □ pci_guardian.py — cuando Stripe esté activo
  □ data_encryptor.py — para tokens OAuth
  □ secrets_detector.py — antes de contratar devs
  □ dependency_scanner.py — automático en CI/CD
  □ Dashboard básico de seguridad

FASE GUARDIAN 2 — Compliance y Auditoría (mes 4-6):
  □ gdpr_agent.py — cuando haya clientes europeos
  □ pci_compliance.py — reporte mensual
  □ code_auditor.py — auditoría semanal
  □ db_auditor.py — revisión de RLS y permisos
  □ chronicler completo — logs de incidentes

FASE GUARDIAN 3 — Predicción y Optimización (mes 6-12):
  □ prophet completo — predicciones de capacidad y churn
  □ query_analyzer.py — optimización de DB
  □ cost_optimizer.py — reducir costo de APIs
  □ reportes automáticos completos
  □ Dashboard GUARDIAN completo
```

---

# PARTE X — FILOSOFÍA DE SEGURIDAD DE OMEGA

```
PRINCIPIO 1 — DEFENSA EN PROFUNDIDAD:
  No existe una sola línea de defensa.
  Si una falla, la siguiente detiene el ataque.
  Frontend valida → Backend valida → DB valida.
  Tres capas siempre.

PRINCIPIO 2 — MENOR PRIVILEGIO:
  Cada componente tiene acceso solo a lo que necesita.
  El frontend nunca tiene el service_role key.
  Los agentes AI solo ven datos del cliente activo.
  Un reseller nunca ve datos de otro reseller.

PRINCIPIO 3 — FAIL SECURE:
  Cuando algo falla, el sistema se niega por defecto.
  Si el auth service no responde → acceso denegado.
  Si la validación falla → request rechazado.
  Nunca "dejar pasar por si acaso".

PRINCIPIO 4 — ZERO TRUST:
  Nadie se fía de nadie por defecto.
  Cada request se verifica, siempre.
  Aunque venga de dentro del sistema.
  Los tokens se validan en cada llamada.

PRINCIPIO 5 — TRANSPARENCIA CON IBRAIN:
  GUARDIAN no oculta nada al Super Admin.
  Cada acción queda registrada.
  Cada decisión automática queda justificada.
  Ibrain siempre sabe qué está pasando y por qué.

PRINCIPIO 6 — MEJORA CONTINUA:
  Cada incidente genera una mejora.
  Cada vulnerabilidad encontrada se documenta y se sella.
  El sistema se vuelve más fuerte con cada ataque.
  GUARDIAN aprende. No repite errores.
```

---

# CONCLUSIÓN

```
OMEGA con GUARDIAN no es solo una plataforma SaaS.

Es una fortaleza digital.

Los datos de los clientes están protegidos por 7 escuadrones
que trabajan 24/7/365 sin descanso y sin error humano.

Las tarjetas de crédito nunca tocan los servidores de OMEGA.
Los hackers encuentran 5 capas de defensa antes de llegar a datos.
Los bugs se detectan antes de que los clientes los vean.
Los problemas de capacidad se resuelven antes de que ocurran.

Y Ibrain, cada mañana, recibe un reporte que dice:
"Todo está bien. El sistema está saludable.
 Tus clientes están protegidos.
 Puedes enfocarte en crecer."

Ese es el valor de GUARDIAN.
Esa es la razón por la que OMEGA puede durar décadas.

Construido para perdurar.
Protegido para confiar.
Diseñado para automantenerse.

Hasta que Dios diga hasta aquí.
```

