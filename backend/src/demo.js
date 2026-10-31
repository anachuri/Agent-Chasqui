// Datos de EJEMPLO para el endpoint de ensayo. Direcciones y empresas inventadas.
import { loadPolicy } from './guards.js';

export const DEMO_POLICY = loadPolicy({
  currency: 'ARS',
  maxPerPayment: '5000',
  dailyBudget: '20000',
  allowedRecipients: [],
});

export const DEMO_OPERATIONS = Object.freeze({
  // Las tres partes confirmaron
  'OP-DEMO-1': {
    parties: {
      exportador: { address: '0x1111111111111111111111111111111111111111', confirmed: true },
      importador: { address: '0x2222222222222222222222222222222222222222', confirmed: true },
      transportista: { address: '0x3333333333333333333333333333333333333333', confirmed: true },
    },
  },
  // El transportista todavía NO confirmó
  'OP-DEMO-2': {
    parties: {
      exportador: { address: '0x1111111111111111111111111111111111111111', confirmed: true },
      importador: { address: '0x2222222222222222222222222222222222222222', confirmed: true },
      transportista: { address: '0x3333333333333333333333333333333333333333', confirmed: false },
    },
  },
});
