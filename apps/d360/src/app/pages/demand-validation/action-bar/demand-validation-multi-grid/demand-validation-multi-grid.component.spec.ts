import { Validators } from '@angular/forms';

import { of } from 'rxjs';

import { Stub } from '../../../../shared/test/stub.class';
import { DateRangePeriod } from '../../../../shared/utils/date-range';
import { ValidationHelper } from '../../../../shared/utils/validation/validation-helper';
import { DemandValidationMultiGridComponent } from './demand-validation-multi-grid.component';

describe('DemandValidationMultiGridConfigurationModalComponent', () => {
  let component: DemandValidationMultiGridComponent;

  beforeEach(() => {
    component = Stub.get<DemandValidationMultiGridComponent>({
      component: DemandValidationMultiGridComponent,
      providers: [
        Stub.getMatDialogDataProvider({
          customerName: 'Test Customer',
          customerNumber: '42',
          materialType: 'schaeffler',
        }),
        Stub.getMatDialogProvider(),
      ],
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Structure', () => {
    it('should have proper form structure and default values', () => {
      expect(component['formGroup'].get('materialType')).toBeTruthy();
      expect(component['formGroup'].get('startDatePeriod1')).toBeTruthy();
      expect(component['formGroup'].get('endDatePeriod1')).toBeTruthy();
      expect(component['formGroup'].get('periodType1')).toBeTruthy();
      expect(component['formGroup'].get('startDatePeriod2')).toBeTruthy();
      expect(component['formGroup'].get('endDatePeriod2')).toBeTruthy();
      expect(component['formGroup'].get('periodType2')).toBeTruthy();

      expect(component['formGroup'].get('materialType').value).toBe(
        'schaeffler'
      );
    });

    it('should have validators on required fields', () => {
      const startDatePeriod1Control =
        component['formGroup'].get('startDatePeriod1');
      const endDatePeriod1Control =
        component['formGroup'].get('endDatePeriod1');
      const periodType1Control = component['formGroup'].get('periodType1');

      expect(
        startDatePeriod1Control.hasValidator(Validators.required)
      ).toBeTruthy();
      expect(
        endDatePeriod1Control.hasValidator(Validators.required)
      ).toBeTruthy();
      expect(periodType1Control.hasValidator(Validators.required)).toBeTruthy();
    });
  });

  describe('crossFieldValidator', () => {
    it('should apply cross field validators to start/end date pairs', () => {
      const validationHelperSpy = jest.spyOn(
        ValidationHelper,
        'getStartEndDateValidationErrors'
      );
      const formGroup = component['formGroup'];

      formGroup.validator(formGroup as any);

      expect(validationHelperSpy).toHaveBeenCalledTimes(2);
      expect(validationHelperSpy).toHaveBeenCalledWith(
        expect.anything(),
        true,
        'startDatePeriod1',
        'endDatePeriod1'
      );
      expect(validationHelperSpy).toHaveBeenCalledWith(
        expect.anything(),
        true,
        'startDatePeriod2',
        'endDatePeriod2'
      );
    });
  });

  describe('create method', () => {
    it('should not open edit dialog when form is invalid', () => {
      component['formGroup'].get('startDatePeriod1').setValue(null);
      const dialogSpy = jest.spyOn((component as any).dialog, 'open');

      component['create']();

      expect(dialogSpy).not.toHaveBeenCalled();
    });

    it('should open edit dialog with correct data when form is valid', () => {
      const dialogSpy = jest
        .spyOn((component as any).dialog, 'open')
        .mockReturnValue({
          afterClosed: () => ({ pipe: () => ({ subscribe: () => {} }) }),
        });

      component['create']();

      expect(dialogSpy).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          data: expect.objectContaining({
            customerName: 'Test Customer',
            customerNumber: '42',
            materialType: 'schaeffler',
            dateRange: expect.objectContaining({
              range1: expect.objectContaining({
                from: expect.any(Date),
                to: expect.any(Date),
                period: expect.anything(),
              }),
            }),
          }),
          panelClass: ['form-dialog', 'demand-validation-multi-edit'],
          autoFocus: false,
          disableClose: true,
        })
      );
    });

    it('should include range2 in dialog data when period is Weekly and endDatePeriod2 has value', () => {
      const mockDate = new Date(2023, 1, 1);
      const mockPeriodType = { id: DateRangePeriod.Weekly, text: 'Weekly' };

      component['formGroup'].patchValue({
        periodType1: mockPeriodType,
        startDatePeriod2: mockDate,
        endDatePeriod2: mockDate,
      });

      const dialogSpy = jest
        .spyOn((component as any).dialog, 'open')
        .mockReturnValue({
          afterClosed: () => ({ pipe: () => ({ subscribe: () => {} }) }),
        });

      component['create']();

      expect(dialogSpy).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          data: expect.objectContaining({
            dateRange: expect.objectContaining({
              range2: expect.objectContaining({
                from: expect.any(Date),
                to: expect.any(Date),
                period: expect.anything(),
              }),
            }),
          }),
        })
      );
    });

    it('should not include range2 in dialog data when period is not Weekly', () => {
      const mockDate = new Date(2023, 1, 1);
      const mockPeriodType = { id: DateRangePeriod.Monthly, text: 'Monthly' };

      component['formGroup'].patchValue({
        periodType1: mockPeriodType,
        startDatePeriod2: mockDate,
        endDatePeriod2: mockDate,
      });

      const dialogSpy = jest
        .spyOn((component as any).dialog, 'open')
        .mockReturnValue({
          afterClosed: () => ({ pipe: () => ({ subscribe: () => {} }) }),
        });

      component['create']();

      expect(dialogSpy).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          data: expect.objectContaining({
            dateRange: expect.objectContaining({
              range2: undefined,
            }),
          }),
        })
      );
    });

    it('should close parent dialog with result from edit dialog', () => {
      const afterClosedSpy = jest.fn().mockReturnValue(of(true));
      jest.spyOn(component['dialog'], 'open').mockReturnValue({
        afterClosed: afterClosedSpy,
      } as any);

      const dialogRefSpy = jest.spyOn((component as any).dialogRef, 'close');

      component['create']();

      expect(dialogRefSpy).toHaveBeenCalledWith(true);
    });
  });

  describe('firstEditableDate getter', () => {
    it('should return correct first editable date for Monthly period', () => {
      const monthlyPeriod = { id: DateRangePeriod.Monthly, text: 'Monthly' };
      component['formGroup'].get('periodType1').setValue(monthlyPeriod);

      // Import and mock the firstEditableDate utility function
      jest.mock('../../../../feature/demand-validation/limits', () => ({
        firstEditableDate: jest.fn().mockReturnValue(new Date(2023, 0, 1)),
      }));

      const result = component['firstEditableDate'];

      expect(result).toBeInstanceOf(Date);
    });

    it('should return correct first editable date for Monthly period if there is no value', () => {
      component['formGroup'].get('periodType1').setValue(null);

      // Import and mock the firstEditableDate utility function
      jest.mock('../../../../feature/demand-validation/limits', () => ({
        firstEditableDate: jest.fn().mockReturnValue(new Date(2023, 0, 1)),
      }));

      const result = component['firstEditableDate'];

      expect(result).toBeInstanceOf(Date);
    });

    it('should return correct first editable date for Weekly period', () => {
      const weeklyPeriod = { id: DateRangePeriod.Weekly, text: 'Weekly' };
      component['formGroup'].get('periodType1').setValue(weeklyPeriod);

      const result = component['firstEditableDate'];

      expect(result).toBeInstanceOf(Date);
    });
  });

  describe('Period types', () => {
    it('should initialize periodTypes with default values', () => {
      expect(component['periodTypes']).toBeDefined();
      expect(Array.isArray(component['periodTypes'])).toBe(true);
      expect(component['periodTypes'].length).toBeGreaterThan(0);
    });

    it('should have period types with id and text properties', () => {
      component['periodTypes'].forEach((periodType) => {
        expect(periodType).toHaveProperty('id');
        expect(periodType).toHaveProperty('text');
      });
    });

    it('should have default Monthly period type selected initially', () => {
      const periodType1Value = component['formGroup'].get('periodType1').value;

      expect(periodType1Value).toBeDefined();
      expect(periodType1Value.id).toBe(DateRangePeriod.Monthly);
    });

    it('should correctly update period type when changed', () => {
      const weeklyPeriod = component['periodTypes'].find(
        (p) => p.id === DateRangePeriod.Weekly
      );

      component['formGroup'].get('periodType1').setValue(weeklyPeriod as any);

      expect(component['formGroup'].get('periodType1').value.id).toBe(
        DateRangePeriod.Weekly
      );
    });

    it('should maintain form validity when switching between valid period types', () => {
      const weeklyPeriod = component['periodTypes'].find(
        (p) => p.id === DateRangePeriod.Weekly
      );
      const monthlyPeriod = component['periodTypes'].find(
        (p) => p.id === DateRangePeriod.Monthly
      );

      // start with valid form
      expect(component['formGroup'].valid).toBeTruthy();

      // Change to weekly
      component['formGroup'].get('periodType1').setValue(weeklyPeriod as any);

      expect(component['formGroup'].valid).toBeTruthy();

      // Change back to monthly
      component['formGroup'].get('periodType1').setValue(monthlyPeriod as any);

      expect(component['formGroup'].valid).toBeTruthy();
    });

    it('should disable period2 controls when period1 is not Weekly', () => {
      const monthlyPeriod = component['periodTypes'].find(
        (p) => p.id === DateRangePeriod.Monthly
      );

      component['formGroup'].get('periodType1').setValue(monthlyPeriod as any);

      // checking this indirectly through the create method's behavior
      const mockDate = new Date(2023, 1, 1);
      component['formGroup'].patchValue({
        startDatePeriod2: mockDate,
        endDatePeriod2: mockDate,
      });

      const dialogSpy = jest
        .spyOn((component as any).dialog, 'open')
        .mockReturnValue({
          afterClosed: () => ({ pipe: () => ({ subscribe: () => {} }) }),
        });

      component['create']();

      expect(dialogSpy).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          data: expect.objectContaining({
            dateRange: expect.objectContaining({
              range2: undefined,
            }),
          }),
        })
      );
    });

    it('should reflect period type changes in firstEditableDate', () => {
      const weeklyPeriod = component['periodTypes'].find(
        (p) => p.id === DateRangePeriod.Weekly
      );
      const monthlyPeriod = component['periodTypes'].find(
        (p) => p.id === DateRangePeriod.Monthly
      );

      // get date with monthly period
      component['formGroup'].get('periodType1').setValue(monthlyPeriod as any);
      const monthlyFirstDate = component['firstEditableDate'];

      // Change to weekly
      component['formGroup'].get('periodType1').setValue(weeklyPeriod as any);
      const weeklyFirstDate = component['firstEditableDate'];

      // dates should be instances of Date
      expect(monthlyFirstDate).toBeInstanceOf(Date);
      expect(weeklyFirstDate).toBeInstanceOf(Date);
    });
  });
});
