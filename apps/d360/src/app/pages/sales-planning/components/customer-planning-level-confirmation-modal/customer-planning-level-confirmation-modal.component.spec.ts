import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { CustomerPlanningLevelConfirmationModalComponent } from './customer-planning-level-confirmation-modal.component';

describe('CustomerPlanningLevelConfirmationModalComponent', () => {
  let spectator: Spectator<CustomerPlanningLevelConfirmationModalComponent>;
  const createComponent = createComponentFactory({
    component: CustomerPlanningLevelConfirmationModalComponent,
    providers: [
      {
        provide: MatDialogRef,
        useValue: {
          close: jest.fn(),
        },
      },
      {
        provide: MAT_DIALOG_DATA,
        useValue: {
          customerName: 'Tesla Inc',
          customerNumber: '0000086023',
        },
      },
    ],
    imports: [],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should display the customer name and number below the headline', () => {
    const customerInfoElement = spectator.query('p.text-title-small');
    expect(customerInfoElement).toHaveText('0000086023 - Tesla Inc');
  });

  it('should close the dialog with true when the confirm button is clicked', () => {
    const confirmButton = spectator.query('button[mat-flat-button]');
    spectator.click(confirmButton);

    expect(spectator.inject(MatDialogRef).close).toHaveBeenCalledWith(true);
  });

  it('should close the dialog with false when the cancel button is clicked', () => {
    const cancelButton = spectator.query('button[mat-button]');
    spectator.click(cancelButton);

    expect(spectator.inject(MatDialogRef).close).toHaveBeenCalledWith(false);
  });
});
