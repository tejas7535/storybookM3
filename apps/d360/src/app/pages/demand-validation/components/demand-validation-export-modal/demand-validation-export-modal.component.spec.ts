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

import { SingleAutocompletePreLoadedComponent } from '../../../../shared/components/inputs/autocomplete/single-autocomplete-pre-loaded/single-autocomplete-pre-loaded.component';
import { ExportDemandValidationService } from '../../services/export-demand-validation.service';
import { DemandValidationDatePickerComponent } from '../demand-validation-date-picker/demand-validation-date-picker.component';
import { DemandValidationExportModalComponent } from './demand-validation-export-modal.component';

jest.mock('@jsverse/transloco', () => ({
  translate: jest.fn((key, _) => `${key} mocked`),
}));

describe('DemandValidationExportModalComponent', () => {
  let spectator: Spectator<DemandValidationExportModalComponent>;

  const createComponent = createComponentFactory({
    component: DemandValidationExportModalComponent,
    imports: [
      MockComponent(DemandValidationDatePickerComponent),
      MockComponent(SingleAutocompletePreLoadedComponent),
    ],
    providers: [
      {
        provide: MAT_DIALOG_DATA,
        useValue: {
          customerData: [],
          dateRanges: {
            range1: {
              from: new Date(),
              to: new Date(),
              period: 'WEEKLY',
            },
          },
          demandValidationFilters: {},
        },
      },
      mockProvider(ExportDemandValidationService),
      mockProvider(MatDialogRef, {
        close: jest.fn(),
      }),
      mockProvider(MatDialog, {
        open: jest.fn(),
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
