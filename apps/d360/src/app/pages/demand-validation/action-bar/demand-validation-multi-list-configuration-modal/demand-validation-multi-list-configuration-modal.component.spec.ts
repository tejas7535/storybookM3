import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { MockProvider } from 'ng-mocks';

import { DemandValidationMultiListConfigurationModalComponent } from './demand-validation-multi-list-configuration-modal.component';

describe('DemandValidationMultiListConfigurationModalComponent', () => {
  let spectator: Spectator<DemandValidationMultiListConfigurationModalComponent>;

  const createComponent = createComponentFactory({
    component: DemandValidationMultiListConfigurationModalComponent,
    imports: [],
    providers: [
      mockProvider(MatDialog),
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
