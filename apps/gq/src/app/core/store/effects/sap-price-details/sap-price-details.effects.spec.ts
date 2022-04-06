import { HttpClientTestingModule } from '@angular/common/http/testing';

import { of } from 'rxjs';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { marbles } from 'rxjs-marbles';

import { SAP_PRICE_DETAIL_ZMIN_MOCK } from '../../../../../testing/mocks';
import { AppRoutePath } from '../../../../app-route-path.enum';
import { DetailRoutePath } from '../../../../detail-view/detail-route-path.enum';
import { QuotationDetailsService } from '../../../../shared/services/rest-services/quotation-details-service/quotation-details.service';
import {
  loadSapPriceDetails,
  loadSapPriceDetailsFailure,
  loadSapPriceDetailsSuccess,
} from '../..';
import { SapPriceDetailsEffects } from './sap-price-details.effects';

describe('SapPriceDetailsEffects', () => {
  let spectator: SpectatorService<SapPriceDetailsEffects>;
  let effects: SapPriceDetailsEffects;
  let actions$: any;
  let action: any;
  let quotationDetailsService: QuotationDetailsService;

  const createService = createServiceFactory({
    service: SapPriceDetailsEffects,
    imports: [HttpClientTestingModule],
    providers: [provideMockActions(() => actions$)],
  });
  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(SapPriceDetailsEffects);
    quotationDetailsService = spectator.inject(QuotationDetailsService);
  });

  describe('triggerLoadSapPriceDetails', () => {
    test(
      'should return loadSapPriceDetails$',
      marbles((m) => {
        const queryParams = {
          gqPositionId: '1234',
        };

        action = {
          type: ROUTER_NAVIGATED,
          payload: {
            routerState: {
              queryParams,
              url: `/${AppRoutePath.DetailViewPath}/${DetailRoutePath.SapPath}`,
            },
          },
        };
        const gqPositionId = queryParams.gqPositionId;
        const result = loadSapPriceDetails({ gqPositionId });

        actions$ = m.hot('-a', { a: action });

        const expected$ = m.cold('-b', { b: result });
        m.expect(effects.triggerLoadSapPriceDetails$).toBeObservable(expected$);
      })
    );
  });
  describe('loadSapPriceDetails$', () => {
    beforeEach(() => {
      action = loadSapPriceDetails({ gqPositionId: '1234' });
    });
    test(
      'should return loadSapPriceDetailsSuccess',
      marbles((m) => {
        const sapPriceDetails = [SAP_PRICE_DETAIL_ZMIN_MOCK];
        quotationDetailsService.getSapPriceDetails = jest.fn(() =>
          of(sapPriceDetails)
        );
        const result = loadSapPriceDetailsSuccess({ sapPriceDetails });

        actions$ = m.hot('-a', { a: action });

        const expected$ = m.cold('-b', { b: result });

        m.expect(effects.loadSapPriceDetails$).toBeObservable(expected$);
      })
    );

    test(
      'should return loadSapPriceDetailsFailure',
      marbles((m) => {
        const errorMessage = 'error';
        const result = loadSapPriceDetailsFailure({ errorMessage });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-#|', undefined, errorMessage);

        const expected = m.cold('--b', { b: result });
        quotationDetailsService.getSapPriceDetails = jest.fn(() => response);

        m.expect(effects.loadSapPriceDetails$).toBeObservable(expected);
        m.flush();

        expect(
          quotationDetailsService.getSapPriceDetails
        ).toHaveBeenCalledTimes(1);
      })
    );
  });
});
