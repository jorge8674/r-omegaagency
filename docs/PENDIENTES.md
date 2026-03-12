# 📌 PENDIENTES — Próximos pasos

**Fecha de referencia:** 12 de marzo de 2026  
**Prioridad:** Ordenados por impacto de negocio

---

## 🔴 Alta Prioridad

### 1. Integración Meta API para métricas reales de redes sociales
- **Estado:** Pendiente
- **Impacto:** Las métricas de engagement, alcance y seguidores actualmente no consumen datos reales de Meta/Instagram/Facebook.
- **Archivos afectados:** `src/hooks/useAnalyticsData.ts`, `src/pages/Analytics.tsx`, componentes en `src/components/analytics/`
- **Requiere:** Configurar Meta Business API, tokens de acceso y endpoints de insights.

### 2. Pasarela de pago Stripe para todos los niveles
- **Estado:** Pendiente
- **Impacto:** Los campos `stripe_customer_id` y `stripe_account_id` existen en la base de datos pero no están conectados a un flujo de pago funcional.
- **Archivos afectados:** `src/pages/Pricing.tsx`, `src/pages/ClientDetail/components/ClientBillingTab.tsx`
- **Requiere:** Stripe Connect para resellers, Stripe Checkout para clientes.

---

## 🟡 Media Prioridad

### 3. Content Lab — Publicación directa a redes sociales
- **Estado:** UI construida, backend pendiente
- **Impacto:** Los usuarios pueden generar contenido pero deben copiar/pegar manualmente a cada plataforma.
- **Archivos afectados:** `src/pages/ContentLab/`, endpoints de publicación en Railway.

### 4. Sistema de notificaciones en tiempo real
- **Estado:** UI básica existe en AppHeader
- **Impacto:** Las alertas se consultan por polling. Migrar a Realtime (websockets) para notificaciones push.
- **Archivos afectados:** `src/components/layout/AppHeader.tsx`

### 5. Exportación de reportes a PDF
- **Estado:** Actualmente solo Markdown
- **Impacto:** Los reportes ejecutivos necesitan formato PDF para distribución profesional.
- **Archivos afectados:** `src/pages/OmegaDepartment/components/ReportGenerator.tsx`

---

## 🟢 Baja Prioridad / Nice-to-have

### 6. Dashboard de métricas por reseller (white-label analytics)
- **Estado:** Estructura base existe
- **Impacto:** Cada reseller debería ver métricas consolidadas de sus clientes con branding propio.

### 7. Onboarding wizard para nuevos clientes
- **Estado:** `BrandVoiceForm` existe como componente aislado
- **Impacto:** Falta un flujo guiado paso a paso para configurar marca, redes y preferencias de contenido.

### 8. Tests automatizados (E2E y unitarios)
- **Estado:** Solo existe `src/test/example.test.ts` como placeholder
- **Impacto:** Sin cobertura de tests. Priorizar flujos críticos: login, generación de contenido, solicitudes de upsell.

---

## 📝 Deuda técnica identificada

| Área | Detalle |
|------|---------|
| localStorage | Varios módulos persisten estado en localStorage. Evaluar migración a backend para datos críticos. |
| Fallbacks locales | `generateMarkdownLocal()` y `STATIC_FALLBACK` en org-chart existen como safety net. Monitorear si el backend los reemplaza consistentemente. |
| Tipos compartidos | Algunos tipos se definen inline o se duplican entre hooks. Centralizar en `src/types/`. |
| Edge Functions | `nova-chat` es la única edge function. Evaluar si lógica adicional debe migrar a Lovable Cloud vs Railway. |

---

## ✅ Completado en sesiones anteriores (referencia)

- [x] Infraestructura core y auth con Railway
- [x] Recuperación de contraseñas
- [x] Ecosistema OMEGA Company completo
- [x] Dashboards Cliente y Reseller (arquitectura modular 7 bloques)
- [x] Auditoría y limpieza de archivos muertos
- [x] Plan de 4 Fases (ClientHome, ResellerDashboard, Solicitudes, Selector de Marca)
- [x] Sentinel Security Dashboard con datos reales
- [x] Reportes de departamento conectados al backend
