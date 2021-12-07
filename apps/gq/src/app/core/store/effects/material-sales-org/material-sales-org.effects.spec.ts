import { HttpClientTestingModule } from '@angular/common/http/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { MATERIAL_SALESORG_MOCK } from '../../../../../testing/mocks/models';
import { AppRoutePath } from '../../../../app-route-path.enum';
import { MaterialSalesOrg } from '../../../../shared/models/quotation-detail/material-sales-org.model';
import { QuotationDetailsService } from '../../../../shared/services/rest-services/quotation-details-service/quotation-details.service';
import {
  loadMaterialSalesOrg,
  loadMaterialSalesOrgFailure,
  loadMaterialSalesOrgSuccess,
} from '../../actions';
import { getPriceUnitOfSelectedQuotationDetail } from '../../selectors';
import { MaterialSalesOrgEffect } from './material-sales-org.effects';

describe('materialSalesOrg Effect', () => {
  let spectator: SpectatorService<MaterialSalesOrgEffect>;
  let effects: MaterialSalesOrgEffect;
  let actions$: any;
  let action: any;
  let quotationDetailsService: QuotationDetailsService;
  let store: MockStore;

  const errorMessage = 'An error occurred';

  const createService = createServiceFactory({
    service: MaterialSalesOrgEffect,
    imports: [HttpClientTestingModule],
    providers: [provideMockActions(() => actions$), provideMockStore()],
  });
  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(MaterialSalesOrgEffect);
    store = spectator.inject(MockStore);
    quotationDetailsService = spectator.inject(QuotationDetailsService);
  });

  describe('triggerLoadMaterialSalesOrg$', () => {
    test(
      'should return loadMaterialSalesOrg',
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
        const result = loadMaterialSalesOrg({ gqPositionId });

        actions$ = m.hot('-a', { a: action });

        const expected$ = m.cold('-b', { b: result });
        m.expect(effects.triggerMaterialSalesOrgs$).toBeObservable(expected$);
      })
    );
  });

  describe('loadMaterialSalesOrg$', () => {
    const gqPositionId = '5678';
    const materialSalesOrg: MaterialSalesOrg = MATERIAL_SALESORG_MOCK;

    beforeEach(() => {
      store.overrideSelector(getPriceUnitOfSelectedQuotationDetail, 1);
      action = loadMaterialSalesOrg({ gqPositionId });
    });

    test(
      'should return loadMaterialSalesOrgSuccess',
      marbles((m) => {
        action = loadMaterialSalesOrg({ gqPositionId });

        const result = loadMaterialSalesOrgSuccess({
          materialSalesOrg,
        });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-a|', { a: materialSalesOrg });
        quotationDetailsService.getMaterialStatus = jest.fn(() => response);

        const expected$ = m.cold('--b', { b: result });

        m.expect(effects.loadMaterialSalesOrg$).toBeObservable(expected$);

        m.flush();

        expect(quotationDetailsService.getMaterialStatus).toHaveBeenCalledTimes(
          1
        );
        expect(quotationDetailsService.getMaterialStatus).toHaveBeenCalledWith(
          gqPositionId
        );
      })
    );

    test(
      'should return loadMaterialSalesOrgFailure',
      marbles((m) => {
        action = loadMaterialSalesOrg({ gqPositionId });

        const result = loadMaterialSalesOrgFailure({ errorMessage });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-#|', undefined, errorMessage);
        const expected = m.cold('--b', { b: result });
        quotationDetailsService.getMaterialStatus = jest.fn(() => response);

        m.expect(effects.loadMaterialSalesOrg$).toBeObservable(expected);
        m.flush();

        expect(quotationDetailsService.getMaterialStatus).toHaveBeenCalledTimes(
          1
        );
      })
    );
  });
});
