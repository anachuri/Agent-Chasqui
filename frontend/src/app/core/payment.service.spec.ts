import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { PaymentService } from './payment.service';

describe('PaymentService', () => {
  let service: PaymentService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(PaymentService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('gets the policy limits from /api/policy', () => {
    service.policy().subscribe((policy) => {
      expect(policy.maxPerPaymentCents).toBe('500000');
      expect(policy.dailyBudgetCents).toBe('2000000');
    });

    const req = http.expectOne('/api/policy');
    expect(req.request.method).toBe('GET');
    req.flush({
      currency: 'ARS',
      maxPerPaymentCents: '500000',
      dailyBudgetCents: '2000000',
      mode: 'dry-run',
    });
  });

  it('posts the payment request to /api/pay', () => {
    service
      .pay({ operation: 'OP-DEMO-1', to: 'transportista', amount: '1.500,00' })
      .subscribe((result) => expect(result.status).toBe('dry-run'));

    const req = http.expectOne('/api/pay');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      operation: 'OP-DEMO-1',
      to: 'transportista',
      amount: '1.500,00',
    });
    req.flush({ status: 'dry-run' });
  });

  it('adds the simulate query param', () => {
    service
      .pay({ operation: 'OP-DEMO-1', to: 'exportador', amount: '100' }, 'sent')
      .subscribe();

    const req = http.expectOne('/api/pay?simulate=sent');
    req.flush({ status: 'sent', simulated: true });
  });

  it('passes through error bodies returned by the API', () => {
    service
      .pay({ operation: 'OP-DEMO-1', to: 'exportador', amount: '6000' })
      .subscribe((result) => expect(result.code).toBe('OVER_PER_PAYMENT_CAP'));

    const req = http.expectOne('/api/pay');
    req.flush(
      { status: 'rejected', code: 'OVER_PER_PAYMENT_CAP' },
      { status: 400, statusText: 'Bad Request' },
    );
  });

  it('maps network failures to a failed result', () => {
    service
      .pay({ operation: 'OP-DEMO-1', to: 'exportador', amount: '100' })
      .subscribe((result) => {
        expect(result.status).toBe('failed');
        expect(result.code).toBe('NETWORK_ERROR');
      });

    http
      .expectOne('/api/pay')
      .error(new ProgressEvent('error'), { status: 0, statusText: 'Unknown Error' });
  });
});
