import { HttpClientTestingModule } from '@angular/common/http/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { AppRoutePath } from '../../../../app-route-path.enum';
import { MaterialComparableCost } from '../../../../shared/models/quotation-detail/material-comparable-cost.model';
import { QuotationDetailsService } from '../../../../shared/services/rest-services/quotation-details-service/quotation-details.service';
import {
  loadMaterialComparableCosts,
  loadMaterialComparableCostsFailure,
  loadMaterialComparableCostsSuccess,
} from '../../actions';
import { getPriceUnitOfSelectedQuotationDetail } from '../../selectors';
import { MaterialComparableCostEffect } from './material-comparable-costs.effects';

describe('MaterialComparableCostEffect', () => {
  let spectator: SpectatorService<MaterialComparableCostEffect>;
  let effects: MaterialComparableCostEffect;
  let actions$: any;
  let action: any;
  let quotationDetailsService: QuotationDetailsService;
  let store: MockStore;

  const errorMessage = 'An error occurred';

  const createService = createServiceFactory({
    service: MaterialComparableCostEffect,
    imports: [HttpClientTestingModule],
    providers: [provideMockActions(() => actions$), provideMockStore()],
  });
  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(MaterialComparableCostEffect);
    store = spectator.inject(MockStore);
    quotationDetailsService = spectator.inject(QuotationDetailsService);
  });

  describe('triggerLoadMaterialComparableCosts$', () => {
    test(
      'should return loadMaterialComparableCosts',
      marbles((m) => {
        const queryParams = {
          gqPositionId: '5678',
        };
        action = {
          type: ROUTER_NAVIGATED,
          payload: {
            routerState: {
              queryParams,
              url: `/${AppRoutePath.DetailViewPath}`,
            },
          },
        };
        const gqPositionId = queryParams.gqPositionId;
        const result = loadMaterialComparableCosts({ gqPositionId });

        actions$ = m.hot('-a', { a: action });

        const expected$ = m.cold('-b', { b: result });
        m.expect(effects.triggerLoadMaterialComparableCosts$).toBeObservable(
          expected$
        );
      })
    );
  });

  describe('loadMaterialComparableCosts$', () => {
    const gqPositionId = '5678';
    const materialComparableCosts: MaterialComparableCost[] = [];

    beforeEach(() => {
      store.overrideSelector(getPriceUnitOfSelectedQuotationDetail, 1);
      action = loadMaterialComparableCosts({ gqPositionId });
    });

    test(
      'should return loadMaterialComparableCostsSuccess',
      marbles((m) => {
        action = loadMaterialComparableCosts({ gqPositionId });

        const result = loadMaterialComparableCostsSuccess({
          materialComparableCosts,
        });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-a|', { a: materialComparableCosts });
        quotationDetailsService.getMaterialComparableCosts = jest.fn(
          () => response
        );

        const expected$ = m.cold('--b', { b: result });

        m.expect(effects.loadMaterialComparableCosts$).toBeObservable(
          expected$
        );

        m.flush();

        expect(
          quotationDetailsService.getMaterialComparableCosts
        ).toHaveBeenCalledTimes(1);
        expect(
          quotationDetailsService.getMaterialComparableCosts
        ).toHaveBeenCalledWith(gqPositionId);
      })
    );

    test(
      'should return loadMaterialComparableCostsFailure',
      marbles((m) => {
        action = loadMaterialComparableCosts({ gqPositionId });

        const result = loadMaterialComparableCostsFailure({ errorMessage });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-#|', undefined, errorMessage);
        const expected = m.cold('--b', { b: result });
        quotationDetailsService.getMaterialComparableCosts = jest.fn(
          () => response
        );

        m.expect(effects.loadMaterialComparableCosts$).toBeObservable(expected);
        m.flush();

        expect(
          quotationDetailsService.getMaterialComparableCosts
        ).toHaveBeenCalledTimes(1);
      })
    );
  });
});
