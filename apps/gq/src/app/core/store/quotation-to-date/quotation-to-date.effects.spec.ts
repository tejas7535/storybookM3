import { HttpClientTestingModule } from '@angular/common/http/testing';

import { QuotationToDateActions } from '@gq/core/store/quotation-to-date/quotation-to-date.actions';
import { QuotationToDateEffects } from '@gq/core/store/quotation-to-date/quotation-to-date.effects';
import { QuotationToDate } from '@gq/core/store/quotation-to-date/quotation-to-date.model';
import { QuotationService } from '@gq/shared/services/rest/quotation/quotation.service';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { marbles } from 'rxjs-marbles/jest';

describe('QuotationToDateEffects', () => {
  let action: any;
  let actions$: Actions;
  let effects: QuotationToDateEffects;
  let spectator: SpectatorService<QuotationToDateEffects>;
  let quotationService: QuotationService;

  const screateService = createServiceFactory({
    service: QuotationToDateEffects,
    imports: [HttpClientTestingModule],
    providers: [provideMockActions(() => actions$)],
  });

  beforeEach(() => {
    spectator = screateService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(QuotationToDateEffects);
    quotationService = spectator.inject(QuotationService);
  });

  test('should be created', () => {
    expect(effects).toBeTruthy();
    expect(quotationService).toBeTruthy();
  });

  describe('getQuotationToDate$', () => {
    action = QuotationToDateActions.getQuotationToDate({
      customerId: {
        customerId: '2014',
        salesOrg: '2015',
      },
    });

    test(
      'should dispatch success action',
      marbles((m) => {
        const quotationToDate: QuotationToDate = {
          extendedDate: '2024-12-31',
          extendedDateForManyItems: '2025-01-01',
          manyItemsDateThreshold: 20,
        };

        const result = QuotationToDateActions.getQuotationToDateSuccess({
          quotationToDate,
        });

        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|', { a: quotationToDate });
        quotationService.getQuotationToDateForCaseCreation = jest.fn(
          () => response
        );

        const expected = m.cold('--b', { b: result });
        m.expect(effects.getQuotationToDate$).toBeObservable(expected);
        m.flush();
        expect(
          quotationService.getQuotationToDateForCaseCreation
        ).toHaveBeenCalledWith({ customerId: '2014', salesOrg: '2015' });
      })
    );

    test(
      'should dispatch error action',
      marbles((m) => {
        const errorMessage = 'Error message';

        const result = QuotationToDateActions.getQuotationToDateFailure({
          errorMessage,
        });

        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-#|', {}, errorMessage);
        quotationService.getQuotationToDateForCaseCreation = jest.fn(
          () => response
        );

        const expected = m.cold('--b', { b: result });
        m.expect(effects.getQuotationToDate$).toBeObservable(expected);
        m.flush();
        expect(
          quotationService.getQuotationToDateForCaseCreation
        ).toHaveBeenCalledWith({ customerId: '2014', salesOrg: '2015' });
      })
    );
  });
});
