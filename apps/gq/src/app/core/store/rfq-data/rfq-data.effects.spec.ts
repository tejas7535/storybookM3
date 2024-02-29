import { HttpClientTestingModule } from '@angular/common/http/testing';

import { of } from 'rxjs';

import { ActiveCaseActions } from '@gq/core/store/active-case/active-case.action';
import { ActiveCaseFacade } from '@gq/core/store/active-case/active-case.facade';
import { Quotation, RfqData } from '@gq/shared/models';
import { QuotationDetailsService } from '@gq/shared/services/rest/quotation-details/quotation-details.service';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { MockProvider } from 'ng-mocks';
import { marbles } from 'rxjs-marbles';

import {
  QUOTATION_DETAIL_MOCK,
  QUOTATION_MOCK,
} from '../../../../testing/mocks';
import { RfqDataActions } from './rfq-data.actions';
import { RfqDataEffects } from './rfq-data.effects';
import { initialState } from './rfq-data.reducer';

describe('RfqDataEffects', () => {
  let action: any;
  let actions$: Actions;
  let effects: RfqDataEffects;
  let spectator: SpectatorService<RfqDataEffects>;

  let quotationDetailsService: QuotationDetailsService;

  const createService = createServiceFactory({
    service: RfqDataEffects,
    imports: [HttpClientTestingModule],
    providers: [
      provideMockActions(() => actions$),
      provideMockStore({ initialState: { rfqData: initialState } }),
      MockProvider(ActiveCaseFacade, {
        quotationCurrency$: of('EUR'),
        quotationSapId$: of('12345'),
        selectedQuotationDetail$: of(QUOTATION_DETAIL_MOCK),
      }),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(RfqDataEffects);

    quotationDetailsService = spectator.inject(QuotationDetailsService);
  });

  test('should be created', () => {
    expect(effects).toBeTruthy();
    expect(quotationDetailsService).toBeTruthy();
  });

  describe('loadRfqData$', () => {
    action = RfqDataActions.getRfqData({
      quotationItemId: 10,
      sapId: '123',
    });

    test(
      'should dispatch success action',
      marbles((m) => {
        const result = RfqDataActions.getRfqDataSuccess({
          item: {} as RfqData,
        });
        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|', { a: {} as RfqData });
        quotationDetailsService.getRfqData = jest.fn(() => response);

        const expected = m.cold('--b', { b: result });
        m.expect(effects.loadRfqData$).toBeObservable(expected);
        m.flush();

        expect(quotationDetailsService.getRfqData).toHaveBeenCalledTimes(1);
        expect(quotationDetailsService.getRfqData).toHaveBeenCalledWith(
          action.sapId,
          action.quotationItemId,
          'EUR'
        );
      })
    );
    test(
      'should dispatch error action',
      marbles((m) => {
        const errorMessage = 'Oops, an error occurred';
        const result = RfqDataActions.getRfqDataFailure({
          errorMessage,
        });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-#|', undefined, errorMessage);
        const expected = m.cold('--b', { b: result });

        quotationDetailsService.getRfqData = jest.fn(() => response);

        m.expect(effects.loadRfqData$).toBeObservable(expected);
        m.flush();
        expect(quotationDetailsService.getRfqData).toHaveBeenCalledTimes(1);
        expect(quotationDetailsService.getRfqData).toHaveBeenCalledWith(
          action.sapId,
          action.quotationItemId,
          'EUR'
        );
      })
    );
  });

  describe('triggerLoadRfqData$', () => {
    test(
      'should dispatch getRfqData action with needed data',
      marbles((m) => {
        action = ActiveCaseActions.getQuotationSuccess({
          item: {} as Quotation,
        });

        actions$ = m.hot('-a', { a: action });

        const expected = m.hot('-a', {
          a: RfqDataActions.getRfqData({
            sapId: QUOTATION_MOCK.sapId,
            quotationItemId: QUOTATION_DETAIL_MOCK.quotationItemId,
          }),
        });

        m.expect(effects.triggerLoadRfqData$).toBeObservable(expected);
      })
    );
    test('should dispatch resetRfqData action when quotation is undefined', () => {
      action = ActiveCaseActions.getQuotationSuccess({
        item: undefined,
      });

      actions$ = of(action);

      effects.triggerLoadRfqData$.subscribe((result) => {
        expect(result).toEqual(RfqDataActions.resetRfqData());
      });
    });

    test('should dispatch resetRfqData action when quotation.rfqData is undefined', () => {
      action = ActiveCaseActions.getQuotationSuccess({
        item: { rfqData: undefined } as unknown as Quotation,
      });

      actions$ = of(action);

      effects.triggerLoadRfqData$.subscribe((result) => {
        expect(result).toEqual(RfqDataActions.resetRfqData());
      });
    });
  });
});
