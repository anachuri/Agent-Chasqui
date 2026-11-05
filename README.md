# Chasqui Tech

Agente de pagos para operaciones de comercio exterior entre Argentina y Brasil, presentado en el hackathon **Agents on Open Rails** (Celo × Ripio), pista **Stable Agents: LatAm**.

El agente conecta a tres partes de una operación —**exportador**, **importador** y **transportista**— y liquida pagos en stablecoins locales de Ripio (wARS, wBRL) sobre **Celo mainnet**, sin pasar por el dólar. Todo pago pasa por límites fijos de código (tope por pago, presupuesto diario, destinatarios confirmados) y cada transacción lleva el tag de atribución **ERC-8021**. La identidad del agente se publica como **ERC-8004**.

> Estado actual: la demo pública evalúa pagos en modo ensayo. **No mueve dinero.** El envío real existe en los scripts del backend y exige dos variables de entorno explícitas.

- Frontend: https://agente-chasqui-tech.vercel.app
- Backend / agent card: https://agent-chasqui-backend.vercel.app/agent.json

## Arquitectura

El repo contiene dos proyectos npm independientes, sin workspace ni `package.json` raíz. Cada uno se despliega como un proyecto Vercel distinto apuntando a la misma rama.

```
┌─────────────────────────────┐        /api/* (proxy o rewrite)        ┌─────────────────────────────┐
│  frontend/                  │ ─────────────────────────────────────▶ │  backend/                   │
│  Angular 20 (SPA, signals)  │                                        │  Vercel Functions (Node 20) │
│  dashboard de evaluación    │ ◀───────────────────────────────────── │  /api/pay · /api/policy     │
└─────────────────────────────┘              JSON                      │  /agent.json (ERC-8004)     │
                                                                        └──────────────┬──────────────┘
                                                                                       │ scripts (viem)
                                                                                       ▼
                                                                        ┌─────────────────────────────┐
                                                                        │ Celo mainnet (42220)        │
                                                                        │ wARS / wBRL + ERC-8021 tag  │
                                                                        └─────────────────────────────┘
```

La UI **nunca** decide si un pago es válido: solo muestra lo que responde el backend. Las operaciones de ejemplo y los presets de monto están duplicados en el frontend únicamente para la pantalla.

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | Angular 20 standalone, signals, Reactive Forms, `HttpClient`, sin SSR/prerender |
| Backend | Node 20 ESM, Vercel Functions, sin framework HTTP |
| Web3 | `viem`, `@celo/attribution-tags` (solo scripts de envío) |
| Red | Celo mainnet (chain 42220) |
| Tokens | wARS, wBRL, wMXN (Ripio) |
| Tests | `node --test` (backend), Karma + Jasmine (frontend) |

## Estructura

```
.
├── AGENTS.md                     instrucciones para agentes de código
├── backend/
│   ├── api/
│   │   ├── pay.js                POST /api/pay (ensayo, sin claves)
│   │   └── policy.js             GET /api/policy (límites de la demo)
│   ├── src/
│   │   ├── config.js             chain, tokens y adaptadores de fee abstraction
│   │   ├── guards.js             montos (bigint), límites y modo live
│   │   ├── operation.js          operaciones/roles + respuestas simuladas
│   │   ├── demo.js               política y operaciones de la demo
│   │   ├── executor.js           único camino a la red
│   │   ├── tag.js                ERC-8021 (append + assert)
│   │   ├── wallet.js             wallet viem y transfer con fee en USDC
│   │   ├── agentcard.js          validación ERC-8004
│   │   └── store.js              gasto diario (día UTC-3)
│   ├── scripts/
│   │   ├── dev-server.mjs        servidor local sin Vercel
│   │   ├── first-payment.mjs     dry-run / pago real
│   │   └── register-8004.mjs     registro ERC-8004
│   ├── test/                     tests de guards, executor, operación, policy y agent card
│   ├── public/agent.json         agent card publicada
│   ├── policy.json               política de los scripts live
│   ├── agent.template.json       plantilla con placeholders
│   └── SPEC.md                   spec del hackathon (contiene campos pendientes)
└── frontend/
    ├── src/app/core/             modelos, mensajes, datos demo y PaymentService
    ├── src/app/pages/dashboard/  pantalla principal
    ├── src/app/pages/how-it-works/  ruta /como-funciona (explicación)
    ├── proxy.conf.json           /api -> backend local
    └── vercel.json               build, output y rewrite /api + fallback SPA
```

## Puesta en marcha

Requisitos: Node 20+, npm y Chrome local para los tests del frontend.

### Backend

```bash
cd backend
npm run dev          # http://127.0.0.1:3000  (/api/pay, /api/policy, /agent.json)
```

`npm run dev` usa `scripts/dev-server.mjs` y **no necesita `npm install`** para los endpoints de demo: solo módulos de Node. Instalá dependencias únicamente si vas a usar los scripts de envío o registro (`viem`, `@celo/attribution-tags`).

### Frontend

```bash
cd frontend
npm install
npm start            # ng serve + proxy a http://127.0.0.1:3000
```

Abrí http://localhost:4200/. Para apuntar a otro backend, cambiá el `target` de `frontend/proxy.conf.json` (desarrollo) y la rewrite de `/api` en `frontend/vercel.json` (producción); reiniciá `ng serve` después de tocar el proxy.

## API

### `POST /api/pay`

Endpoint de ensayo, sin wallet ni claves privadas. Evalúa una operación de ejemplo y devuelve el resultado sin enviar nada.

```http
POST /api/pay
Content-Type: application/json

{ "operation": "OP-DEMO-1", "to": "transportista", "amount": "1500,00" }
```

| Campo | Descripción |
|---|---|
| `operation` | `OP-DEMO-1` (tres partes confirmadas) u `OP-DEMO-2` (transportista sin confirmar) |
| `to` | Rol: `exportador`, `importador` o `transportista`. **Nunca una dirección.** |
| `amount` | Texto con coma decimal. Tope de la demo: ARS 5.000 por pago |

Estados de respuesta:

| `status` | Significado |
|---|---|
| `dry-run` | El pago es válido y así quedaría; no se movió dinero |
| `rejected` | Rechazado por límites, rol no confirmado, operación inexistente o monto inválido |
| `blocked` | Detenido por una verificación interna (por ejemplo, tag no adjuntado) |
| `sent` | Enviado, con `amountText` y `hash` |
| `failed` | Falló el envío (`SEND_FAILED`) |

Códigos de error habituales: `OPERATION_NOT_FOUND`, `RECIPIENT_NOT_ALLOWED`, `OVER_PER_PAYMENT_CAP`, `OVER_DAILY_BUDGET`, `AMOUNT_AMBIGUOUS`, `AMOUNT_TOO_PRECISE`, `AMOUNT_NOT_POSITIVE`, `AMOUNT_INVALID`, `BAD_ADDRESS`.

### Simulaciones

`POST /api/pay?simulate=sent|failed|blocked|dry-run|<CODIGO>` devuelve una respuesta fija marcada con `"simulated": true`. El `hash` del `sent` simulado son ceros: es falso a propósito. Sirve para probar todos los estados de la UI sin tocar la lógica.

### `GET /api/policy`

Devuelve los límites vigentes de la demo en centavos. La UI los lee de acá para no duplicar topes en el código; si falla, muestra `—` en lugar de inventar valores.

```json
{
  "currency": "ARS",
  "maxPerPaymentCents": "500000",
  "dailyBudgetCents": "2000000",
  "mode": "dry-run"
}
```

### `GET /agent.json`

Agent card ERC-8004 publicada desde `backend/public/agent.json`. Incluye el `agentWallet` (`eip155:42220:0x39A7…229B`) y el tag `celo_7b60c850d648`.

## Montos y límites

Los montos se manejan **siempre en centavos con `bigint`**; nunca con floats.

- Formatos válidos: `"1500"`, `"1,50"`, `"1.500,50"`, `"$ 2.000,00"`.
- `"1.500"` se rechaza como `AMOUNT_AMBIGUOUS` (¿mil quinientos o uno con medio?). Usá `"1500"` o `"1.500,00"`.
- Más de dos decimales → `AMOUNT_TOO_PRECISE`.
- El día del presupuesto diario corta a las 00:00 UTC-3 (Argentina).

Hay **dos políticas distintas** y no deben confundirse:

| Política | Dónde vive | Uso | Límites |
|---|---|---|---|
| `DEMO_POLICY` | `backend/src/demo.js` | `/api/pay`, `/api/policy` | ARS 5.000 por pago, ARS 20.000 por día |
| `policy.json` | `backend/policy.json` | scripts live (`dry-run`, `pay`) | ARS 2 por pago, ARS 5 por día |

`policy.json` incluye una lista de destinatarios permitidos que hoy contiene solo la dirección cero como placeholder: para un pago real hay que cargar la dirección destino correcta.

## Camino del dinero (invariantes)

- `/api/pay` es **solo demo** y debe quedar libre de wallets. Un test (`backend/test/operation.test.js`) falla si `api/pay.js`, `src/operation.js` o `src/demo.js` mencionan `wallet`, `viem`, `executor`, `PRIVATE_KEY`, `process.env` o `fetch(`.
- `src/executor.js` es el **único camino a la red**. El orden es fijo: parsear monto → límites → calldata → tag ERC-8021 → dry-run o envío. Nunca se saltea `guards.js` ni `tag.js`.
- `assertTagged` corre antes de enviar: ninguna transacción sale sin el sufijo de atribución.
- Los pagos reales exigen **las dos** variables: `AGENT_MODE=live` y `CONFIRM_REAL_PAYMENTS=yes-move-real-money`. Con una sola, el modo es `dry-run`.
- La wallet del agente es la única que firma; el gas se paga en USDC mediante fee abstraction (CIP-64). No hay relayers ni gas patrocinado.
- Solo Celo mainnet (42220). Direcciones de tokens y adaptadores de fee están en `src/config.js`; no se inventan ni se sustituyen.
- El LLM (aún no implementado) solo producirá intents `{ to, amount }`; no tendrá acceso a `policy.json` ni a las claves.

## Scripts de envío

Los scripts cargan `.env` con `node --env-file=.env`. Usá `.env.example` como plantilla y **nunca** commitees `.env` ni claves privadas.

```bash
cd backend
npm install                                   # primera vez (viem, attribution-tags)

npm run dry-run -- 0xRECIPIENTE 1             # ensayo, sin mover dinero
npm run register                              # ensayo de registro ERC-8004
```

`npm run pay` es el mismo script que `dry-run`; **no** fuerza modo live. El modo live requiere las dos variables ya mencionadas. El estado de gasto se guarda en `.state/spent.json` (ignorado por git).

### Registro ERC-8004

1. Publicá `backend/public/agent.json` **sin** `registrations` (con la wallet y el tag reales).
2. Asegurate de que `AGENT_URI` apunte a la URL https pública de esa card.
3. Corré `npm run register`.
4. Agregá al archivo el `registrations` que devuelve el registro.

`checkAgentCard` rechaza placeholders (`COMPLETAR`, `xxxxxxxx`, etc.), una wallet que no coincida con la que registra, endpoints `web` que no sean https, un tag inválido y `registrations` presente antes de registrar.

## Tests

```bash
# Backend (sin instalación de dependencias)
cd backend
npm test

# Un archivo
node --test test/guards.test.js

# Un test puntual
node --test --test-name-pattern="checkPayment" test/guards.test.js
```

```bash
# Frontend (requiere Chrome)
cd frontend
npm test

# Un spec
npx ng test --watch=false --include='src/app/core/payment.service.spec.ts'
```

El `build` del frontend es también el typecheck (templates con `strictTemplates`):

```bash
cd frontend && npm run build     # salida en dist/frontend/browser
```

## Deploy en Vercel

Dos proyectos independientes desde el mismo repo:

1. **Frontend** — Root Directory `frontend`.
   - Build: `npm run build`
   - Output: `dist/frontend/browser`
   - Rewrite `/api/*` → backend desplegado (hoy `https://agent-chasqui-backend.vercel.app/api/*`)
   - Fallback de SPA a `index.html`
2. **Backend** — Root Directory `backend`.
   - Sin dependencias para `/api/pay` (el `installCommand` lo evita)
   - Output `public`, que publica `agent.json` en la raíz del dominio

Si cambia el dominio del backend, actualizá la rewrite de `frontend/vercel.json` y el `target` de `frontend/proxy.conf.json`.

## Alcance

Es real: la lógica de límites, la construcción y verificación del tag, la transferencia en Celo mainnet desde la wallet del agente y el registro ERC-8004.

Es de ejemplo: las empresas, la carga, el transportista y las direcciones de la demo; el endpoint `/api/pay` solo evalúa. Fuera de alcance: conversión a pesos en cuenta bancaria y trámites de exportación/importación.

## Documentación relacionada

- `frontend/README.md` — contrato del endpoint y deploy del frontend.
- `backend/SPEC.md` — spec del hackathon (todavía tiene campos `COMPLETAR`).
- `AGENTS.md` — convenciones del repo e invariantes del camino del dinero.
