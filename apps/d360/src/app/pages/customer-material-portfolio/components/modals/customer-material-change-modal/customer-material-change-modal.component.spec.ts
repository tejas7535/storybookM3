import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { MockProvider } from 'ng-mocks';

import { CustomerMaterialChangeModalComponent } from './customer-material-change-modal.component';

describe('CustomerMaterialChangeModalComponent', () => {
  let spectator: Spectator<CustomerMaterialChangeModalComponent>;
  const createComponent = createComponentFactory({
    component: CustomerMaterialChangeModalComponent,
    providers: [
      MockProvider(MAT_DIALOG_DATA, {
        cmpData: {},
        modal: {},
      }),
      mockProvider(MatDialogRef<CustomerMaterialChangeModalComponent>),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
