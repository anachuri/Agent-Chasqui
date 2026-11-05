import { Language, TranslationKey } from './i18n/translations';
import { OperationView, PartyRole } from './models';

export const ROLES: readonly PartyRole[] = ['exportador', 'importador', 'transportista'];

export const ROLE_LABEL_KEYS: Record<PartyRole, TranslationKey> = {
  exportador: 'role.exportador',
  importador: 'role.importador',
  transportista: 'role.transportista',
};

const EXPORTADOR = '0x1111111111111111111111111111111111111111';
const IMPORTADOR = '0x2222222222222222222222222222222222222222';
const TRANSPORTISTA = '0x3333333333333333333333333333333333333333';

export const OPERATIONS: readonly OperationView[] = [
  {
    id: 'OP-DEMO-1',
    titleKey: 'operation.OP-DEMO-1.title',
    descriptionKey: 'operation.OP-DEMO-1.description',
    parties: {
      exportador: { address: EXPORTADOR, confirmed: true },
      importador: { address: IMPORTADOR, confirmed: true },
      transportista: { address: TRANSPORTISTA, confirmed: true },
    },
  },
  {
    id: 'OP-DEMO-2',
    titleKey: 'operation.OP-DEMO-2.title',
    descriptionKey: 'operation.OP-DEMO-2.description',
    parties: {
      exportador: { address: EXPORTADOR, confirmed: true },
      importador: { address: IMPORTADOR, confirmed: true },
      transportista: { address: TRANSPORTISTA, confirmed: false },
    },
  },
];

// Los topes NO se copian acá: se leen de GET /api/policy. Esta lista es solo UI.
export const AMOUNT_PRESETS: Record<Language, readonly string[]> = {
  es: ['1.500,00', '2.500,00', '5.000,00', '6.000,00'],
  en: ['1,500.00', '2,500.00', '5,000.00', '6,000.00'],
  pt: ['1.500,00', '2.500,00', '5.000,00', '6.000,00'],
};
