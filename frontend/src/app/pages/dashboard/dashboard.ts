import { JsonPipe } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  AMOUNT_PRESETS,
  OPERATIONS,
  ROLES,
  ROLE_LABEL_KEYS,
} from '../../core/demo-data';
import { TranslationService } from '../../core/i18n/translation.service';
import { Language } from '../../core/i18n/translations';
import {
  ERROR_MESSAGE_KEYS,
  ERROR_SIMULATIONS,
  FALLBACK_ERROR_KEY,
  SIMULATIONS,
  STATUS_LABEL_KEYS,
  STATUS_MESSAGE_KEYS,
} from '../../core/messages';
import {
  OperationView,
  PartyRole,
  PaymentRequest,
  PaymentResult,
  PolicyView,
} from '../../core/models';
import { PaymentService } from '../../core/payment.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  imports: [ReactiveFormsModule, JsonPipe, RouterLink],
  templateUrl: './dashboard.html',
})
export class Dashboard {
  private readonly paymentService = inject(PaymentService);
  private readonly fb = inject(FormBuilder);
  readonly i18n = inject(TranslationService);

  readonly roles = ROLES;
  readonly operations = OPERATIONS;
  readonly policy = signal<PolicyView | null>(null);
  readonly currency = computed(() => this.policy()?.currency ?? 'ARS');
  readonly presets = computed(() => AMOUNT_PRESETS[this.i18n.language()]);
  readonly simulations = SIMULATIONS;
  readonly errorSimulations = ERROR_SIMULATIONS;
  readonly explorerTx = environment.explorerTx;
  readonly explorerAddress = environment.explorerUrl;
  readonly agentWallet = environment.agentWallet;
  readonly agentTag = environment.agentTag;
  readonly chainId = environment.chainId;
  readonly simulationCode = signal(ERROR_SIMULATIONS[0]);

  private previousLanguage: Language = this.i18n.language();

  readonly selectedOperationId = signal(OPERATIONS[0].id);
  readonly selectedOperation = computed(
    () => OPERATIONS.find((op) => op.id === this.selectedOperationId()) ?? OPERATIONS[0],
  );

  readonly form = this.fb.nonNullable.group({
    to: ['transportista' as PartyRole, Validators.required],
    amount: [
      AMOUNT_PRESETS[this.i18n.language()][0],
      [Validators.required, Validators.pattern(/^\s*\$?\s*[\d.,]+\s*$/)],
    ],
  });

  readonly loading = signal(false);
  readonly result = signal<PaymentResult | null>(null);

  readonly message = computed(() => {
    const result = this.result();
    if (!result) return '';
    if (result.code) {
      return this.i18n.t(ERROR_MESSAGE_KEYS[result.code] ?? FALLBACK_ERROR_KEY);
    }
    return this.i18n.t(STATUS_MESSAGE_KEYS[result.status]);
  });

  constructor() {
    this.i18n.setPageTitle('meta.title');

    effect(() => {
      const language = this.i18n.language();
      if (language === this.previousLanguage) return;

      const currentAmount = this.form.controls.amount.value;
      const previousDefault = AMOUNT_PRESETS[this.previousLanguage][0];
      if (currentAmount === previousDefault) {
        this.form.controls.amount.setValue(AMOUNT_PRESETS[language][0]);
      }
      this.previousLanguage = language;
    });

    this.paymentService.policy().subscribe({
      next: (policy) => this.policy.set(policy),
      error: () => this.policy.set(null),
    });
  }

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
    return this.i18n.t(STATUS_LABEL_KEYS[status]);
  }

  roleLabel(value?: string): string {
    if (value && value in ROLE_LABEL_KEYS) {
      return this.i18n.t(ROLE_LABEL_KEYS[value as PartyRole]);
    }
    return value ?? '';
  }

  confirmedCount(operation: OperationView): number {
    return ROLES.filter((role) => operation.parties[role].confirmed).length;
  }

  shortAddress(address: string): string {
    return `${address.slice(0, 6)}…${address.slice(-4)}`;
  }

  formatArs(cents: string | number | null | undefined): string {
    if (cents === null || cents === undefined || cents === '') return '—';
    const value = Number(cents) / 100;
    return `${this.currency()} ${new Intl.NumberFormat(this.i18n.locale()).format(value)}`;
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
