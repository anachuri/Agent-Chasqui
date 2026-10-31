import { PaymentStatus } from './models';

export const STATUS_LABELS: Record<PaymentStatus, string> = {
  'dry-run': 'Así quedaría el pago',
  sent: 'Pago enviado',
  rejected: 'Pago rechazado',
  blocked: 'Pago detenido',
  failed: 'Falló el envío',
};

export const ERROR_MESSAGES: Record<string, string> = {
  OVER_PER_PAYMENT_CAP: 'Supera el límite por pago.',
  OVER_DAILY_BUDGET: 'Se alcanzó el límite del día.',
  RECIPIENT_NOT_ALLOWED: 'Ese destinatario no está autorizado en esta operación.',
  OPERATION_NOT_FOUND: 'No encontramos esa operación.',
  AMOUNT_AMBIGUOUS: 'No entiendo el monto. Escribilo con coma, por ejemplo 1500,50.',
  AMOUNT_TOO_PRECISE: 'Los montos llevan hasta dos decimales.',
  AMOUNT_NOT_POSITIVE: 'El monto tiene que ser mayor que cero.',
  AMOUNT_INVALID: 'Revisá los datos del pago.',
  BAD_ADDRESS: 'Revisá los datos del pago.',
  BAD_REQUEST: 'Revisá los datos del pago.',
  SEND_FAILED: 'No se pudo enviar. Probá de nuevo más tarde.',
  TAG_MISSING_OR_INVALID: 'Pago detenido por una verificación interna.',
  TAG_NOT_APPENDED: 'Pago detenido por una verificación interna.',
  DECIMALS_INVALID: 'Pago detenido por una verificación interna.',
};

export const FALLBACK_ERROR_MESSAGE = 'Algo salió mal. No se movió dinero.';

export interface SimulationOption {
  value: string;
  label: string;
}

export const SIMULATIONS: readonly SimulationOption[] = [
  { value: 'dry-run', label: 'Así quedaría' },
  { value: 'sent', label: 'Enviado' },
  { value: 'failed', label: 'Falló' },
  { value: 'blocked', label: 'Bloqueado' },
];

export const ERROR_SIMULATIONS: readonly string[] = [
  'OVER_PER_PAYMENT_CAP',
  'OVER_DAILY_BUDGET',
  'RECIPIENT_NOT_ALLOWED',
  'OPERATION_NOT_FOUND',
  'AMOUNT_AMBIGUOUS',
  'AMOUNT_TOO_PRECISE',
  'AMOUNT_NOT_POSITIVE',
  'AMOUNT_INVALID',
  'BAD_ADDRESS',
];
