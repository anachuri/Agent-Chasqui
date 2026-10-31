# Chasqui Tech · Frontend

SPA en Angular 20 para operar el agente de pagos de Chasqui Tech. Consume el endpoint de ensayo `https://agente-chasqui-tech-api.vercel.app/api/pay` (vía `/api/pay`) y muestra el resultado de cada evaluación.

No usa SSR ni prerender: es un dashboard interactivo, no necesita SEO.

## Desarrollo

```bash
npm install
npm start
```

`npm start` levanta `ng serve` con `proxy.conf.json`, que redirige `/api/*` al backend desplegado en Vercel. Abrí `http://localhost:4200/`.

Para usar un backend local:

```bash
cd ../backend
npm run dev
```

Queda en `http://localhost:3000/api/pay`. Luego cambiá el `target` de `proxy.conf.json` a `http://localhost:3000` y reiniciá el frontend.

Si querés apuntar a otro backend, editá el `target` de `proxy.conf.json` (desarrollo) y la rewrite de `/api` en `vercel.json` (producción).

## Contrato del endpoint

`POST /api/pay` con `{ "operation": "OP-DEMO-1", "to": "transportista", "amount": "1500,00" }`.

- `operation`: `OP-DEMO-1` (tres partes confirmadas) u `OP-DEMO-2` (transportista sin confirmar).
- `to`: rol (`exportador`, `importador`, `transportista`), nunca una dirección.
- `amount`: texto con coma decimal. Tope de la demo: ARS 5.000 por pago.
- Respuestas: `dry-run`, `rejected` (con `code`), `blocked`, `sent` (con `amountText` y `hash`) o `failed`.
- `?simulate=sent|failed|blocked|dry-run|<CODIGO>` devuelve una respuesta con `simulated: true`.
- El hash del `sent` simulado son ceros: es falso a propósito.

## Build

```bash
npm run build
```

El resultado queda en `dist/frontend/browser`.

## Tests

```bash
npm test
```

Corren con Karma + Jasmine. También hay tests del servicio HTTP (`payment.service.spec.ts`) y del shell (`app.spec.ts`).

## Deploy en Vercel

Son **dos proyectos** independientes, ambos conectados al mismo repo:

1. **Frontend**: Root Directory = `frontend`. Dominio: `https://agente-chasqui-tech.vercel.app`.
2. **Backend**: Root Directory = `backend`. Dominio: `https://agente-chasqui-tech-api.vercel.app`.

`frontend/vercel.json` ya define:

- build: `npm run build`
- output: `dist/frontend/browser`
- rewrite de `/api/*` a `https://agente-chasqui-tech-api.vercel.app/api/*`
- fallback de SPA a `index.html`

`backend/vercel.json` solo instala lo necesario para `/api/pay` y publica `backend/public/agent.json` en la raíz del dominio del backend.

Si el proyecto backend tiene otro dominio, actualizá la rewrite de `vercel.json` y el `target` de `proxy.conf.json`.

## Estructura

```
src/app/
  core/
    models.ts           tipos de operación, pedido y resultado
    demo-data.ts        operaciones y límites de ejemplo (solo UI)
    messages.ts         textos de estados y códigos de error
    payment.service.ts  POST /api/pay + manejo de errores
  pages/dashboard/      pantalla principal
```

La UI muestra los límites de la demo (`ARS 5.000` por pago, `ARS 20.000` diarios), pero **la validación real vive en el backend**. El navegador nunca decide si un pago es válido.

## Backend

El backend está en `../backend` (Node.js ESM + Vercel Functions). El endpoint de ensayo no mueve dinero ni usa claves privadas.
