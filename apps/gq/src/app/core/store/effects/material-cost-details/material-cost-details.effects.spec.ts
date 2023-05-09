import { HttpClientModule } from '@angular/common/http';

import { Quotation } from '@gq/shared/models';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { MATERIAL_COST_DETAILS_MOCK } from '../../../../../../src/testing/mocks/models/material-cost-details.mock';
import {
  QUOTATION_DETAIL_MOCK,
  QUOTATION_MOCK,
} from '../../../../../testing/mocks/models';
import { MaterialService } from '../../../../shared/services/rest/material/material.service';
import {
  loadMaterialCostDetails,
  loadMaterialCostDetailsFailure,
  loadMaterialCostDetailsSuccess,
  resetMaterialCostDetails,
} from '../../actions';
import { ActiveCaseActions } from '../../active-case/active-case.action';
import { getSelectedQuotationDetail } from '../../active-case/active-case.selectors';
import { MaterialCostDetailsEffects } from './material-cost-details.effects';

describe('MaterialCostDetails', () => {
  let action: any;
  let actions$: Actions;
  let store: MockStore;

  let spectator: SpectatorService<MaterialCostDetailsEffects>;

  let effects: MaterialCostDetailsEffects;
  let materialService: MaterialService;

  const createService = createServiceFactory({
    service: MaterialCostDetailsEffects,
    imports: [HttpClientModule],
    providers: [provideMockStore(), provideMockActions(() => actions$)],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(MaterialCostDetailsEffects);
    materialService = spectator.inject(MaterialService);
    store = spectator.inject(MockStore);
  });

  describe('loadMaterialCostDetails$', () => {
    const materialNumber15 = '123456789012345';
    const productionPlantId = '0215';
    action = loadMaterialCostDetails({ materialNumber15, productionPlantId });

    const materialCostDetails = MATERIAL_COST_DETAILS_MOCK;
    test(
      'should trigger loadMaterialCostDetails',
      marbles((m) => {
        const result = loadMaterialCostDetailsSuccess({ materialCostDetails });

        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|', { a: materialCostDetails });
        materialService.getMaterialCostDetails = jest.fn(() => response);

        const expected = m.cold('--b', { b: result });

        m.expect(effects.loadMaterialCostDetails$).toBeObservable(expected);
        m.flush();
        expect(materialService.getMaterialCostDetails).toHaveBeenCalledTimes(1);
        expect(materialService.getMaterialCostDetails).toHaveBeenCalledWith(
          productionPlantId,
          materialNumber15
        );
      })
    );

    test(
      'should trigger loadMaterialCostDetailsFailure',
      marbles((m) => {
        const errorMessage = 'Oups, an error occured';
        const result = loadMaterialCostDetailsFailure({ errorMessage });

        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-#|', undefined, errorMessage);
        const expected = m.cold('--b', { b: result });

        materialService.getMaterialCostDetails = jest.fn(() => response);

        m.expect(effects.loadMaterialCostDetails$).toBeObservable(expected);
        m.flush();
        expect(materialService.getMaterialCostDetails).toHaveBeenCalledTimes(1);
        expect(materialService.getMaterialCostDetails).toHaveBeenCalledWith(
          productionPlantId,
          materialNumber15
        );
      })
    );
  });

  describe('triggerLoadMaterialCostDetails$', () => {
    beforeEach(() => {
      store.overrideSelector(getSelectedQuotationDetail, QUOTATION_DETAIL_MOCK);
    });
    test(
      'should trigger loadMaterialCostDetails',
      marbles((m) => {
        action = ActiveCaseActions.getQuotationSuccess({
          item: QUOTATION_MOCK,
        });

        actions$ = m.hot('-a', { a: action });
        const result = loadMaterialCostDetails({
          materialNumber15: QUOTATION_DETAIL_MOCK.material.materialNumber15,
          productionPlantId: QUOTATION_DETAIL_MOCK.productionPlant.plantNumber,
        });

        const expected = m.cold('-b', { b: result });

        m.expect(effects.triggerLoadMaterialCostDetails$).toBeObservable(
          expected
        );
      })
    );
    test(
      'should trigger resetMaterialCostDetails on empty productionPlant',
      marbles((m) => {
        store.overrideSelector(getSelectedQuotationDetail, {
          ...QUOTATION_DETAIL_MOCK,
          productionPlant: undefined,
        });

        action = ActiveCaseActions.getQuotationSuccess({
          item: {} as unknown as Quotation,
        });

        actions$ = m.hot('-a', { a: action });
        const result = resetMaterialCostDetails();

        const expected = m.cold('-b', { b: result });

        m.expect(effects.triggerLoadMaterialCostDetails$).toBeObservable(
          expected
        );
      })
    );
    test(
      'should trigger loadMaterialCostDetails by setSelectedQuotationDetail',
      marbles((m) => {
        action = ActiveCaseActions.getQuotationSuccess({
          item: {} as unknown as Quotation,
        });

        actions$ = m.hot('-a', { a: action });
        const result = loadMaterialCostDetails({
          materialNumber15: QUOTATION_DETAIL_MOCK.material.materialNumber15,
          productionPlantId: QUOTATION_DETAIL_MOCK.productionPlant.plantNumber,
        });

        const expected = m.cold('-b', { b: result });

        m.expect(effects.triggerLoadMaterialCostDetails$).toBeObservable(
          expected
        );
      })
    );
  });
});
