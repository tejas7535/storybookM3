import { DateAdapter } from '@angular/material/core';
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
