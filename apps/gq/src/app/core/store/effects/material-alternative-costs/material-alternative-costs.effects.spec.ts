import { HttpClientTestingModule } from '@angular/common/http/testing';

import { marbles } from 'rxjs-marbles';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { ENV_CONFIG } from '@schaeffler/http';

import { AppRoutePath } from '../../../../app-route-path.enum';
import { QuotationDetailsService } from '../../../../shared/services/rest-services/quotation-details-service/quotation-details.service';
import { getPriceUnitOfSelectedQuotationDetail } from '../../selectors';
import { MaterialAlternativeCostEffect } from './material-alternative-costs.effects';
import {
  loadMaterialAlternativeCosts,
  loadMaterialAlternativeCostsFailure,
  loadMaterialAlternativeCostsSuccess,
} from '../../actions';
import { MaterialAlternativeCost } from '../../../../shared/models/quotation-detail/material-alternative-cost.model';

describe('MaterialAlternativeCostEffect', () => {
  let spectator: SpectatorService<MaterialAlternativeCostEffect>;
  let effects: MaterialAlternativeCostEffect;
  let actions$: any;
  let action: any;
  let quotationDetailsService: QuotationDetailsService;
  let store: MockStore;

  const errorMessage = 'An error occurred';

  const createService = createServiceFactory({
    service: MaterialAlternativeCostEffect,
    imports: [HttpClientTestingModule],
    providers: [
      provideMockActions(() => actions$),
      provideMockStore(),
      {
        provide: ENV_CONFIG,
        useValue: {
          environment: {
            baseUrl: '',
          },
        },
      },
    ],
  });
  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(MaterialAlternativeCostEffect);
    store = spectator.inject(MockStore);
    quotationDetailsService = spectator.inject(QuotationDetailsService);
  });

  describe('triggerLoadMaterialAlternativeCosts$', () => {
    test(
      'should return loadMaterialAlternativeCosts',
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
        const result = loadMaterialAlternativeCosts({ gqPositionId });

        actions$ = m.hot('-a', { a: action });

        const expected$ = m.cold('-b', { b: result });
        m.expect(effects.triggerLoadMaterialAlternativeCosts$).toBeObservable(
          expected$
        );
      })
    );
  });

  describe('loadMaterialAlternativeCosts$', () => {
    const gqPositionId = '5678';
    const materialAlternativeCosts: MaterialAlternativeCost[] = [];

    beforeEach(() => {
      store.overrideSelector(getPriceUnitOfSelectedQuotationDetail, 1);
      action = loadMaterialAlternativeCosts({ gqPositionId });
    });

    test(
      'should return loadMaterialAlternativeCostsSuccess',
      marbles((m) => {
        action = loadMaterialAlternativeCosts({ gqPositionId });

        const result = loadMaterialAlternativeCostsSuccess({
          materialAlternativeCosts,
        });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-a|', { a: materialAlternativeCosts });
        quotationDetailsService.getMaterialAlternativeCosts = jest.fn(
          () => response
        );

        const expected$ = m.cold('--b', { b: result });

        m.expect(effects.loadMaterialAlternativeCosts$).toBeObservable(
          expected$
        );

        m.flush();

        expect(
          quotationDetailsService.getMaterialAlternativeCosts
        ).toHaveBeenCalledTimes(1);
        expect(
          quotationDetailsService.getMaterialAlternativeCosts
        ).toHaveBeenCalledWith(gqPositionId);
      })
    );

    test(
      'should return loadMaterialAlternativeCostsFailure',
      marbles((m) => {
        action = loadMaterialAlternativeCosts({ gqPositionId });

        const result = loadMaterialAlternativeCostsFailure({ errorMessage });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-#|', undefined, errorMessage);
        const expected = m.cold('--b', { b: result });
        quotationDetailsService.getMaterialAlternativeCosts = jest.fn(
          () => response
        );

        m.expect(effects.loadMaterialAlternativeCosts$).toBeObservable(
          expected
        );
        m.flush();

        expect(
          quotationDetailsService.getMaterialAlternativeCosts
        ).toHaveBeenCalledTimes(1);
      })
    );
  });
});
