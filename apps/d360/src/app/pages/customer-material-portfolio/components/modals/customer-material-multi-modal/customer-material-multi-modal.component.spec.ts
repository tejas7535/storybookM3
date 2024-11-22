import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { AgGridModule } from 'ag-grid-angular';
import { MockProvider } from 'ng-mocks';

import { CMPService } from '../../../../../feature/customer-material-portfolio/cmp.service';
import { CustomerMaterialMultiModalComponent } from './customer-material-multi-modal.component';

describe('CustomerMaterialMultiModalComponent', () => {
  let spectator: Spectator<CustomerMaterialMultiModalComponent>;

  const createComponent = createComponentFactory({
    component: CustomerMaterialMultiModalComponent,
    imports: [AgGridModule],
    providers: [
      MockProvider(MAT_DIALOG_DATA, { customerNumber: '' }),
      mockProvider(CMPService),
      mockProvider(MatDialogRef<CustomerMaterialMultiModalComponent>),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
