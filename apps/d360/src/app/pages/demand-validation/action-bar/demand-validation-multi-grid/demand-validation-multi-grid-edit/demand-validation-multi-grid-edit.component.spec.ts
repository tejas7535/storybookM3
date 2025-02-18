import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { of } from 'rxjs';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { MockProvider } from 'ng-mocks';

import { DemandValidationService } from '../../../../../feature/demand-validation/demand-validation.service';
import { DemandValidationMultiGridEditComponent } from './demand-validation-multi-grid-edit.component';

describe('DemandValidationMultiListEditModalComponent', () => {
  let spectator: Spectator<DemandValidationMultiGridEditComponent>;

  const createComponent = createComponentFactory({
    component: DemandValidationMultiGridEditComponent,
    imports: [],
    providers: [
      mockProvider(DemandValidationService, {
        getKpiBuckets: jest.fn().mockReturnValue(of([])),
      }),
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
