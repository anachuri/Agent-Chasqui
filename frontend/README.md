# Chasqui Tech · Frontend

SPA en Angular 20 para operar el agente de pagos de Chasqui Tech. Consume el endpoint de evaluación `https://agent-chasqui-backend.vercel.app/api/pay` (vía `/api/pay`) y muestra el resultado de cada evaluación.

La ruta `/como-funciona` es una página explicativa para el jurado: cuenta el problema, el flujo de un pago, los límites, la arquitectura y qué está implementado hoy.

No usa SSR ni prerender: es un dashboard interactivo, no necesita SEO.

## Desarrollo

```bash
npm install
npm start
```

`npm start` levanta `ng serve` con `proxy.conf.json`, que redirige `/api/*` al backend local. Abrí `http://localhost:4200/`.

Para levantar el backend local, en otra terminal:

```bash
cd ../backend
npm run dev
```

Queda en `http://127.0.0.1:3000` (`/api/pay` y `/api/policy`). El proxy ya apunta ahí; reiniciá `ng serve` después de cambiar `proxy.conf.json`.

Si querés apuntar a otro backend, editá el `target` de `proxy.conf.json` (desarrollo) y la rewrite de `/api` en `vercel.json` (producción).

## Contrato del endpoint

`POST /api/pay` con `{ "operation": "OP-DEMO-1", "to": "transportista", "amount": "1500,00" }`.

- `operation`: `OP-DEMO-1` (tres partes confirmadas) u `OP-DEMO-2` (transportista sin confirmar).
- `to`: rol (`exportador`, `importador`, `transportista`), nunca una dirección.
- `amount`: texto con coma decimal. Tope de la demo: ARS 5.000 por pago.
- Respuestas: `dry-run`, `rejected` (con `code`), `blocked`, `sent` (con `amountText` y `hash`) o `failed`.
- `?simulate=sent|failed|blocked|dry-run|<CODIGO>` devuelve una respuesta con `simulated: true`.
- El hash del `sent` simulado son ceros: es falso a propósito.

`GET /api/policy` devuelve los límites vigentes (`currency`, `maxPerPaymentCents`, `dailyBudgetCents`) y el modo (`dry-run`). La UI los lee de ahí para no duplicar topes en el código. Si el endpoint no responde, la pantalla muestra `—` en lugar de inventar valores.

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
2. **Backend**: Root Directory = `backend`. Dominio: `https://agent-chasqui-backend.vercel.app`.

`frontend/vercel.json` ya define:

- build: `npm run build`
- output: `dist/frontend/browser`
- rewrite de `/api/*` a `https://agent-chasqui-backend.vercel.app/api/*`
- fallback de SPA a `index.html`

`backend/vercel.json` solo instala lo necesario para `/api/pay` y publica `backend/public/agent.json` en la raíz del dominio del backend.

Si el proyecto backend tiene otro dominio, actualizá la rewrite de `vercel.json` y el `target` de `proxy.conf.json`.

## Idiomas

La UI soporta español (`es`), inglés (`en`) y portugués (`pt`). El selector del topbar cambia el idioma en caliente y lo guarda en `localStorage` (`chasqui.language`). El idioma por defecto es español.

Las traducciones viven en `src/app/core/i18n/translations.ts` y `TranslationService` expone `t(key, params)` como signal. Al agregar textos nuevos, incluí la clave en los tres diccionarios: el tipado `Record<TranslationKey, string>` hace fallar el build si falta alguna.

## Estructura

```
src/app/
  core/
    i18n/               traducciones es/en/pt y servicio de idioma
    models.ts           tipos de operación, pedido y resultado
    demo-data.ts        operaciones de ejemplo y presets de monto (solo UI)
    messages.ts         claves de estados y códigos de error
    payment.service.ts  POST /api/pay + manejo de errores
  pages/dashboard/      pantalla principal
  pages/how-it-works/   ruta /como-funciona, explicación para el jurado
```

La UI muestra los límites que devuelve `GET /api/policy`, pero **la validación real vive en el backend**. El navegador nunca decide si un pago es válido ni copia los topes en el código.

## Backend

El backend está en `../backend` (Node.js ESM + Vercel Functions). El endpoint de evaluación no usa claves privadas.
