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
      // Arrange
      const validationHelperSpy = jest.spyOn(
        ValidationHelper,
        'getStartEndDateValidationErrors'
      );
      const formGroup = component['formGroup'];

      // Act
      formGroup.validator(formGroup as any);

      // Assert
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
      // Arrange
      component['formGroup'].get('startDatePeriod1').setValue(null);
      const dialogSpy = jest.spyOn((component as any).dialog, 'open');

      // Act
      component['create']();

      // Assert
      expect(dialogSpy).not.toHaveBeenCalled();
    });

    it('should open edit dialog with correct data when form is valid', () => {
      // Arrange
      const dialogSpy = jest
        .spyOn((component as any).dialog, 'open')
        .mockReturnValue({
          afterClosed: () => ({ pipe: () => ({ subscribe: () => {} }) }),
        });

      // Act
      component['create']();

      // Assert
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
      // Arrange
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

      // Act
      component['create']();

      // Assert
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
      // Arrange
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

      // Act
      component['create']();

      // Assert
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
      // Arrange
      const afterClosedSpy = jest.fn().mockReturnValue(of(true));
      jest.spyOn(component['dialog'], 'open').mockReturnValue({
        afterClosed: afterClosedSpy,
      } as any);

      const dialogRefSpy = jest.spyOn((component as any).dialogRef, 'close');

      // Act
      component['create']();

      // Assert
      expect(dialogRefSpy).toHaveBeenCalledWith(true);
    });
  });

  describe('firstEditableDate getter', () => {
    it('should return correct first editable date for Monthly period', () => {
      // Arrange
      const monthlyPeriod = { id: DateRangePeriod.Monthly, text: 'Monthly' };
      component['formGroup'].get('periodType1').setValue(monthlyPeriod);

      // Import and mock the firstEditableDate utility function
      jest.mock('../../../../feature/demand-validation/limits', () => ({
        firstEditableDate: jest.fn().mockReturnValue(new Date(2023, 0, 1)),
      }));

      // Act
      const result = component['firstEditableDate'];

      // Assert
      expect(result).toBeInstanceOf(Date);
    });

    it('should return correct first editable date for Weekly period', () => {
      // Arrange
      const weeklyPeriod = { id: DateRangePeriod.Weekly, text: 'Weekly' };
      component['formGroup'].get('periodType1').setValue(weeklyPeriod);

      // Act
      const result = component['firstEditableDate'];

      // Assert
      expect(result).toBeInstanceOf(Date);
    });
  });

  describe('Period types', () => {
    it('should initialize periodTypes with default values', () => {
      // Assert
      expect(component['periodTypes']).toBeDefined();
      expect(Array.isArray(component['periodTypes'])).toBe(true);
      expect(component['periodTypes'].length).toBeGreaterThan(0);
    });

    it('should have period types with id and text properties', () => {
      // Assert
      component['periodTypes'].forEach((periodType) => {
        expect(periodType).toHaveProperty('id');
        expect(periodType).toHaveProperty('text');
      });
    });
  });
});
