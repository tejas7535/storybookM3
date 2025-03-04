import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { of } from 'rxjs';

import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { NumberSeparatorDirective } from '../../../../../shared/directives';
import { NumberWithoutFractionDigitsPipe } from '../../../../../shared/pipes/number-without-fraction-digits.pipe';
import {
  CustomerSalesPlanNumberEditModalComponent,
  CustomerSalesPlanNumberEditModalProps,
} from './customer-sales-plan-number-edit-modal.component';

describe('CustomerSalesPlanNumberEditModalComponent', () => {
  let spectator: Spectator<CustomerSalesPlanNumberEditModalComponent>;
  let component: CustomerSalesPlanNumberEditModalComponent;
  let dialogRef: MatDialogRef<CustomerSalesPlanNumberEditModalComponent>;

  let mockOnSave: jest.Mock;
  let mockOnDelete: jest.Mock;
  let mockCalculateReferenceValue: jest.Mock;
  let mockDialogData: CustomerSalesPlanNumberEditModalProps;

  const createComponent = createComponentFactory({
    component: CustomerSalesPlanNumberEditModalComponent,
    imports: [
      ReactiveFormsModule,
      SharedTranslocoModule,
      LoadingSpinnerModule,
      NumberSeparatorDirective,
      NumberWithoutFractionDigitsPipe,
    ],
    providers: [
      mockProvider(MatDialogRef, {
        close: jest.fn(),
      }),
      {
        provide: MAT_DIALOG_DATA,
        useFactory: () => mockDialogData,
      },
      mockProvider(TranslocoLocaleService, {
        getLocale: jest.fn().mockReturnValue('en-US'),
      }),
    ],
    detectChanges: false,
  });

  beforeEach(() => {
    mockOnSave = jest.fn().mockReturnValue(of(0));
    mockOnDelete = jest.fn().mockReturnValue(of(0));
    mockCalculateReferenceValue = jest
      .fn()
      .mockImplementation((value) => value * 1.5);

    mockDialogData = {
      title: 'Test Title',
      planningCurrency: 'EUR',
      previousValue: 1000,
      formLabel: 'Test Form Label',
      currentValueLabel: 'Current Value:',
      previousValueLabel: 'Previous Value:',
      referenceValueLabel: 'Reference Value:',
      previousReferenceValueLabel: 'Previous Reference Value:',
      referenceValue: 10_000,
      previousReferenceValue: 9000,
      calculateReferenceValue: mockCalculateReferenceValue,
      onSave: mockOnSave,
      onDelete: mockOnDelete,
    };

    spectator = createComponent();
    component = spectator.component;
    dialogRef = spectator.inject(MatDialogRef);

    spectator.detectChanges();
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with the correct data', () => {
    expect(component.data).toEqual(mockDialogData);
    expect(component.configuredValue()).toBeNull();
    expect(component.calculatedReferenceValue()).toBeNull();
    expect(component.loading()).toBeFalsy();
  });

  describe('Form validation', () => {
    it('should not allow empty input', () => {
      component.form.controls.adjustedValue.setValue(null);
      expect(component.form.valid).toBeFalsy();
    });

    it('should validate numeric input and reject negative values', () => {
      component.form.controls.adjustedValue.setValue('-1');
      expect(component.form.valid).toBeFalsy();
    });
  });

  describe('Input handling', () => {
    it('should handle input events correctly', () => {
      const mockEvent = new Event('input');

      component.form.controls.adjustedValue.setValue('2500');

      component.onInput(mockEvent);

      expect(component.configuredValue()).toBe(2500);
    });

    it('should not process empty input values', () => {
      const updateSpy = jest.spyOn(component as any, 'updateAdjustedValue');
      const mockEvent = new Event('input');

      component.form.controls.adjustedValue.setValue(null);
      component.onInput(mockEvent);

      expect(updateSpy).not.toHaveBeenCalled();
    });
  });

  describe('Dialog actions', () => {
    it('should handle cancel correctly', () => {
      component.onCancel();
      expect(dialogRef.close).toHaveBeenCalledWith(null);
    });

    it('should handle delete correctly', () => {
      const loadingSetSpy = jest.spyOn(component.loading, 'set');

      component.onDelete();

      expect(loadingSetSpy).toHaveBeenCalledWith(true);
      expect(mockOnDelete).toHaveBeenCalled();
      expect(dialogRef.close).toHaveBeenCalledWith(-1);
      expect(loadingSetSpy).lastCalledWith(false);
    });

    it('should handle save with valid form data', () => {
      const loadingSetSpy = jest.spyOn(component.loading, 'set');
      const markAllTouchedSpy = jest.spyOn(component.form, 'markAllAsTouched');

      // Set valid form data
      component.form.controls.adjustedValue.setValue('3000');
      component.onInput(new Event('input'));

      component.onSave();

      expect(markAllTouchedSpy).toHaveBeenCalled();
      expect(loadingSetSpy).toHaveBeenCalledWith(true);
      expect(mockOnSave).toHaveBeenCalledWith(3000);
      expect(dialogRef.close).toHaveBeenCalledWith(3000);
      expect(loadingSetSpy).toHaveBeenCalledWith(false);
    });

    it('should not save with invalid form data', () => {
      const markAllTouchedSpy = jest.spyOn(component.form, 'markAllAsTouched');

      component.form.controls.adjustedValue.setValue(null);

      component.onSave();

      expect(markAllTouchedSpy).toHaveBeenCalled();
      expect(mockOnSave).not.toHaveBeenCalled();
      expect(dialogRef.close).not.toHaveBeenCalled();
    });
  });

  describe('Template rendering', () => {
    it('should show loading spinner when loading', () => {
      component.loading.set(true);
      spectator.detectChanges();

      const spinner = spectator.query('schaeffler-loading-spinner');
      expect(spinner).toBeTruthy();

      // Dialog content should not be visible
      const dialogContent = spectator.query('mat-dialog-content');
      expect(dialogContent).toBeFalsy();
    });

    it('should show dialog content when not loading', () => {
      component.loading.set(false);
      spectator.detectChanges();

      const spinner = spectator.query('schaeffler-loading-spinner');
      expect(spinner).toBeFalsy();

      const dialogContent = spectator.query('mat-dialog-content');
      expect(dialogContent).toBeTruthy();
    });

    it('should display the form with correct labels', () => {
      spectator.detectChanges();

      const formField = spectator.query('mat-form-field');
      expect(formField).toBeTruthy();

      const label = spectator.query('mat-label');
      expect(label?.textContent).toContain(mockDialogData.formLabel);

      const input = spectator.query('input');
      expect(input).toBeTruthy();
      expect(input?.getAttribute('aria-label')).toBe(mockDialogData.formLabel);
    });

    it('should display correct buttons', () => {
      spectator.detectChanges();

      const buttons = spectator.queryAll('button');
      expect(buttons.length).toBe(3); // Delete, Cancel, Save

      const deleteButton = spectator.query('.delete-button');
      expect(deleteButton).toBeTruthy();

      const saveButton = spectator.query('button[mat-flat-button]');
      expect(saveButton).toBeTruthy();
    });
  });
});
