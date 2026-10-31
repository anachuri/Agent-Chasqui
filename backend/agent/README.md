Paso 2+: el LLM (tool `propose_payment`) solo produce intents {to, amount}.
Todo intent pasa por src/executor.js; el agente no tiene acceso a policy.json ni a las claves.
