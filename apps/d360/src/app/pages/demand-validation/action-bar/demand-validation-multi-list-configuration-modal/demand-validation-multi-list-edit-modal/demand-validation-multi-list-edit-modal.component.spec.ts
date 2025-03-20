import { MatDialogRef } from '@angular/material/dialog';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';

import { DemandValidationService } from '../../../../../feature/demand-validation/demand-validation.service';
import { Stub } from './../../../../../shared/test/stub.class';
import { DemandValidationMultiListEditModalComponent } from './demand-validation-multi-list-edit-modal.component';

describe('DemandValidationMultiListEditModalComponent', () => {
  let spectator: Spectator<DemandValidationMultiListEditModalComponent>;

  const createComponent = createComponentFactory({
    component: DemandValidationMultiListEditModalComponent,
    imports: [],
    providers: [
      mockProvider(DemandValidationService),
      mockProvider(MatDialogRef),
      Stub.getMatDialogDataProvider({
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
