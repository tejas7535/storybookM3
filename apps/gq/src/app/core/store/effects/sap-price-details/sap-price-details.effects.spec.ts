import { HttpClientTestingModule } from '@angular/common/http/testing';

import { of } from 'rxjs';

import { QuotationDetailsService } from '@gq/shared/services/rest/quotation-details/quotation-details.service';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import {
  EXTENDED_SAP_PRICE_DETAIL_MOCK,
  SAP_PRICE_DETAIL_ZMIN_MOCK,
} from '../../../../../testing/mocks';
import { AppRoutePath } from '../../../../app-route-path.enum';
import { DetailRoutePath } from '../../../../detail-view/detail-route-path.enum';
import {
  loadExtendedSapPriceConditionDetails,
  loadExtendedSapPriceConditionDetailsFailure,
  loadExtendedSapPriceConditionDetailsSuccess,
  loadSapPriceDetails,
  loadSapPriceDetailsFailure,
  loadSapPriceDetailsSuccess,
} from '../../actions';
import { getGqId } from '../../active-case/active-case.selectors';
import { SapPriceDetailsEffects } from './sap-price-details.effects';

describe('SapPriceDetailsEffects', () => {
  let spectator: SpectatorService<SapPriceDetailsEffects>;
  let effects: SapPriceDetailsEffects;
  let actions$: any;
  let action: any;
  let quotationDetailsService: QuotationDetailsService;
  let store: MockStore;

  const createService = createServiceFactory({
    service: SapPriceDetailsEffects,
    imports: [HttpClientTestingModule],
    providers: [provideMockActions(() => actions$), provideMockStore()],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(SapPriceDetailsEffects);
    quotationDetailsService = spectator.inject(QuotationDetailsService);
    store = spectator.inject(MockStore);
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
        m.flush();
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

  describe('loadExtendedSapPriceConditionDetails$', () => {
    beforeEach(() => {
      store.overrideSelector(getGqId, 1234);
      action = loadExtendedSapPriceConditionDetails();
    });
    test(
      'should return loadExtendedSapPriceConditionDetailsSuccess',
      marbles((m) => {
        const extendedSapPriceConditionDetails = [
          EXTENDED_SAP_PRICE_DETAIL_MOCK,
        ];
        quotationDetailsService.getExtendedSapPriceConditionDetails = jest.fn(
          () => of(extendedSapPriceConditionDetails)
        );
        const result = loadExtendedSapPriceConditionDetailsSuccess({
          extendedSapPriceConditionDetails,
        });

        actions$ = m.hot('-a', { a: action });

        const expected$ = m.cold('-b', { b: result });

        m.expect(effects.loadExtendedSapPriceConditionDetails$).toBeObservable(
          expected$
        );
      })
    );

    test(
      'should return loadExtendedSapPriceConditionDetailsFailure',
      marbles((m) => {
        const errorMessage = 'error';
        const result = loadExtendedSapPriceConditionDetailsFailure({
          errorMessage,
        });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-#|', undefined, errorMessage);

        const expected = m.cold('--b', { b: result });
        quotationDetailsService.getExtendedSapPriceConditionDetails = jest.fn(
          () => response
        );

        m.expect(effects.loadExtendedSapPriceConditionDetails$).toBeObservable(
          expected
        );
        m.flush();

        expect(
          quotationDetailsService.getExtendedSapPriceConditionDetails
        ).toHaveBeenCalledTimes(1);
      })
    );
  });
});
