import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { MockProvider } from 'ng-mocks';

import { DemandValidationService } from '../../../../feature/demand-validation/demand-validation.service';
import { DemandValidationMultiListEditModalComponent } from './demand-validation-multi-list-edit-modal.component';

describe('DemandValidationMultiListEditModalComponent', () => {
  let spectator: Spectator<DemandValidationMultiListEditModalComponent>;

  const createComponent = createComponentFactory({
    component: DemandValidationMultiListEditModalComponent,
    imports: [],
    providers: [
      mockProvider(DemandValidationService),
      mockProvider(MatDialogRef),
      MockProvider(MAT_DIALOG_DATA, {
        customerName: 'Test Customer',
        customerNumber: '42',
        materialType: 'schaeffler',
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {},
    });
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
