import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { EMPTY } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockProvider } from 'ng-mocks';

import {
  AdjustmentOption,
  CustomerSalesPlanNumberEditModalComponent,
} from './customer-sales-plan-number-edit-modal.component';

describe('CustomerSalesPlanNumberEditModalComponent', () => {
  let spectator: Spectator<CustomerSalesPlanNumberEditModalComponent>;
  let mockDialogRef: Partial<
    MatDialogRef<CustomerSalesPlanNumberEditModalComponent>
  >;

  const mockData = {
    title: 'Edit Sales Plan',
    planningCurrency: 'USD',
    previousValue: 100,
    formLabel: 'Adjustment Value',
    currentValueLabel: 'Current Value',
    previousValueLabel: 'Previous Value',
    onSave: jest.fn().mockReturnValue(EMPTY),
    onDelete: jest.fn().mockReturnValue(EMPTY),
    inputValidatorFn: jest.fn().mockReturnValue(null),
    inputValidatorErrorMessage: 'Invalid input',
  };

  const createComponent = createComponentFactory({
    component: CustomerSalesPlanNumberEditModalComponent,
    providers: [
      { provide: MatDialogRef, useValue: mockDialogRef },
      MockProvider(MAT_DIALOG_DATA, mockData),
    ],
  });

  beforeEach(() => {
    mockDialogRef = { close: jest.fn() };

    spectator = createComponent();
  });

  it('should create the component', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should display the title correctly', () => {
    const titleElement = spectator.query('h2');

    expect(titleElement).toHaveText('Edit Sales Plan');
  });

  it('should initialize the form with default values', () => {
    expect(spectator.component.form.controls.adjustmentOption.value).toBe(
      AdjustmentOption.Absolute
    );
    expect(spectator.component.form.controls.adjustedValue.value).toBeNull();
  });

  it('should not save when the form is invalid', () => {
    spectator.click(spectator.query('button[mat-flat-button]'));

    expect(mockData.onSave).not.toHaveBeenCalled();
    expect(mockDialogRef.close).not.toHaveBeenCalled();
  });

  it('should reset adjusted value on adjustment option change', () => {
    spectator.component.form.controls.adjustmentOption.setValue(
      AdjustmentOption.Relative
    );
    spectator.detectChanges();
    expect(spectator.component.form.controls.adjustedValue.value).toBeNull();
  });
});
