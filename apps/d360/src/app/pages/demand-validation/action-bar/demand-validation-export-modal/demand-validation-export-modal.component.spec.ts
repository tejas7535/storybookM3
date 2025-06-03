import { FormBuilder, FormGroup } from '@angular/forms';

import * as TimeRange from '../../../../feature/demand-validation/time-range';
import { Stub } from '../../../../shared/test/stub.class';
import { DateRangePeriod } from '../../../../shared/utils/date-range';
import { ValidationHelper } from '../../../../shared/utils/validation/validation-helper';
import { DemandValidationExportModalComponent } from './demand-validation-export-modal.component';

describe('DemandValidationExportModalComponent', () => {
  let component: DemandValidationExportModalComponent;

  beforeEach(() => {
    component = Stub.get<DemandValidationExportModalComponent>({
      component: DemandValidationExportModalComponent,
      providers: [
        FormBuilder,
        Stub.getMatDialogDataProvider({
          customerData: [],
          dateRanges: {
            range1: {
              from: new Date(),
              to: new Date(),
              period: DateRangePeriod.Weekly,
            },
          },
          demandValidationFilters: {},
        }),
        Stub.getDemandValidationServiceProvider(),
        Stub.getMatDialogProvider(),
      ],
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('handleExcelExport', () => {
    it('should return early if form has errors', () => {
      jest
        .spyOn(component as any, 'demandValidationDatePickerHasError')
        .mockReturnValue(true);
      const dialogSpy = jest.spyOn(component['dialog'], 'open');

      component['handleExcelExport']();

      expect(dialogSpy).not.toHaveBeenCalled();
    });

    it('should open loading dialog if filled range is valid', () => {
      jest
        .spyOn(component as any, 'demandValidationDatePickerHasError')
        .mockReturnValue(false);
      jest
        .spyOn(TimeRange, 'fillGapBetweenRanges')
        .mockReturnValue({ range1: {}, range2: {} } as any);
      const dialogSpy = jest.spyOn(component['dialog'], 'open');

      component['handleExcelExport']();

      expect(dialogSpy).toHaveBeenCalled();
    });
  });

  describe('triggerExport', () => {
    it('should call demandValidationService.triggerExport with correct params', () => {
      const serviceSpy = jest.spyOn(
        component['demandValidationService'],
        'triggerExport'
      );
      const selectedKpis = { key: 'value' } as any;
      const filledRange = { range1: {} } as any;
      const filters = { filter: 'test' } as any;

      component['triggerExport'](selectedKpis, filledRange, filters);

      expect(serviceSpy).toHaveBeenCalledWith(
        selectedKpis,
        filledRange,
        filters
      );
    });
  });

  describe('onClose', () => {
    it('should close the dialog', () => {
      const closeSpy = jest.spyOn(component['dialogRef'], 'close');

      component['onClose']();

      expect(closeSpy).toHaveBeenCalled();
    });
  });

  describe('demandValidationDatePickerHasError', () => {
    it('should return dateSelectionFormGroup.invalid', () => {
      component['dateSelectionFormGroup'].setErrors({ error: true });

      const result = component['demandValidationDatePickerHasError']();

      expect(result).toBe(true);
    });
  });

  describe('translateConfirmedToggleType', () => {
    it('should transform confirmed toggle type correctly', () => {
      const result = component['translateConfirmedToggleType'](
        'confirmedSalesAmbition'
      );

      expect(result).toBe('validation_of_demand.menu_item.salesAmbition');
    });

    it('should handle different confirmed toggle types', () => {
      const result1 = component['translateConfirmedToggleType'](
        'confirmedDeliveries'
      );
      const result2 = component['translateConfirmedToggleType'](
        'confirmedOnTopOrder'
      );

      expect(result1).toBe('validation_of_demand.menu_item.deliveries');
      expect(result2).toBe('validation_of_demand.menu_item.onTopOrder');
    });
  });

  describe('crossFieldValidator', () => {
    it('should call ValidationHelper with correct parameters', () => {
      const validationHelperSpy = jest.spyOn(
        ValidationHelper,
        'getStartEndDateValidationErrors'
      );
      const formGroup = new FormGroup({
        start: new FormGroup({}),
        end: new FormGroup({}),
      });

      const validator = component['crossFieldValidator']('start', 'end');
      validator(formGroup);

      expect(validationHelperSpy).toHaveBeenCalledWith(
        formGroup,
        true,
        'start',
        'end'
      );
    });
  });

  describe('kpiFormGroup', () => {
    it('should initialize with default values', () => {
      expect(component['kpiFormGroup'].get('deliveries')?.value).toBe(true);
      expect(component['kpiFormGroup'].get('firmBusiness')?.value).toBe(true);
      expect(component['kpiFormGroup'].get('opportunities')?.value).toBe(true);
      expect(component['kpiFormGroup'].get('forecastProposal')?.value).toBe(
        true
      );
      expect(component['kpiFormGroup'].get('validatedForecast')?.value).toBe(
        true
      );
      expect(component['kpiFormGroup'].get('confirmedDeliveries')?.value).toBe(
        false
      );
    });
  });

  describe('dateSelectionFormGroup', () => {
    it('should handle missing range2 in data input', () => {
      const today = new Date();
      (component as any)['data'] = {
        customerData: [],
        dateRanges: {
          range1: {
            from: today,
            to: today,
            period: DateRangePeriod.Monthly,
          },
          // No range2 provided
        },
        demandValidationFilters: {},
      };

      // startDatePeriod2 should default to one month after range1.to
      const nextMonth =
        component['dateSelectionFormGroup'].get('startDatePeriod2')?.value;
      expect(nextMonth).toBeTruthy();
    });
  });

  describe('toggle types', () => {
    it('should initialize requestedToggleTypes with expected values', () => {
      expect(component['requestedToggleTypes']).toContain('deliveries');
      expect(component['requestedToggleTypes']).toContain('firmBusiness');
      expect(component['requestedToggleTypes']).toContain('forecastProposal');
      expect(component['requestedToggleTypes'].length).toBeGreaterThan(0);
    });

    it('should initialize confirmedToggleTypes with expected values', () => {
      expect(component['confirmedToggleTypes']).toContain(
        'confirmedDeliveries'
      );
      expect(component['confirmedToggleTypes']).toContain(
        'confirmedFirmBusiness'
      );
      expect(component['confirmedToggleTypes'].length).toBeGreaterThan(0);
    });
  });
});
