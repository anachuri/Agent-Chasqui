import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { PaymentRequest, PaymentResult, PolicyView } from './models';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;
  private readonly policyUrl = environment.policyUrl;

  policy(): Observable<PolicyView> {
    return this.http.get<PolicyView>(this.policyUrl);
  }

  pay(request: PaymentRequest, simulate?: string): Observable<PaymentResult> {
    const url = simulate
      ? `${this.apiUrl}?simulate=${encodeURIComponent(simulate)}`
      : this.apiUrl;

    return this.http.post<PaymentResult>(url, request).pipe(
      catchError((error: unknown) => of(this.toFailure(error))),
    );
  }

  private toFailure(error: unknown): PaymentResult {
    const httpError = error as HttpErrorResponse;
    const body = httpError?.error as PaymentResult | string | null;

    if (body && typeof body === 'object' && 'status' in body) {
      return body;
    }

    const message =
      httpError?.status && httpError.status > 0 ? `HTTP ${httpError.status}` : undefined;

    return { status: 'failed', code: 'NETWORK_ERROR', error: message };
  }
}
