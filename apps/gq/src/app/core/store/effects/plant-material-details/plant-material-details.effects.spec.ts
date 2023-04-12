import { HttpClientTestingModule } from '@angular/common/http/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import {
  PLANT_MATERIAL_DETAILS_STATE_MOCK,
  QUOTATION_DETAIL_MOCK,
  QUOTATION_MOCK,
} from '../../../../../testing/mocks';
import { MaterialService } from '../../../../shared/services/rest/material/material.service';
import {
  loadPlantMaterialDetails,
  loadPlantMaterialDetailsFailure,
  loadPlantMaterialDetailsSuccess,
  loadQuotationSuccess,
  resetPlantMaterialDetails,
  setSelectedQuotationDetail,
} from '../../actions';
import { getSelectedQuotationDetail } from '../../selectors';
import { PlantMaterialDetailsEffects } from './plant-material-details.effects';

describe('PlantMaterialDetailsEffects', () => {
  let action: any;
  let actions$: Actions;
  let store: MockStore;

  let spectator: SpectatorService<PlantMaterialDetailsEffects>;

  let effects: PlantMaterialDetailsEffects;
  let materialService: MaterialService;

  const createService = createServiceFactory({
    service: PlantMaterialDetailsEffects,
    imports: [HttpClientTestingModule],
    providers: [provideMockStore(), provideMockActions(() => actions$)],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(PlantMaterialDetailsEffects);
    materialService = spectator.inject(MaterialService);
    store = spectator.inject(MockStore);
  });

  describe('loadPlantMaterialDetails$', () => {
    const materialId = '123456789012345';
    const plantIds = ['12345', '67890'];
    action = loadPlantMaterialDetails({ materialId, plantIds });

    const plantMaterialDetails =
      PLANT_MATERIAL_DETAILS_STATE_MOCK.plantMaterialDetails;

    test(
      'should trigger loadPlantMaterialDetailsSuccess',
      marbles((m) => {
        const result = loadPlantMaterialDetailsSuccess({
          plantMaterialDetails,
        });

        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|', { a: plantMaterialDetails });
        materialService.getPlantMaterialDetails = jest.fn(() => response);

        const expected = m.cold('--b', { b: result });

        m.expect(effects.loadPlantMaterialDetails$).toBeObservable(expected);
        m.flush();
        expect(materialService.getPlantMaterialDetails).toHaveBeenCalledTimes(
          1
        );
        expect(materialService.getPlantMaterialDetails).toHaveBeenCalledWith(
          materialId,
          plantIds
        );
      })
    );

    test(
      'should trigger loadPlantMaterialDetailsFailure',
      marbles((m) => {
        const errorMessage = 'An error occured';
        const result = loadPlantMaterialDetailsFailure({ errorMessage });

        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-#|', undefined, errorMessage);
        const expected = m.cold('--b', { b: result });

        materialService.getPlantMaterialDetails = jest.fn(() => response);

        m.expect(effects.loadPlantMaterialDetails$).toBeObservable(expected);
        m.flush();
        expect(materialService.getPlantMaterialDetails).toHaveBeenCalledTimes(
          1
        );
        expect(materialService.getPlantMaterialDetails).toHaveBeenCalledWith(
          materialId,
          plantIds
        );
      })
    );
  });

  describe('triggerLoadPlantMaterialDetails$', () => {
    beforeEach(() => {
      store.overrideSelector(getSelectedQuotationDetail, QUOTATION_DETAIL_MOCK);
    });
    test(
      'should trigger loadPlantMaterialDetails',
      marbles((m) => {
        action = loadQuotationSuccess({ item: QUOTATION_MOCK });

        actions$ = m.hot('-a', { a: action });
        const result = loadPlantMaterialDetails({
          materialId: QUOTATION_DETAIL_MOCK.material.materialNumber15,
          plantIds: [
            QUOTATION_DETAIL_MOCK.productionPlant.plantNumber,
            QUOTATION_DETAIL_MOCK.plant.plantNumber,
          ],
        });

        const expected = m.cold('-b', { b: result });

        m.expect(effects.triggerLoadPlantMaterialDetails$).toBeObservable(
          expected
        );
      })
    );
    test(
      'should trigger resetPlantMaterialDetails for empty plants',
      marbles((m) => {
        store.overrideSelector(getSelectedQuotationDetail, {
          ...QUOTATION_DETAIL_MOCK,
          productionPlant: undefined,
          plant: undefined,
        });

        action = setSelectedQuotationDetail({ gqPositionId: '1234' });

        actions$ = m.hot('-a', { a: action });
        const result = resetPlantMaterialDetails();

        const expected = m.cold('-b', { b: result });

        m.expect(effects.triggerLoadPlantMaterialDetails$).toBeObservable(
          expected
        );
      })
    );
    test(
      'should trigger loadPlantMaterialDetails by setSelectedQuotationDetail',
      marbles((m) => {
        action = setSelectedQuotationDetail({ gqPositionId: '1234' });

        actions$ = m.hot('-a', { a: action });
        const result = loadPlantMaterialDetails({
          materialId: QUOTATION_DETAIL_MOCK.material.materialNumber15,
          plantIds: [
            QUOTATION_DETAIL_MOCK.productionPlant.plantNumber,
            QUOTATION_DETAIL_MOCK.plant.plantNumber,
          ],
        });

        const expected = m.cold('-b', { b: result });

        m.expect(effects.triggerLoadPlantMaterialDetails$).toBeObservable(
          expected
        );
      })
    );
  });
});
