import { JsonPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  AMOUNT_PRESETS,
  DEMO_POLICY,
  OPERATIONS,
  ROLES,
  ROLE_LABELS,
} from '../../core/demo-data';
import {
  ERROR_MESSAGES,
  ERROR_SIMULATIONS,
  FALLBACK_ERROR_MESSAGE,
  SIMULATIONS,
  STATUS_LABELS,
} from '../../core/messages';
import { OperationView, PartyRole, PaymentRequest, PaymentResult } from '../../core/models';
import { PaymentService } from '../../core/payment.service';

@Component({
  selector: 'app-dashboard',
  imports: [ReactiveFormsModule, JsonPipe],
  templateUrl: './dashboard.html',
})
export class Dashboard {
  private readonly paymentService = inject(PaymentService);
  private readonly fb = inject(FormBuilder);

  readonly roles = ROLES;
  readonly roleLabels = ROLE_LABELS;
  readonly operations = OPERATIONS;
  readonly policy = DEMO_POLICY;
  readonly presets = AMOUNT_PRESETS;
  readonly simulations = SIMULATIONS;
  readonly errorSimulations = ERROR_SIMULATIONS;
  readonly explorerTx = 'https://celoscan.io/tx/';
  readonly simulationCode = signal(ERROR_SIMULATIONS[0]);

  readonly selectedOperationId = signal(OPERATIONS[0].id);
  readonly selectedOperation = computed(
    () => OPERATIONS.find((op) => op.id === this.selectedOperationId()) ?? OPERATIONS[0],
  );

  readonly form = this.fb.nonNullable.group({
    to: ['transportista' as PartyRole, Validators.required],
    amount: [
      '1.500,00',
      [Validators.required, Validators.pattern(/^\s*\$?\s*[\d.,]+\s*$/)],
    ],
  });

  readonly loading = signal(false);
  readonly result = signal<PaymentResult | null>(null);

  readonly message = computed(() => {
    const result = this.result();
    if (!result) return '';
    if (result.code) {
      return ERROR_MESSAGES[result.code] ?? FALLBACK_ERROR_MESSAGE;
    }
    switch (result.status) {
      case 'dry-run':
        return 'Así quedaría el pago. No se movió dinero.';
      case 'sent':
        return 'El pago se envió correctamente.';
      case 'blocked':
        return 'Pago detenido por una verificación interna.';
      case 'failed':
        return 'No se pudo enviar. Probá de nuevo más tarde.';
      default:
        return FALLBACK_ERROR_MESSAGE;
    }
  });

  selectOperation(id: string): void {
    this.selectedOperationId.set(id);
    const operation = OPERATIONS.find((op) => op.id === id);
    if (!operation) return;

    const current = this.form.controls.to.value;
    if (!operation.parties[current].confirmed) {
      const firstConfirmed = ROLES.find((role) => operation.parties[role].confirmed);
      if (firstConfirmed) this.form.controls.to.setValue(firstConfirmed);
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.run(this.buildRequest());
  }

  simulate(value: string): void {
    this.run(this.buildRequest(), value);
  }

  simulateSelectedCode(): void {
    this.simulate(this.simulationCode());
  }

  setSimulationCode(event: Event): void {
    this.simulationCode.set((event.target as HTMLSelectElement).value);
  }

  statusLabel(status: PaymentResult['status']): string {
    return STATUS_LABELS[status];
  }

  roleLabel(value?: string): string {
    if (value && value in ROLE_LABELS) {
      return ROLE_LABELS[value as PartyRole];
    }
    return value ?? '';
  }

  confirmedCount(operation: OperationView): number {
    return ROLES.filter((role) => operation.parties[role].confirmed).length;
  }

  shortAddress(address: string): string {
    return `${address.slice(0, 6)}…${address.slice(-4)}`;
  }

  formatArs(value: number): string {
    return `ARS ${new Intl.NumberFormat('es-AR').format(value)}`;
  }

  private buildRequest(): PaymentRequest {
    return {
      operation: this.selectedOperationId(),
      ...this.form.getRawValue(),
    };
  }

  private run(request: PaymentRequest, simulate?: string): void {
    this.loading.set(true);
    this.result.set(null);

    this.paymentService.pay(request, simulate).subscribe({
      next: (result) => {
        this.result.set(result);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.result.set({
          status: 'failed',
          code: 'NETWORK_ERROR',
          error: error instanceof Error ? error.message : String(error),
        });
        this.loading.set(false);
      },
    });
  }
}
