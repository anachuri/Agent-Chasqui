import { OperationView, PartyRole } from './models';

export const ROLES: readonly PartyRole[] = ['exportador', 'importador', 'transportista'];

export const ROLE_LABELS: Record<PartyRole, string> = {
  exportador: 'Exportador',
  importador: 'Importador',
  transportista: 'Transportista',
};

const EXPORTADOR = '0x1111111111111111111111111111111111111111';
const IMPORTADOR = '0x2222222222222222222222222222222222222222';
const TRANSPORTISTA = '0x3333333333333333333333333333333333333333';

export const OPERATIONS: readonly OperationView[] = [
  {
    id: 'OP-DEMO-1',
    title: 'Bebidas a Brasil, pulpas de vuelta',
    description:
      'Una empresa del norte argentino exporta bebidas y aprovecha el viaje de regreso para importar pulpas y concentrados frutales.',
    parties: {
      exportador: { address: EXPORTADOR, confirmed: true },
      importador: { address: IMPORTADOR, confirmed: true },
      transportista: { address: TRANSPORTISTA, confirmed: true },
    },
  },
  {
    id: 'OP-DEMO-2',
    title: 'Misma operación, transportista sin confirmar',
    description:
      'Las partes todavía no cerraron la confirmación del transportista. Sirve para probar el rechazo por destinatario no habilitado.',
    parties: {
      exportador: { address: EXPORTADOR, confirmed: true },
      importador: { address: IMPORTADOR, confirmed: true },
      transportista: { address: TRANSPORTISTA, confirmed: false },
    },
  },
];

export const DEMO_POLICY = {
  currency: 'ARS',
  maxPerPayment: 5000,
  dailyBudget: 20000,
} as const;

export const AMOUNT_PRESETS: readonly string[] = ['1.500,00', '2.500,00', '5.000,00', '6.000,00'];
