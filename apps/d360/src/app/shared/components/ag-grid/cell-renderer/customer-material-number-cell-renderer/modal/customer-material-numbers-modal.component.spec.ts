import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockProvider } from 'ng-mocks';

import { CustomerMaterialNumbersModalComponent } from './customer-material-numbers-modal.component';

describe('CustomerMaterialNumbersDialogComponent', () => {
  let spectator: Spectator<CustomerMaterialNumbersModalComponent>;

  const createComponent = createComponentFactory({
    component: CustomerMaterialNumbersModalComponent,
    imports: [],
    providers: [
      MockProvider(MAT_DIALOG_DATA, {
        isLoading: jest.fn(),
        customerMaterialNumbers: jest.fn(),
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
