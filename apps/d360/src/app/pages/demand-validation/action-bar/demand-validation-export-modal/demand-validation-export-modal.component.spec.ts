import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { MockComponent } from 'ng-mocks';

import { DemandValidationService } from '../../../../feature/demand-validation/demand-validation.service';
import { SingleAutocompletePreLoadedComponent } from '../../../../shared/components/inputs/autocomplete/single-autocomplete-pre-loaded/single-autocomplete-pre-loaded.component';
import { DemandValidationDatePickerComponent } from '../demand-validation-date-picker/demand-validation-date-picker.component';
import { Stub } from './../../../../shared/test/stub.class';
import { DemandValidationExportModalComponent } from './demand-validation-export-modal.component';

describe('DemandValidationExportModalComponent', () => {
  let spectator: Spectator<DemandValidationExportModalComponent>;

  const createComponent = createComponentFactory({
    component: DemandValidationExportModalComponent,
    imports: [
      MockComponent(DemandValidationDatePickerComponent),
      MockComponent(SingleAutocompletePreLoadedComponent),
    ],
    providers: [
      Stub.getMatDialogDataProvider({
        customerData: [],
        dateRanges: {
          range1: {
            from: new Date(),
            to: new Date(),
            period: 'WEEKLY',
          },
        },
        demandValidationFilters: {},
      }),
      mockProvider(DemandValidationService),
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
