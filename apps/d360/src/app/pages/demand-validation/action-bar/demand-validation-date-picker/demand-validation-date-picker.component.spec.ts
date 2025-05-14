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
      // Setup
      const mockEndDatePeriod2 = { setValue: jest.fn() };
      const mockPeriodType2 = { disable: jest.fn() };
      const mockStartDatePeriod2 = { disable: jest.fn() };

      Stub.setInput('endDatePeriod2', mockEndDatePeriod2);
      Stub.setInput('periodType2', mockPeriodType2);
      Stub.setInput('startDatePeriod2', mockStartDatePeriod2);
      Stub.detectChanges();

      // Execute
      component['onPeriodTypeChange']({
        id: DateRangePeriod.Monthly,
        text: 'Monthly',
      });

      // Verify
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
      // Setup
      const endDate = new Date(2023, 5, 15);
      Stub.setInput('endDatePeriod1', new FormControl(endDate));
      Stub.setInput('disableOptionalDate', false);
      Stub.detectChanges();

      const spyEndDatePeriod1Change = jest.spyOn(
        component as any,
        '_endDatePeriod1Change'
      );

      // Execute
      component['onPeriodTypeChange']({
        id: DateRangePeriod.Weekly,
        text: 'Weekly',
      });

      // Verify
      expect(spyEndDatePeriod1Change).toHaveBeenCalledWith(endDate);
    });

    it('should not call _endDatePeriod1Change when disableOptionalDate is true', () => {
      // Setup
      Stub.setInput('disableOptionalDate', true);
      Stub.detectChanges();

      const spyEndDatePeriod1Change = jest.spyOn(
        component as any,
        '_endDatePeriod1Change'
      );

      // Execute
      component['onPeriodTypeChange']({
        id: DateRangePeriod.Weekly,
        text: 'Weekly',
      });

      // Verify
      expect(spyEndDatePeriod1Change).not.toHaveBeenCalled();
    });
  });

  describe('_endDatePeriod1Change', () => {
    it('should set endDatePeriod1 to end of month', () => {
      // Setup
      const testDate = new Date(2023, 5, 15); // June 15, 2023
      const expectedEndOfMonth = new Date(2023, 5, 30, 23, 59, 59, 999); // June 30, 2023

      const mockEndDatePeriod1 = { setValue: jest.fn() };
      Stub.setInput('endDatePeriod1', mockEndDatePeriod1);
      Stub.detectChanges();

      // Execute
      (component as any)._endDatePeriod1Change(testDate);

      // Verify
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
      // Setup
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

      // Execute
      (component as any)._endDatePeriod1Change(testDate);

      // Verify
      expect(mockStartDatePeriod2.setValue).toHaveBeenCalled();
      const calledDate = mockStartDatePeriod2.setValue.mock.calls[0][0];
      expect(calledDate.getFullYear()).toBe(expectedNextMonth.getFullYear());
      expect(calledDate.getMonth()).toBe(expectedNextMonth.getMonth());
      expect(calledDate.getDate()).toBe(expectedNextMonth.getDate());
    });

    it('should not set startDatePeriod2 when disableOptionalDate is true', () => {
      // Setup
      const testDate = new Date(2023, 5, 15);

      component.endDatePeriod1().setValue(null);
      component.startDatePeriod2().setValue(null);
      component
        .periodType1()
        .setValue({ id: DateRangePeriod.Weekly, text: 'any' });
      (component as any).disableOptionalDate = signal(true);

      jest.spyOn(component.startDatePeriod2(), 'setValue');

      // Execute
      (component as any)._endDatePeriod1Change(testDate);

      // Verify
      expect(component.startDatePeriod2().setValue).not.toHaveBeenCalled();
    });
  });
});
