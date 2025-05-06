import { of } from 'rxjs';

import { PlanningView } from '../../../feature/demand-validation/planning-view';
import { CustomerEntry } from '../../../feature/global-selection/model';
import { Stub } from '../../../shared/test/stub.class';
import { ActionBarComponent } from './action-bar.component';

describe('ActionBarComponent', () => {
  let component: ActionBarComponent;

  beforeEach(() => {
    component = Stub.getForEffect<ActionBarComponent>({
      component: ActionBarComponent,
      providers: [
        Stub.getMatDialogProvider(),
        Stub.getStoreProvider(),
        Stub.getDemandValidationServiceProvider(),
        Stub.getUserServiceProvider(),
      ],
    });

    Stub.setInputs([
      { property: 'selectedCustomer', value: {} as CustomerEntry },
      { property: 'customerData', value: [] },
      { property: 'planningView', value: PlanningView.REQUESTED },
      {
        property: 'demandValidationFilters',
        value: {
          customerMaterialNumber: [],
          productLine: [],
          productionLine: [],
          stochasticType: [],
        },
      },
      { property: 'isMaterialListVisible', value: true },
      { property: 'changedKPIs', value: null },
    ]);
    Stub.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('handleOnSaveForecast', () => {
    let saveValidatedDemandSingleMccSpy: jest.SpyInstance;
    let openSnackBarSpy: jest.SpyInstance;
    let logEventSpy: jest.SpyInstance;
    let emitSpy: jest.SpyInstance;

    beforeEach(() => {
      saveValidatedDemandSingleMccSpy = jest
        .spyOn(
          component['demandValidationService'],
          'saveValidatedDemandSingleMcc'
        )
        .mockReturnValue(of(null));

      openSnackBarSpy = jest.spyOn(
        component['snackbarService'],
        'openSnackBar'
      );

      logEventSpy = jest.spyOn(component['appInsights'], 'logEvent');

      emitSpy = jest.spyOn(component.reloadValidationTable, 'emit');
    });

    it('should emit true and log event when dryRun is false', () => {
      component['handleOnSaveForecast'](false);

      expect(emitSpy).toHaveBeenCalledWith(true);
      expect(logEventSpy).toHaveBeenCalledWith(
        '[Validated Sales Planning] Upload Single Entries'
      );
    });

    it('should validate entries and add errors for invalid forecasts', () => {
      const mockChangedKPIs = {
        kpiEntries: [
          { validatedForecast: 'invalid', fromDate: new Date() },
          { validatedForecast: -1, fromDate: new Date() },
        ],
      };

      Stub.setInput('changedKPIs', mockChangedKPIs);
      Stub.detectChanges();

      component['handleOnSaveForecast'](true);

      expect(saveValidatedDemandSingleMccSpy).toHaveBeenCalledWith(
        mockChangedKPIs,
        expect.any(Set),
        true
      );
    });

    it('should call saveValidatedDemandSingleMcc and handle success', () => {
      saveValidatedDemandSingleMccSpy.mockReturnValue(of(null));

      component['handleOnSaveForecast'](false);

      expect(saveValidatedDemandSingleMccSpy).toHaveBeenCalled();
      expect(openSnackBarSpy).toHaveBeenCalledWith(
        'validation_of_demand.save.success'
      );
      expect(emitSpy).toHaveBeenCalledWith(false);
    });

    it('should handle errors and not reload the table if errors exist', () => {
      const mockChangedKPIs = {
        kpiEntries: [{ validatedForecast: 'invalid', fromDate: new Date() }],
      };
      Stub.setInput('changedKPIs', mockChangedKPIs);
      Stub.detectChanges();

      component['handleOnSaveForecast'](false);

      expect(emitSpy).not.toHaveBeenCalledWith(null);
    });

    it('should not reload the table for dryRun', () => {
      component['handleOnSaveForecast'](true);

      expect(emitSpy).not.toHaveBeenCalledWith(null);
    });
  });
});
