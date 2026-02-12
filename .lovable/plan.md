

# 🚀 Raisen Omega — Plataforma de Automatización de Redes Sociales

## Visión
Panel de control SaaS completo para gestión multi-cliente de redes sociales. Interfaz profesional enterprise-grade que servirá como frontend para conectarse posteriormente con servicios de IA y APIs de redes sociales.

---

## Fase 1: Fundamentos y Layout
- **Layout principal** con sidebar colapsable, header con notificaciones y selector de workspace/cliente
- **Sistema de autenticación** (login, registro, recuperación de contraseña) con Supabase Auth
- **Multi-tenant básico**: cada usuario pertenece a una organización, con roles (admin, editor, viewer)
- **Navegación completa** entre todos los módulos
- **Tema oscuro/claro** con diseño moderno y profesional

## Fase 2: Dashboard Principal
- **Vista general con KPIs**: seguidores totales, engagement rate, publicaciones programadas, cuentas activas
- **Gráficas de rendimiento** (últimos 7/30/90 días) con Recharts
- **Feed de actividad reciente**: últimas publicaciones, comentarios, acciones del sistema
- **Estado de cuentas conectadas** por red social (Instagram, Facebook, TikTok, Twitter, LinkedIn, YouTube)
- **Alertas y notificaciones** del sistema

## Fase 3: Gestión de Clientes
- **Lista de clientes** con búsqueda, filtros y paginación
- **Perfil de cliente**: datos de contacto, cuentas de redes sociales vinculadas, plan contratado
- **CRUD completo** de clientes con formularios de validación
- **Vista de rendimiento por cliente**: métricas resumidas de todas sus cuentas

## Fase 4: Gestión de Contenido
- **Calendario de publicaciones** (vista mensual/semanal/diaria) con drag & drop
- **Creador de publicaciones**: editor con vista previa por red social, selección de cuentas destino, programación de fecha/hora
- **Biblioteca de medios**: galería de imágenes y videos subidos (Supabase Storage)
- **Estados de publicaciones**: borrador, programada, publicada, fallida
- **Vista de cola de publicaciones** pendientes

## Fase 5: Analytics y Reportes
- **Dashboard de analytics por cuenta**: crecimiento de seguidores, engagement, alcance, impresiones
- **Comparativas entre períodos** y entre cuentas
- **Mejores publicaciones** ranked por engagement
- **Horarios óptimos de publicación** (visualización de heatmap)
- **Exportación de reportes** en PDF/CSV

## Fase 6: Configuración y Administración
- **Configuración de organización**: logo, nombre, miembros del equipo
- **Gestión de roles y permisos**
- **Configuración de cuentas de redes sociales** (preparado para OAuth, sin conexión real aún)
- **Logs de auditoría**: historial de acciones de usuarios
- **Página de perfil de usuario**

---

## Stack Técnico
- **Frontend**: React + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: Lovable Cloud (Supabase) para auth, base de datos y storage
- **Gráficas**: Recharts (ya instalado)
- **Navegación**: React Router con sidebar
- **Estado**: TanStack Query para datos del servidor

## Base de Datos (Supabase)
- Tablas: organizations, users, clients, social_accounts, posts, media, analytics_snapshots, audit_logs
- Row Level Security por organización (multi-tenant)
- Storage buckets para medios

