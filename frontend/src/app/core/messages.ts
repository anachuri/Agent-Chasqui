import { TranslationKey } from './i18n/translations';
import { PaymentStatus } from './models';

export const STATUS_LABEL_KEYS: Record<PaymentStatus, TranslationKey> = {
  'dry-run': 'status.dry-run',
  sent: 'status.sent',
  rejected: 'status.rejected',
  blocked: 'status.blocked',
  failed: 'status.failed',
};

export const STATUS_MESSAGE_KEYS: Record<PaymentStatus, TranslationKey> = {
  'dry-run': 'message.dry-run',
  sent: 'message.sent',
  rejected: 'message.fallback',
  blocked: 'message.blocked',
  failed: 'message.failed',
};

export const ERROR_MESSAGE_KEYS: Record<string, TranslationKey> = {
  OVER_PER_PAYMENT_CAP: 'error.OVER_PER_PAYMENT_CAP',
  OVER_DAILY_BUDGET: 'error.OVER_DAILY_BUDGET',
  RECIPIENT_NOT_ALLOWED: 'error.RECIPIENT_NOT_ALLOWED',
  OPERATION_NOT_FOUND: 'error.OPERATION_NOT_FOUND',
  AMOUNT_AMBIGUOUS: 'error.AMOUNT_AMBIGUOUS',
  AMOUNT_TOO_PRECISE: 'error.AMOUNT_TOO_PRECISE',
  AMOUNT_NOT_POSITIVE: 'error.AMOUNT_NOT_POSITIVE',
  AMOUNT_INVALID: 'error.AMOUNT_INVALID',
  BAD_ADDRESS: 'error.BAD_ADDRESS',
  BAD_REQUEST: 'error.BAD_REQUEST',
  SEND_FAILED: 'error.SEND_FAILED',
  TAG_MISSING_OR_INVALID: 'error.TAG_MISSING_OR_INVALID',
  TAG_NOT_APPENDED: 'error.TAG_NOT_APPENDED',
  DECIMALS_INVALID: 'error.DECIMALS_INVALID',
  NETWORK_ERROR: 'error.NETWORK_ERROR',
};

export const FALLBACK_ERROR_KEY: TranslationKey = 'message.fallback';

export interface SimulationOption {
  value: string;
  labelKey: TranslationKey;
}

export const SIMULATIONS: readonly SimulationOption[] = [
  { value: 'dry-run', labelKey: 'sim.dry-run' },
  { value: 'sent', labelKey: 'sim.sent' },
  { value: 'failed', labelKey: 'sim.failed' },
  { value: 'blocked', labelKey: 'sim.blocked' },
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
