// Servidor local mínimo para probar /api/pay sin Vercel CLI.
// Uso: npm run dev  ->  http://localhost:3000
// Solo usa módulos de Node; no necesita npm install.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import handler from '../api/pay.js';

const PORT = Number(process.env.PORT ?? 3000);
const HOST = process.env.HOST ?? '127.0.0.1';

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.setEncoding('utf8');
    req.on('data', (chunk) => { raw += chunk; });
    req.on('end', () => resolve(raw));
    req.on('error', reject);
  });
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);

  if (url.pathname === '/agent.json') {
    try {
      const body = await readFile(new URL('../public/agent.json', import.meta.url), 'utf8');
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(body);
    } catch {
      res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ error: 'agent.json no encontrado' }));
    }
    return;
  }

  if (url.pathname !== '/api/pay') {
    res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ error: 'Not found', hint: 'Usá POST /api/pay o GET /agent.json' }));
    return;
  }

  const raw = await readBody(req);
  let body = raw;
  if (raw && req.headers['content-type']?.includes('application/json')) {
    try { body = JSON.parse(raw); } catch { body = null; }
  }

  // Adaptador mínimo para la firma req/res de Vercel Functions.
  const mockRes = {
    setHeader: (key, value) => res.setHeader(key, value),
    status: (code) => { res.statusCode = code; return mockRes; },
    json: (value) => {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(JSON.stringify(value));
      return mockRes;
    },
    end: () => { res.end(); return mockRes; },
  };

  try {
    await handler(
      { method: req.method, body, query: Object.fromEntries(url.searchParams) },
      mockRes,
    );
  } catch (error) {
    console.error(error);
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
    }
    res.end(JSON.stringify({ status: 'failed', code: 'INTERNAL_ERROR' }));
  }
});

server.listen(PORT, HOST, () => {
  console.log(`API local:   http://${HOST}:${PORT}/api/pay`);
  console.log(`Agent card:  http://${HOST}:${PORT}/agent.json`);
});
