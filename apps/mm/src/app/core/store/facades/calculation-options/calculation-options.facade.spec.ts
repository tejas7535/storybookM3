import { PreflightData } from '@mm/core/services/preflght-data-parser/preflight-data.interface';
import { CalculationOptionsFormData } from '@mm/steps/calculation-options-step/calculation-selection-step.interface';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { CalculationOptionsActions } from '../../actions';
import { CalculationOptionsSelector } from '../../selectors';
import { CalculationOptionsFacade } from './calculation-options.facade';

describe('CalculationOptionsFacade', () => {
  let spectator: SpectatorService<CalculationOptionsFacade>;
  let store: MockStore;
  const initialState = {};

  const createService = createServiceFactory({
    service: CalculationOptionsFacade,
    providers: [provideMockStore({ initialState })],
  });

  beforeEach(() => {
    spectator = createService();
    store = spectator.inject(MockStore);
    jest.spyOn(store, 'dispatch');
  });

  it('should create the facade', () => {
    expect(spectator.service).toBeTruthy();
  });

  it('should select options$', (done) => {
    const options: PreflightData = {
      innerRingExpansion: '134',
    } as Partial<PreflightData> as PreflightData;
    store.overrideSelector(CalculationOptionsSelector.getOptions, options);
    spectator.service.getOptions$().subscribe((result) => {
      expect(result).toEqual(options);
      done();
    });
  });

  it('should dispatch updateShaftMaterialInformation action', () => {
    const shaftMaterialId = 'testShaftMaterialId';
    const expectedAction =
      CalculationOptionsActions.updateShaftMaterialInformation({
        selectedOption: shaftMaterialId,
      });

    spectator.service.updateShaftMaterialInfomration(shaftMaterialId);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch updateOptionsFromFormData action', () => {
    const formData: CalculationOptionsFormData = {
      mountingOption: 'testMountingOption',
      hydraulicNutType: 'testHydraulicNutType',
      innerRingExpansion: 'testInnerRingExpansion',
      previousMountingOption: 'testPreviousMountingOption',
      radialClearanceReduction: 'testRadialClearanceReduction',
      shaftDiameter: '',
      shaftMaterial: '',
    };
    const expectedAction = CalculationOptionsActions.updateOptionsFromFormData({
      formData,
    });

    spectator.service.updateFormData(formData);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });
});
