import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { MockComponent, MockProvider } from 'ng-mocks';

import { MultiAutocompleteOnTypeComponent } from '../../../../../../shared/components/inputs/autocomplete/multi-autocomplete-on-type/multi-autocomplete-on-type.component';
import { MultiAutocompletePreLoadedComponent } from '../../../../../../shared/components/inputs/autocomplete/multi-autocomplete-pre-loaded/multi-autocomplete-pre-loaded.component';
import { SelectableOptionsService } from '../../../../../../shared/services/selectable-options.service';
import { FilterDemandValidationModalComponent } from './filter-demand-validation-modal.component';

describe('FilterDemandValidationModalComponent', () => {
  let spectator: Spectator<FilterDemandValidationModalComponent>;

  const createComponent = createComponentFactory({
    component: FilterDemandValidationModalComponent,
    imports: [
      MockComponent(MultiAutocompletePreLoadedComponent),
      MockComponent(MultiAutocompleteOnTypeComponent),
    ],
    providers: [
      mockProvider(SelectableOptionsService),
      MockProvider(MAT_DIALOG_DATA, {
        formGroup: new FormGroup({}),
        productionLineControl: new FormControl(),
        productLineControl: new FormControl(),
        customerMaterialControl: new FormControl(),
        stochhasticTypecontrol: new FormControl(),
        activeFilterCount: 0,
      }),
      mockProvider(MatDialogRef<FilterDemandValidationModalComponent>),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
