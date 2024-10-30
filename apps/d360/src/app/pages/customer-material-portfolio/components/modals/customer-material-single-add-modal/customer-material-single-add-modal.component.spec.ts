import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { MockProvider } from 'ng-mocks';

import { CustomerMaterialSingleAddModalComponent } from './customer-material-single-add-modal.component';

describe('CustomerMaterialSingleAddModalComponent', () => {
  let spectator: Spectator<CustomerMaterialSingleAddModalComponent>;
  const createComponent = createComponentFactory({
    component: CustomerMaterialSingleAddModalComponent,
    providers: [
      MockProvider(MAT_DIALOG_DATA, {
        customerNumber: '42',
      }),
      mockProvider(MatDialogRef<CustomerMaterialSingleAddModalComponent>),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
