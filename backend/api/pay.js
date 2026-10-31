// Endpoint de ENSAYO. No importa billeteras ni claves: no puede mover dinero.
// POST /api/pay  { "operation": "OP-DEMO-1", "to": "transportista", "amount": "1500,00" }
// Opcional: ?simulate=sent|failed|blocked|dry-run|<CODIGO>  -> respuesta fija marcada "simulated".
import { DEMO_POLICY, DEMO_OPERATIONS } from '../src/demo.js';
import { evaluatePayment, simulatedResponse } from '../src/operation.js';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default function handler(req, res) {
  for (const [k, v] of Object.entries(CORS)) res.setHeader(k, v);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ status: 'rejected', code: 'METHOD_NOT_ALLOWED' });

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = null; }
  }
  if (!body || typeof body !== 'object') return res.status(400).json({ status: 'rejected', code: 'BAD_REQUEST' });

  const sim = req.query?.simulate;
  if (sim) return res.status(200).json(simulatedResponse(String(sim), body));

  const result = evaluatePayment({
    policy: DEMO_POLICY,
    operations: DEMO_OPERATIONS,
    request: body,
    spentTodayCents: 0n, // el ensayo no guarda estado entre llamadas
  });
  return res.status(200).json(result);
}
