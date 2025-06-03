import { Stub } from './../../../../shared/test/stub.class';
import { DateRangePeriod } from './../../../../shared/utils/date-range';
import { DatePickerSettingDemandValidationModalComponent } from './date-picker-setting-demand-validation-modal.component';

describe('DatePickerSettingDemandValidationModalComponent', () => {
  let component: DatePickerSettingDemandValidationModalComponent;

  beforeEach(() => {
    component = Stub.getForEffect({
      component: DatePickerSettingDemandValidationModalComponent,
    });

    Stub.setInputs([
      {
        property: 'data',
        value: {
          range1: {
            from: new Date(),
            to: new Date(),
            period: DateRangePeriod.Weekly,
          },
        },
      },
      { property: 'close', value: () => {} },
    ]);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize formGroup with values from input data', () => {
      component.ngOnInit();

      const formGroup = component['formGroup'];
      expect(formGroup).toBeTruthy();
      expect(formGroup.controls.startDatePeriod1.value).toEqual(
        component.data().range1.from
      );
      expect(formGroup.controls.endDatePeriod1.value).toEqual(
        component.data().range1.to
      );
      expect(formGroup.controls.periodType1.value.id).toEqual(
        component.data().range1.period
      );
    });

    it('should set default period types if none provided in data', () => {
      Stub.setInputs([
        {
          property: 'data',
          value: {
            range1: {
              from: new Date(),
              to: new Date(),
              period: undefined,
            },
          },
        },
        { property: 'close', value: () => {} },
      ]);

      component.ngOnInit();

      expect(component['formGroup'].controls.periodType1.value).toBeDefined();
    });
  });

  describe('form validation', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should validate that end date is after start date for period 1', () => {
      const startDate = new Date(2023, 0, 1);
      const endDate = new Date(2023, 0, 10);

      component['formGroup'].controls.startDatePeriod1.setValue(startDate);
      component['formGroup'].controls.endDatePeriod1.setValue(endDate);

      expect(component['formGroup'].valid).toBeTruthy();

      component['formGroup'].controls.endDatePeriod1.setValue(
        new Date(2022, 11, 25)
      );

      expect(component['formGroup'].valid).toBeFalsy();
    });

    it('should validate that end date is after start date for period 2', () => {
      const startDate = new Date(2023, 1, 1);
      const endDate = new Date(2023, 1, 10);

      component['formGroup'].controls.startDatePeriod2.setValue(startDate);
      component['formGroup'].controls.endDatePeriod2.setValue(endDate);

      expect(component['formGroup'].valid).toBeTruthy();

      component['formGroup'].controls.endDatePeriod2.setValue(
        new Date(2023, 0, 25)
      );

      expect(component['formGroup'].valid).toBeFalsy();
    });
  });

  describe('handleApplyDateRange', () => {
    let emitSpy: jest.SpyInstance;
    let closeSpy: jest.SpyInstance;
    const mockClose = jest.fn();

    beforeEach(() => {
      emitSpy = jest.spyOn(component.selectionChange, 'emit');
      Stub.setInputs([
        {
          property: 'data',
          value: {
            range1: {
              from: new Date(2023, 0, 1),
              to: new Date(2023, 0, 31),
              period: DateRangePeriod.Weekly,
            },
          },
        },
        { property: 'close', value: () => mockClose },
      ]);
      component.ngOnInit();
      closeSpy = jest.spyOn(component as any, 'handleOnClose');
    });

    it('should emit selection change with range1 data when form is valid', () => {
      component['handleApplyDateRange']();

      expect(emitSpy).toHaveBeenCalled();
      const emittedValue = emitSpy.mock.calls[0][0];
      expect(emittedValue.range1).toBeDefined();
      expect(emittedValue.range1.period).toEqual(DateRangePeriod.Weekly);
    });

    it('should include range2 data when period is weekly and range2 end date is set', () => {
      component['formGroup'].controls.startDatePeriod2.setValue(
        new Date(2023, 1, 1)
      );
      component['formGroup'].controls.endDatePeriod2.setValue(
        new Date(2023, 1, 28)
      );
      component['formGroup'].controls.periodType2.setValue({
        id: DateRangePeriod.Monthly,
        label: 'Monthly',
      });

      component['handleApplyDateRange']();

      const emittedValue = emitSpy.mock.calls[0][0];
      expect(emittedValue.range2).toBeDefined();
      expect(emittedValue.range2.period).toEqual(DateRangePeriod.Monthly);
    });

    it('should not include range2 data when period is not weekly', () => {
      component['formGroup'].controls.periodType1.setValue({
        id: DateRangePeriod.Monthly,
        label: 'Monthly',
      });
      component['formGroup'].controls.startDatePeriod2.setValue(
        new Date(2023, 1, 1)
      );
      component['formGroup'].controls.endDatePeriod2.setValue(
        new Date(2023, 1, 28)
      );

      component['handleApplyDateRange']();

      const emittedValue = emitSpy.mock.calls[0][0];
      expect(emittedValue.range2).toBeUndefined();
    });

    it('should call handleOnClose after emitting data', () => {
      component['handleApplyDateRange']();

      expect(closeSpy).toHaveBeenCalled();
    });

    it('should not emit data when form is invalid', () => {
      component['formGroup'].controls.startDatePeriod1.setValue(null);
      component['formGroup'].controls.endDatePeriod1.setValue(new Date());

      component['handleApplyDateRange']();

      expect(emitSpy).not.toHaveBeenCalled();
    });
  });

  describe('handleOnClose', () => {
    it('should call the close function from input', () => {
      const mockCloseFn = jest.fn();
      Stub.setInputs([
        {
          property: 'data',
          value: {
            range1: {
              from: new Date(),
              to: new Date(),
              period: DateRangePeriod.Weekly,
            },
          },
        },
        { property: 'close', value: mockCloseFn },
      ]);

      Stub.detectChanges();

      component['handleOnClose']();

      expect(mockCloseFn).toHaveBeenCalled();
    });
  });
});
