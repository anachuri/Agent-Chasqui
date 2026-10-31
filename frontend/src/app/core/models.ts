export type PartyRole = 'exportador' | 'importador' | 'transportista';

export interface Party {
  address: string;
  confirmed: boolean;
}

export interface OperationView {
  id: string;
  title: string;
  description: string;
  parties: Record<PartyRole, Party>;
}

export type PaymentStatus = 'dry-run' | 'sent' | 'rejected' | 'blocked' | 'failed';

export interface PaymentRequest {
  operation: string;
  to: PartyRole;
  amount: string;
}

export interface PaymentResult {
  status: PaymentStatus;
  code?: string;
  amountText?: string;
  to?: string;
  operation?: string;
  hash?: string;
  simulated?: boolean;
  error?: string;
  preview?: unknown;
}
