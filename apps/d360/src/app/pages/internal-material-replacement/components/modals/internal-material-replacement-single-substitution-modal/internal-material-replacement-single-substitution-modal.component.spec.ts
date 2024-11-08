import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { MockComponent, MockProvider } from 'ng-mocks';

import { IMRService } from '../../../../../feature/internal-material-replacement/imr.service';
import { DatePickerComponent } from '../../../../../shared/components/date-picker/date-picker.component';
import { SingleAutocompleteOnTypeComponent } from '../../../../../shared/components/inputs/autocomplete/single-autocomplete-on-type/single-autocomplete-on-type.component';
import { SingleAutocompletePreLoadedComponent } from '../../../../../shared/components/inputs/autocomplete/single-autocomplete-pre-loaded/single-autocomplete-pre-loaded.component';
import { FilterDropdownComponent } from '../../../../../shared/components/inputs/filter-dropdown/filter-dropdown.component';
import { SelectableOptionsService } from '../../../../../shared/services/selectable-options.service';
import { InternalMaterialReplacementSingleSubstitutionModalComponent } from './internal-material-replacement-single-substitution-modal.component';

describe('InternalMaterialReplacementSingleSubstitutionModalComponent', () => {
  let spectator: Spectator<InternalMaterialReplacementSingleSubstitutionModalComponent>;

  const createComponent = createComponentFactory({
    component: InternalMaterialReplacementSingleSubstitutionModalComponent,
    imports: [
      MockComponent(SingleAutocompleteOnTypeComponent),
      MockComponent(SingleAutocompletePreLoadedComponent),
      MockComponent(DatePickerComponent),
      MockComponent(FilterDropdownComponent),
    ],
    providers: [
      mockProvider(SelectableOptionsService, {
        get: jest.fn().mockReturnValue([]),
      }),
      mockProvider(IMRService),
      MockProvider(MAT_DIALOG_DATA, {
        isNewSubstitution: false,
        substitution: {},
        gridApi: {},
      }),
      mockProvider(
        MatDialogRef<InternalMaterialReplacementSingleSubstitutionModalComponent>
      ),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
