# AGENTS.md

## Repo shape

- Two independent npm projects; there is no root `package.json`, workspace, CI, lint script, or formatter script.
  - `backend/` — Node 20 ESM, Vercel Functions. Pure payment logic in `src/`.
  - `frontend/` — Angular 20 standalone components + signals, no NgModules, no SSR/prerender.
- Deploy is two separate Vercel projects from the same repo: backend Root Directory `backend`, frontend `frontend`. `frontend/vercel.json` rewrites `/api/*` to the deployed backend; `frontend/proxy.conf.json` does the same for `ng serve`.
- Prose, comments, UI copy, and tests are Spanish (es-AR). Keep new user-facing strings and error messages in Spanish.
- `backend/agent/` is design notes only; no LLM/agent loop is implemented yet.
- `frontend/README.md` has the endpoint contract and deploy details. `backend/SPEC.md` is the hackathon spec and still contains pending `COMPLETAR` fields; do not treat it as executable truth.

## Commands

### Backend (`cd backend`)

- `npm test` — `node --test test/*.test.js`. Works without `npm install`; tests use only builtins and `src/`.
- Single file: `node --test test/guards.test.js`; single test: `node --test --test-name-pattern="checkPayment" test/guards.test.js`.
- `npm install` first if you need `viem` or `@celo/attribution-tags` (the live scripts only).
- `npm run dev` (or `npm start`) — dependency-free local server for `POST /api/pay` and `GET /agent.json` at `http://localhost:3000`. This is not Vercel; it uses `scripts/dev-server.mjs`.
- `npm run dry-run -- 0xRECIPIENT 1` — positional recipient and amount (defaults to `1`). Live sends record spend state to `.state/spent.json` (gitignored).
- `npm run pay` is the same script as `dry-run`; it does **not** force live mode. Live requires both `AGENT_MODE=live` and `CONFIRM_REAL_PAYMENTS=yes-move-real-money`.
- `npm run register` — ERC-8004 registration dry-run; requires a publicly reachable `AGENT_URI` (the deployed `/agent.json`).
- Scripts load `.env` via `node --env-file=.env`; use `.env.example` as the template. Never commit `.env` or private keys.
- In production `/api/pay` is a Vercel Function; `npm run dev` only emulates the two backend routes locally.

### Frontend (`cd frontend`)

- `npm install && npm start` — `ng serve` plus proxy to the deployed backend at `http://localhost:4200/`.
- To use a different backend, change both the `target` in `frontend/proxy.conf.json` (dev) and the `/api` rewrite in `frontend/vercel.json` (prod).
- `npm run build` — output in `dist/frontend/browser`. This is also the only typecheck; templates use Angular `strictTemplates`.
- `npm test` — Karma + Jasmine; needs a local Chrome. Single spec: `npx ng test --watch=false --include='src/app/core/payment.service.spec.ts'`.

## Money-path invariants

- `/api/pay` is demo-only and must stay wallet-free. `backend/test/operation.test.js` fails if `api/pay.js`, `src/operation.js`, or `src/demo.js` mention `wallet`, `viem`, `executor`, `PRIVATE_KEY`, `process.env`, or `fetch(`.
- `src/executor.js` is the only path to the network. Keep the order: parse amount → limits → calldata → ERC-8021 tag → dry-run or send. Never bypass `guards.js` or `tag.js`.
- Amounts are bigint cents. Use `parseFiatToCents`, `formatCents`, and `centsToTokenUnits`; never do money math with JS floats.
  - `"1.500"` is deliberately rejected as `AMOUNT_AMBIGUOUS`; use `"1500"` or `"1.500,00"`.
  - More than 2 decimals is `AMOUNT_TOO_PRECISE`; the daily budget day boundary is UTC-3 (`store.js`).
- Two different policies, do not conflate them:
  - `backend/policy.json` — used by the live scripts; currently tiny (2 ARS/payment, 5 ARS/day).
  - `DEMO_POLICY` in `backend/src/demo.js` — used by `/api/pay` (5000/payment, 20000/day).
- Every transaction must end with the attribution suffix (`celo_...` tag); `assertTagged` must run before sending.
- Celo mainnet only (chain 42220). Token addresses and the USDC fee-currency adapter live in `src/config.js`; do not guess or substitute addresses.

## Frontend rules

- The backend is authoritative. `src/app/core/demo-data.ts` duplicates demo operations and limits for display only; never enforce payment validity in the browser.
- The API's `to` field is a role (`exportador`, `importador`, `transportista`), never an address.
- Result statuses are `dry-run | sent | rejected | blocked | failed`; error text is keyed by backend codes in `core/messages.ts`. Add new codes there when the backend adds them.
- `?simulate=sent|failed|blocked|dry-run|<CODE>` returns fixed responses marked `simulated: true`; simulated `sent` has an all-zero hash on purpose.

## ERC-8004 / agent card

- Publish `backend/public/agent.json` **without** `registrations`, run `npm run register`, then add the returned `registrations`; `checkAgentCard` rejects registrations present before registration.
- `checkAgentCard` also rejects leftover placeholders (`COMPLETAR`, `xxxxxxxx`, etc.), a wallet that does not match the registering wallet, non-https `web` endpoints, and invalid/missing `x-attribution`.
- Keep `public/agent.json` in sync with the real agent wallet and tag; `agent.template.json` intentionally contains placeholders.
