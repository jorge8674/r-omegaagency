# OMEGA Frontend Rules — r-omegaagency

## R-LINES-001 — CRÍTICO
MAX 200 líneas por archivo. Sin excepciones.
Si un archivo supera 200L → dividir ANTES de añadir código.

## R-DDD-001
Componentes siguen estructura: Page → Section → Component
No saltar capas.

## R-AGENT-002
Este repo es SOLO frontend (Lovable).
No tocar lógica de auth, env vars, ni API keys.

## Stack
React + TypeScript + Tailwind + shadcn/ui
Backend: https://omegaraisen-production-2031.up.railway.app/api/v1

## Antes de cada cambio
1. Cuenta líneas del archivo a modificar
2. Si está en 180L+ → dividir primero
3. Confirmar conteo final antes de entregar
