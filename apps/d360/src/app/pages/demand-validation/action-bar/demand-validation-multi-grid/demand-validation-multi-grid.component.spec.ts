import { DateAdapter } from '@angular/material/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';

import { Stub } from './../../../../shared/test/stub.class';
import { DemandValidationMultiGridComponent } from './demand-validation-multi-grid.component';

describe('DemandValidationMultiGridConfigurationModalComponent', () => {
  let spectator: Spectator<DemandValidationMultiGridComponent>;

  const createComponent = createComponentFactory({
    component: DemandValidationMultiGridComponent,
    imports: [],
    providers: [
      mockProvider(MatDialog),
      mockProvider(MatDialogRef),
      mockProvider(DateAdapter),
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
