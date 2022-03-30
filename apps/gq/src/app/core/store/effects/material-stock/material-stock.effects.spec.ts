import { HttpClientModule } from '@angular/common/http';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import {
  QUOTATION_DETAIL_MOCK,
  QUOTATION_MOCK,
} from '../../../../../testing/mocks/models';
import { MATERIAL_STOCK_MOCK } from '../../../../../testing/mocks/models/material-stock.mock';
import { MaterialService } from '../../../../shared/services/rest-services/material-service/material.service';
import {
  getSelectedQuotationDetail,
  loadQuotationSuccess,
  setSelectedQuotationDetail,
} from '../..';
import {
  loadMaterialStock,
  loadMaterialStockFailure,
  loadMaterialStockSuccess,
  resetMaterialStock,
} from '../../actions/material-stock/material-stock.actions';
import { MaterialStockEffects } from './material-stock.effects';

describe('MaterialStockEffects', () => {
  let action: any;
  let actions$: Actions;
  let store: MockStore;

  let spectator: SpectatorService<MaterialStockEffects>;

  let effects: MaterialStockEffects;
  let materialService: MaterialService;

  const createService = createServiceFactory({
    service: MaterialStockEffects,
    imports: [HttpClientModule],
    providers: [provideMockStore(), provideMockActions(() => actions$)],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(MaterialStockEffects);
    materialService = spectator.inject(MaterialService);
    store = spectator.inject(MockStore);
  });

  describe('loadMaterialStock$', () => {
    const materialNumber15 = '123456789012345';
    const productionPlantId = '0215';
    action = loadMaterialStock({ materialNumber15, productionPlantId });

    const materialStock = MATERIAL_STOCK_MOCK;
    test(
      'should trigger loadMaterialStockSuccess',
      marbles((m) => {
        const result = loadMaterialStockSuccess({ materialStock });

        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|', { a: materialStock });
        materialService.getMaterialStock = jest.fn(() => response);

        const expected = m.cold('--b', { b: result });

        m.expect(effects.loadMaterialStock$).toBeObservable(expected);
        m.flush();
        expect(materialService.getMaterialStock).toHaveBeenCalledTimes(1);
        expect(materialService.getMaterialStock).toHaveBeenCalledWith(
          productionPlantId,
          materialNumber15
        );
      })
    );

    test(
      'should trigger loadMaterialStockFailure',
      marbles((m) => {
        const errorMessage = 'Oups, an error occured';
        const result = loadMaterialStockFailure({ errorMessage });

        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-#|', undefined, errorMessage);
        const expected = m.cold('--b', { b: result });

        materialService.getMaterialStock = jest.fn(() => response);

        m.expect(effects.loadMaterialStock$).toBeObservable(expected);
        m.flush();
        expect(materialService.getMaterialStock).toHaveBeenCalledTimes(1);
        expect(materialService.getMaterialStock).toHaveBeenCalledWith(
          productionPlantId,
          materialNumber15
        );
      })
    );
  });

  describe('triggerLoadMaterialStock$', () => {
    beforeEach(() => {
      store.overrideSelector(getSelectedQuotationDetail, QUOTATION_DETAIL_MOCK);
    });
    test(
      'should trigger loadMaterialStock',
      marbles((m) => {
        action = loadQuotationSuccess({ item: QUOTATION_MOCK });

        actions$ = m.hot('-a', { a: action });
        const result = loadMaterialStock({
          materialNumber15: QUOTATION_DETAIL_MOCK.material.materialNumber15,
          productionPlantId: QUOTATION_DETAIL_MOCK.productionPlant.plantNumber,
        });

        const expected = m.cold('-b', { b: result });

        m.expect(effects.triggerLoadMaterialStock$).toBeObservable(expected);
      })
    );
    test(
      'should trigger resetMaterialStock on empty productionPlant',
      marbles((m) => {
        store.overrideSelector(getSelectedQuotationDetail, {
          ...QUOTATION_DETAIL_MOCK,
          productionPlant: undefined,
        });

        action = setSelectedQuotationDetail({ gqPositionId: '1234' });

        actions$ = m.hot('-a', { a: action });
        const result = resetMaterialStock();

        const expected = m.cold('-b', { b: result });

        m.expect(effects.triggerLoadMaterialStock$).toBeObservable(expected);
      })
    );
    test(
      'should trigger loadMaterialStock by setSelectedQuotationDetail',
      marbles((m) => {
        action = setSelectedQuotationDetail({ gqPositionId: '1234' });

        actions$ = m.hot('-a', { a: action });
        const result = loadMaterialStock({
          materialNumber15: QUOTATION_DETAIL_MOCK.material.materialNumber15,
          productionPlantId: QUOTATION_DETAIL_MOCK.productionPlant.plantNumber,
        });

        const expected = m.cold('-b', { b: result });

        m.expect(effects.triggerLoadMaterialStock$).toBeObservable(expected);
      })
    );
  });
});
