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
import { MockComponent } from 'ng-mocks';

import { DemandValidationService } from '../../../../feature/demand-validation/demand-validation.service';
import { GlobalSelectionHelperService } from '../../../../feature/global-selection/global-selection.service';
import { DemandValidationDatePickerComponent } from '../demand-validation-date-picker/demand-validation-date-picker.component';
import { DemandValidationMultiDeleteModalComponent } from './demand-validation-multi-delete-modal.component';

jest.mock('@jsverse/transloco', () => ({
  translate: jest.fn((key, _) => `${key} mocked`),
}));

describe('DemandValidationMultiDeleteModalComponent', () => {
  let spectator: Spectator<DemandValidationMultiDeleteModalComponent>;

  const createComponent = createComponentFactory({
    component: DemandValidationMultiDeleteModalComponent,
    imports: [MockComponent(DemandValidationDatePickerComponent)],
    componentMocks: [],
    providers: [
      {
        provide: MAT_DIALOG_DATA,
        useValue: {
          customerName: 'BMW',
          customerNumber: '0000042',
          onSave: jest.fn(),
        },
      },
      mockProvider(DemandValidationService),
      mockProvider(GlobalSelectionHelperService),
      mockProvider(MatDialogRef, {
        close: jest.fn(),
      }),
      mockProvider(MatDialog, {
        open: jest.fn(),
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent({});
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
