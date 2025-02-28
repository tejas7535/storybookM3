import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { of, Subject } from 'rxjs';

import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockProvider } from 'ng-mocks';

import {
  CustomerSalesPlanNumberEditModalProps,
  CustomerSalesPlanSinglePercentageEditModalComponent,
} from './customer-sales-plan-single-percentage-edit-modal.component';

describe('CustomerSalesPlanSinglePercentageEditModalComponent', () => {
  let spectator: Spectator<CustomerSalesPlanSinglePercentageEditModalComponent>;
  const mockDialogRef: Partial<
    MatDialogRef<CustomerSalesPlanSinglePercentageEditModalComponent>
  > = {
    close: jest.fn(),
  };

  const mockData: CustomerSalesPlanNumberEditModalProps = {
    title: 'Edit Percentage',
    planningCurrency: 'USD',
    previousValue: 10,
    formLabel: 'Adjustment Value',
    currentValueLabel: 'Current Value',
    previousValueLabel: 'Previous Value',
    referenceValueLabel: 'Reference Value',
    previousReferenceValueLabel: 1000,
    referenceValue: 1000,
    previousReferenceValue: 900,
    onSave: jest.fn().mockReturnValue(of()),
    onDelete: jest.fn().mockReturnValue(of()),
  };

  const createComponent = createComponentFactory({
    component: CustomerSalesPlanSinglePercentageEditModalComponent,
    providers: [
      { provide: MatDialogRef, useValue: mockDialogRef },
      MockProvider(MAT_DIALOG_DATA, mockData),
      MockProvider(TranslocoLocaleService, {
        getLocale: () => 'en-US',
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should create the component', () => {
    expect(spectator.component).toBeTruthy();
  });

  describe('Delete functionality', () => {
    it('should call onDelete method when delete button is clicked', () => {
      jest.spyOn(spectator.component, 'onDelete');

      const deleteButton = spectator.query('.delete-button');
      spectator.click(deleteButton);

      expect(spectator.component.onDelete).toHaveBeenCalled();
    });

    it('should call data.onDelete and close dialog with 0 when onDelete is called', () => {
      const deleteSubject = new Subject<void>();
      mockData.onDelete = jest.fn().mockReturnValue(deleteSubject);

      spectator.component.onDelete();

      deleteSubject.next();
      deleteSubject.complete();

      expect(mockData.onDelete).toHaveBeenCalled();

      expect(mockDialogRef.close).toHaveBeenCalledWith(0);
    });

    it('should set loading to true during delete operation', () => {
      const deleteSubject = new Subject<void>();
      mockData.onDelete = jest.fn().mockReturnValue(deleteSubject);

      expect(spectator.component.loading()).toBe(false);

      spectator.component.onDelete();

      expect(spectator.component.loading()).toBe(true);

      deleteSubject.complete();
    });

    it('should set loading to false after delete operation completes', () => {
      mockData.onDelete = jest.fn().mockReturnValue(of(0));

      spectator.component.onDelete();

      expect(spectator.component.loading()).toBe(false);
    });
  });

  describe('Form validation', () => {
    it('should mark form controls as touched when onSave is called', () => {
      jest.spyOn(spectator.component.form, 'markAllAsTouched');

      spectator.component.onSave();

      expect(spectator.component.form.markAllAsTouched).toHaveBeenCalled();
    });

    it('should show required error when form is submitted with empty input', () => {
      spectator.component.form.controls.adjustedPercentage.setValue(null);

      spectator.component.form.controls.adjustedPercentage.markAsTouched();

      expect(
        spectator.component.form.controls.adjustedPercentage.hasError(
          'required'
        )
      ).toBe(true);
    });
  });

  describe('Zero value handling', () => {
    it('should accept 0 as a valid percentage value', () => {
      spectator.component.form.controls.adjustedPercentage.setValue('0');

      expect(spectator.component.form.valid).toBe(true);

      expect(spectator.component.adjustedPercentage()).toBe(0);
    });

    it('should calculate reference value correctly when percentage is 0', () => {
      spectator.component.form.controls.adjustedPercentage.setValue('0');

      expect(spectator.component.calculatedReferenceValue()).toBe(1000); // 1000 * (1 - 0/100)
    });
  });

  describe('Cancel functionality', () => {
    it('should close dialog with null when cancel button is clicked', () => {
      const cancelButton = spectator.query('.cancel-button');
      spectator.click(cancelButton);

      expect(mockDialogRef.close).toHaveBeenCalledWith(null);
    });
  });

  describe('Loading state', () => {
    it('should show loading spinner when loading is true', () => {
      spectator.component.loading.set(true);
      spectator.detectChanges();

      const spinner = spectator.query('schaeffler-loading-spinner');
      expect(spinner).toBeTruthy();
    });

    it('should hide form content when loading is true', () => {
      spectator.component.loading.set(true);
      spectator.detectChanges();

      const formElement = spectator.query('mat-dialog-content');
      expect(formElement).toBeFalsy();
    });
  });
});
