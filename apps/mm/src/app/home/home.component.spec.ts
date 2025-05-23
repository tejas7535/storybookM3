import { of } from 'rxjs';

import { CalculationOptionsFacade } from '@mm/core/store/facades/calculation-options/calculation-options.facade';
import { CalculationSelectionFacade } from '@mm/core/store/facades/calculation-selection/calculation-selection.facade';
import { GlobalFacade } from '@mm/core/store/facades/global/global.facade';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockProvider } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let spectator: Spectator<HomeComponent>;

  let selectionFacade: CalculationSelectionFacade;

  const createComponent = createComponentFactory({
    component: HomeComponent,
    imports: [provideTranslocoTestingModule({ en: {} })],
    providers: [
      MockProvider(GlobalFacade, {
        appDeliveryEmbedded$: of(true),
      } as unknown as GlobalFacade),
      MockProvider(CalculationSelectionFacade, {
        getBearing$: jest.fn(() => of({})),
        bearingSeats$: of([]),
        selectedBearingOption$: of({}),
        measurementMethods$: of([]),
        mountingMethods$: of([]),
        getOptions$: jest.fn(() => of({})),
        isAxialDisplacement$: jest.fn(() => of(false)),
        isLoading$: jest.fn(() => of(false)),
        steps$: of([]),
        getCurrentStep$: jest.fn(() => of(0)),
        fetchBearingData: jest.fn(),
        setBearingSeat: jest.fn(),
        updateMountingMethodAndCurrentStep: jest.fn(),
        setMeasurementMethod: jest.fn(),
        setCurrentStep: jest.fn(),
      } as unknown as CalculationSelectionFacade),
      MockProvider(CalculationOptionsFacade, {
        getOptions$: jest.fn(() => of({})),
      } as unknown as CalculationOptionsFacade),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;

    selectionFacade = spectator.inject(CalculationSelectionFacade);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('selectStep', () => {
    it('should call selectCurrentStep with the selected index', () => {
      const selectedIndex = 1;
      component['selectCurrentStep'] = jest.fn();

      component.selectStep({ selectedIndex } as any);

      expect(component['selectCurrentStep']).toHaveBeenCalledWith(
        selectedIndex
      );
    });
  });

  describe('selectBearing', () => {
    it('should call fetchBearingData with the selected id', () => {
      const selectedId = '123';

      component.selectBearing(selectedId);

      expect(selectionFacade.fetchBearingData).toHaveBeenCalledWith(selectedId);
    });
  });

  describe('selectBearingSeatOption', () => {
    it('should call setBearingSeat and selectCurrentStep with the selected bearing seat id', () => {
      const selectedBearingSeatId = '456';
      const selectedValueId = '789';
      component['selectCurrentStep'] = jest.fn();

      component.bearingSeats().selectedValueId = selectedValueId;

      component.selectBearingSeatOption(selectedBearingSeatId);

      expect(selectionFacade.setBearingSeat).toHaveBeenCalledWith(
        selectedBearingSeatId
      );
      expect(component['selectCurrentStep']).toHaveBeenCalledWith(
        component.MEASURING_MOUNTING_STEP
      );
    });
  });

  describe('selectMountingMethod', () => {
    it('should call updateMountingMethodAndCurrentStep with the selected mounting method', () => {
      const selectedMountingMethod = 'mountingMethod';

      component.selectMountingMethod(selectedMountingMethod);

      expect(
        selectionFacade.updateMountingMethodAndCurrentStep
      ).toHaveBeenCalledWith(selectedMountingMethod);
    });
  });

  describe('selectMeasurementMethod', () => {
    it('should call setMeasurementMethod with the selected measurement method', () => {
      const selectedMeasurementMethod = 'measurementMethod';

      component.selectMeasurementMethod(selectedMeasurementMethod);

      expect(selectionFacade.setMeasurementMethod).toHaveBeenCalledWith(
        selectedMeasurementMethod
      );
    });
  });

  describe('selectCurrentStep', () => {
    it('should call setCurrentStep with the selected step', () => {
      const selectedStep = 2;

      component['selectCurrentStep'](selectedStep);

      expect(selectionFacade.setCurrentStep).toHaveBeenCalledWith(selectedStep);
    });
  });
});
