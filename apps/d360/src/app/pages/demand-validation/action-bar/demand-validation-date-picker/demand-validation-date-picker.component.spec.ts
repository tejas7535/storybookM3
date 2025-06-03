import { signal } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { Stub } from './../../../../shared/test/stub.class';
import { DateRangePeriod } from './../../../../shared/utils/date-range';
import { DemandValidationDatePickerComponent } from './demand-validation-date-picker.component';

describe('DemandValidationDatePickerComponent', () => {
  let component: DemandValidationDatePickerComponent;

  beforeEach(() => {
    component = Stub.getForEffect<DemandValidationDatePickerComponent>({
      component: DemandValidationDatePickerComponent,
    });

    Stub.setInputs([
      {
        property: 'periodType1',
        value: new FormControl({ id: '1', text: '' }),
      },
      {
        property: 'periodType2',
        value: new FormControl({ id: '1', text: '' }),
      },
      {
        property: 'endDatePeriod1',
        value: new FormControl({ id: '1', text: '' }),
      },
      {
        property: 'endDatePeriod2',
        value: new FormControl({ id: '1', text: '' }),
      },
      {
        property: 'startDatePeriod1',
        value: new FormControl({ id: '1', text: '' }),
      },
      {
        property: 'startDatePeriod2',
        value: new FormControl({ id: '1', text: '' }),
      },
      {
        property: 'formGroup',
        value: new FormGroup({ period1: new FormControl({}) }),
      },
      { property: 'disableOptionalDate', value: true },
      {
        property: 'periodTypes',
        value: [{ id: '1', text: DateRangePeriod.Weekly }],
      },
    ]);

    Stub.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with proper minDateEndDatePeriod1 and minDateEndDatePeriod2', () => {
    expect(component['minDateEndDatePeriod1']).toBeDefined();
    expect(component['minDateEndDatePeriod2']).toBeDefined();
  });

  it('should set minDateEndDatePeriod1 to the value from startDatePeriod1', () => {
    const testDate = new Date(2023, 5, 15);
    Stub.setInput('startDatePeriod1', new FormControl(testDate));
    Stub.detectChanges();

    component.ngOnInit();
    expect(component['minDateEndDatePeriod1']).toBe(testDate);
  });

  describe('onPeriodTypeChange', () => {
    it('should disable period2 controls when period type is Monthly', () => {
      const mockEndDatePeriod2 = { setValue: jest.fn() };
      const mockPeriodType2 = { disable: jest.fn() };
      const mockStartDatePeriod2 = { disable: jest.fn() };

      Stub.setInput('endDatePeriod2', mockEndDatePeriod2);
      Stub.setInput('periodType2', mockPeriodType2);
      Stub.setInput('startDatePeriod2', mockStartDatePeriod2);
      Stub.detectChanges();

      component['onPeriodTypeChange']({
        id: DateRangePeriod.Monthly,
        text: 'Monthly',
      });

      expect(mockEndDatePeriod2.setValue).toHaveBeenCalledWith(null, {
        emitEvent: false,
      });
      expect(mockPeriodType2.disable).toHaveBeenCalledWith({
        emitEvent: false,
      });
      expect(mockStartDatePeriod2.disable).toHaveBeenCalledWith({
        emitEvent: false,
      });
    });

    it('should call _endDatePeriod1Change when period type is Weekly and disableOptionalDate is false', () => {
      const endDate = new Date(2023, 5, 15);
      Stub.setInput('endDatePeriod1', new FormControl(endDate));
      Stub.setInput('disableOptionalDate', false);
      Stub.detectChanges();

      const spyEndDatePeriod1Change = jest.spyOn(
        component as any,
        '_endDatePeriod1Change'
      );

      component['onPeriodTypeChange']({
        id: DateRangePeriod.Weekly,
        text: 'Weekly',
      });

      expect(spyEndDatePeriod1Change).toHaveBeenCalledWith(endDate);
    });

    it('should not call _endDatePeriod1Change when disableOptionalDate is true', () => {
      Stub.setInput('disableOptionalDate', true);
      Stub.detectChanges();

      const spyEndDatePeriod1Change = jest.spyOn(
        component as any,
        '_endDatePeriod1Change'
      );

      component['onPeriodTypeChange']({
        id: DateRangePeriod.Weekly,
        text: 'Weekly',
      });

      expect(spyEndDatePeriod1Change).not.toHaveBeenCalled();
    });
  });

  describe('_endDatePeriod1Change', () => {
    it('should set endDatePeriod1 to end of month', () => {
      const testDate = new Date(2023, 5, 15); // June 15, 2023
      const expectedEndOfMonth = new Date(2023, 5, 30, 23, 59, 59, 999); // June 30, 2023

      const mockEndDatePeriod1 = { setValue: jest.fn() };
      Stub.setInput('endDatePeriod1', mockEndDatePeriod1);
      Stub.detectChanges();

      (component as any)._endDatePeriod1Change(testDate);

      expect(mockEndDatePeriod1.setValue).toHaveBeenCalledWith(
        expect.any(Date),
        { emitEvent: false }
      );
      const calledDate = mockEndDatePeriod1.setValue.mock.calls[0][0];
      expect(calledDate.getFullYear()).toBe(expectedEndOfMonth.getFullYear());
      expect(calledDate.getMonth()).toBe(expectedEndOfMonth.getMonth());
      expect(calledDate.getDate()).toBe(expectedEndOfMonth.getDate());
    });

    it('should set startDatePeriod2 when conditions are met', () => {
      const testDate = new Date(2023, 5, 15); // June 15, 2023
      const expectedNextMonth = new Date(2023, 6, 1); // July 1, 2023
      const mockStartDatePeriod2 = { setValue: jest.fn() };

      Stub.setInput('endDatePeriod1', new FormControl(null));
      Stub.setInput('startDatePeriod2', mockStartDatePeriod2);
      Stub.setInput(
        'periodType1',
        new FormControl({ id: DateRangePeriod.Weekly, text: 'any' })
      );
      Stub.setInput('disableOptionalDate', false);
      Stub.detectChanges();

      (component as any)._endDatePeriod1Change(testDate);

      expect(mockStartDatePeriod2.setValue).toHaveBeenCalled();
      const calledDate = mockStartDatePeriod2.setValue.mock.calls[0][0];
      expect(calledDate.getFullYear()).toBe(expectedNextMonth.getFullYear());
      expect(calledDate.getMonth()).toBe(expectedNextMonth.getMonth());
      expect(calledDate.getDate()).toBe(expectedNextMonth.getDate());
    });

    it('should not set startDatePeriod2 when disableOptionalDate is true', () => {
      const testDate = new Date(2023, 5, 15);

      component.endDatePeriod1().setValue(null);
      component.startDatePeriod2().setValue(null);
      component
        .periodType1()
        .setValue({ id: DateRangePeriod.Weekly, text: 'any' });
      (component as any).disableOptionalDate = signal(true);

      jest.spyOn(component.startDatePeriod2(), 'setValue');

      (component as any)._endDatePeriod1Change(testDate);

      expect(component.startDatePeriod2().setValue).not.toHaveBeenCalled();
    });

    it('should not set startDatePeriod2 when periodType1 is not Weekly', () => {
      const testDate = new Date(2023, 5, 15);

      component.endDatePeriod1().setValue(null);
      component.startDatePeriod2().setValue(null);
      component
        .periodType1()
        .setValue({ id: DateRangePeriod.Monthly, text: 'Monthly' });
      (component as any).disableOptionalDate = signal(false);

      jest.spyOn(component.startDatePeriod2(), 'setValue');

      (component as any)._endDatePeriod1Change(testDate);

      expect(component.startDatePeriod2().setValue).not.toHaveBeenCalled();
    });

    it('should not set startDatePeriod2 when startDatePeriod2 is not defined', () => {
      const testDate = new Date(2023, 5, 15);

      component.endDatePeriod1().setValue(null);
      component
        .periodType1()
        .setValue({ id: DateRangePeriod.Weekly, text: 'Weekly' });
      (component as any).disableOptionalDate = signal(false);

      // Set startDatePeriod2 to undefined
      Stub.setInput('startDatePeriod2', undefined);
      Stub.detectChanges();

      // Should not throw error
      expect(() => {
        (component as any)._endDatePeriod1Change(testDate);
      }).not.toThrow();
    });
  });

  describe('ngOnInit', () => {
    it('should set minDateEndDatePeriod2 from endDatePeriod1 when endDatePeriod2 has value', () => {
      const endDate1 = new Date(2023, 5, 15);
      const expectedStartDate = new Date(2023, 6, 1); // First day of next month

      component.endDatePeriod1().setValue(endDate1);
      component.endDatePeriod2().setValue(new Date(2023, 7, 1)); // Has some value

      component.ngOnInit();

      // Should be first day of month after endDatePeriod1
      const resultDate = component['minDateEndDatePeriod2'];
      expect(resultDate.getFullYear()).toBe(expectedStartDate.getFullYear());
      expect(resultDate.getMonth()).toBe(expectedStartDate.getMonth());
      expect(resultDate.getDate()).toBe(expectedStartDate.getDate());
    });

    it('should set minDateEndDatePeriod2 to firstViewableDate when endDatePeriod2 is null', () => {
      component.endDatePeriod2().setValue(null);

      component.ngOnInit();

      // Should use firstViewableDate as fallback
      expect(component['minDateEndDatePeriod2']).toBeDefined();
    });

    it('should subscribe to endDatePeriod1 value changes', () => {
      const spy = jest.spyOn(component as any, '_endDatePeriod1Change');
      const testDate = new Date(2023, 5, 15);

      component.ngOnInit();
      component.endDatePeriod1().setValue(testDate);

      expect(spy).toHaveBeenCalledWith(testDate);
    });

    it('should subscribe to startDatePeriod1 value changes', () => {
      const testDate = new Date(2023, 5, 15);

      component.ngOnInit();
      component.startDatePeriod1().setValue(testDate);

      // Should update minDateEndDatePeriod1
      expect(component['minDateEndDatePeriod1']).toBe(testDate);
    });
  });

  describe('edge cases', () => {
    it('should handle null values in date controls', () => {
      const mockEndDatePeriod1 = {
        setValue: jest.fn(),
        getRawValue: () => null as any,
      };
      Stub.setInput('endDatePeriod1', mockEndDatePeriod1);
      Stub.detectChanges();

      // Should not throw error when passing null
      expect(() => {
        (component as any)._endDatePeriod1Change(null);
      }).not.toThrow();
    });

    it('should handle undefined period type', () => {
      const mockStartDatePeriod2 = { disable: jest.fn() };
      const mockPeriodType2 = { disable: jest.fn() };

      Stub.setInput('startDatePeriod2', mockStartDatePeriod2);
      Stub.setInput('periodType2', mockPeriodType2);
      Stub.detectChanges();

      // Should not throw error with undefined period type
      expect(() => {
        component['onPeriodTypeChange']({ id: undefined, text: '' });
      }).not.toThrow();

      // Controls should still be disabled
      expect(mockStartDatePeriod2.disable).toHaveBeenCalled();
      expect(mockPeriodType2.disable).toHaveBeenCalled();
    });
  });
});
