import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';

import { Stub } from './../../../../shared/test/stub.class';
import { DemandValidationMultiListConfigurationModalComponent } from './demand-validation-multi-list-configuration-modal.component';

describe('DemandValidationMultiListConfigurationModalComponent', () => {
  let spectator: Spectator<DemandValidationMultiListConfigurationModalComponent>;

  const createComponent = createComponentFactory({
    component: DemandValidationMultiListConfigurationModalComponent,
    imports: [],
    providers: [
      mockProvider(MatDialog),
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
