// Límites vigentes de la demo, en centavos. La UI los lee de acá para no duplicarlos.
// GET /api/policy -> { currency, maxPerPaymentCents, dailyBudgetCents, mode }
import { DEMO_POLICY } from '../src/demo.js';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default function handler(req, res) {
  for (const [k, v] of Object.entries(CORS)) res.setHeader(k, v);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ status: 'rejected', code: 'METHOD_NOT_ALLOWED' });

  return res.status(200).json({
    currency: DEMO_POLICY.currency,
    maxPerPaymentCents: DEMO_POLICY.maxPerPayment.toString(),
    dailyBudgetCents: DEMO_POLICY.dailyBudget.toString(),
    mode: 'dry-run',
  });
}
