import { HttpClientTestingModule } from '@angular/common/http/testing';

import { of } from 'rxjs';

import { AppRoutePath } from '@gq/app-route-path.enum';
import { QuotationDetailsSummaryKpi } from '@gq/shared/models/quotation/quotation-details-summary-kpi.interface';
import { CalculationService } from '@gq/shared/services/rest/calculation/calculation.service';
import { QuotationKpiRequest } from '@gq/shared/services/rest/calculation/model/quotation-kpi-request.interface';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { marbles } from 'rxjs-marbles';

import {
  QUOTATION_DETAIL_MOCK,
  QUOTATION_DETAILS_MOCK,
} from '../../../../../../testing/mocks/models/quotation-detail/quotation-details.mock';
import { SelectedQuotationDetailsKpiActions } from './selected-quotation-details-kpi.actions';
import { SelectedQuotationDetailsKpiEffects } from './selected-quotation-details-kpi.effects';

describe('SelectedQuotationDetailsKpiEffects', () => {
  let spectator: SpectatorService<SelectedQuotationDetailsKpiEffects>;
  let action: any;
  let actions$: any;
  let effects: SelectedQuotationDetailsKpiEffects;

  let calculationService: CalculationService;

  const createService = createServiceFactory({
    service: SelectedQuotationDetailsKpiEffects,
    imports: [HttpClientTestingModule],
    providers: [provideMockActions(() => actions$)],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(SelectedQuotationDetailsKpiEffects);

    calculationService = spectator.inject(CalculationService);
  });

  test('should be created', () => {
    expect(effects).toBeTruthy();
    expect(calculationService).toBeTruthy();
  });

  describe('getQuotationKpi$', () => {
    test(
      'should dispatch sucess action',
      marbles((m) => {
        action = SelectedQuotationDetailsKpiActions.loadKPI({
          data: [QUOTATION_DETAIL_MOCK],
        });

        const response: QuotationDetailsSummaryKpi = {
          amountOfQuotationDetails: 1,
          totalNetValue: 1,
          totalWeightedAveragePriceDiff: 1,
          totalWeightedAverageGpi: 1,
          totalWeightedAverageGpm: 1,
          avgGqRating: 3,
        };
        calculationService.getQuotationKpiCalculation = jest.fn(() =>
          of(response)
        );

        const result = SelectedQuotationDetailsKpiActions.loadKPISuccess({
          response,
        });
        const expected = m.cold('b', { b: result });
        actions$ = m.hot('a', { a: action });

        m.expect(effects.getSelectedQuotationDetailKpi$).toBeObservable(
          expected
        );
        m.flush();
        expect(
          calculationService.getQuotationKpiCalculation
        ).toHaveBeenCalled();
        const expectedRequest: QuotationKpiRequest = {
          detailKpiList: [
            {
              gpi: 0.9,
              gpm: 0.85,
              materialNumber15: '016718798-0030',
              netValue: 2000,
              priceDiff: 0.1765,
              quantity: 10,
              rfqDataGpm: 0.1032,
              gqRating: 2,
            },
          ],
        };
        expect(
          calculationService.getQuotationKpiCalculation
        ).toHaveBeenCalledWith(expectedRequest);
      })
    );

    test(
      'should dispatch reset action',
      marbles((m) => {
        action = SelectedQuotationDetailsKpiActions.loadKPI({
          data: [],
        });
        calculationService.getQuotationKpiCalculation = jest.fn();

        const result = SelectedQuotationDetailsKpiActions.resetKPI();
        const expected = m.cold('b', { b: result });
        actions$ = m.hot('a', { a: action });

        m.expect(effects.getSelectedQuotationDetailKpi$).toBeObservable(
          expected
        );
        m.flush();
        expect(
          calculationService.getQuotationKpiCalculation
        ).not.toHaveBeenCalled();
      })
    );

    test(
      'should dispatch failure action',
      marbles((m) => {
        action = SelectedQuotationDetailsKpiActions.loadKPI({
          data: QUOTATION_DETAILS_MOCK,
        });
        const error = new Error('error');
        const result = SelectedQuotationDetailsKpiActions.loadKPIFailure({
          error,
        });
        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-#|', undefined, error);
        const expected = m.cold('--b', { b: result });

        calculationService.getQuotationKpiCalculation = jest.fn(() => response);

        m.expect(effects.getSelectedQuotationDetailKpi$).toBeObservable(
          expected
        );
        m.flush();

        expect(
          calculationService.getQuotationKpiCalculation
        ).toHaveBeenCalledTimes(1);
      })
    );
  });

  describe('resetSelectedQuotationDetailKpi$', () => {
    test(
      'should dispatch reset action',
      marbles((m) => {
        action = {
          type: ROUTER_NAVIGATED,
          payload: {
            routerState: {
              url: `/${AppRoutePath.ProcessCaseViewPath}`,
            },
          },
        };
        actions$ = m.hot('-a', { a: action });

        const result = SelectedQuotationDetailsKpiActions.resetKPI();
        const expected = m.cold('-b', { b: result });

        m.expect(effects.resetSelectedQuotationDetailKpi$).toBeObservable(
          expected
        );
        m.flush();
      })
    );
  });
});
