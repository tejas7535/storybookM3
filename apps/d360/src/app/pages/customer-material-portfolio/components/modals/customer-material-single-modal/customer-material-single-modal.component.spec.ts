import { HttpClient } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { of } from 'rxjs';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { MockProvider } from 'ng-mocks';

import { CustomerMaterialSingleModalComponent } from './customer-material-single-modal.component';

describe('CustomerMaterialSingleModalComponent', () => {
  let spectator: Spectator<CustomerMaterialSingleModalComponent>;
  const createComponent = createComponentFactory({
    component: CustomerMaterialSingleModalComponent,
    providers: [
      MockProvider(MAT_DIALOG_DATA, {
        customerNumber: '42',
      }),
      mockProvider(MatDialogRef<CustomerMaterialSingleModalComponent>),
      mockProvider(HttpClient, { get: () => of({}) }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
