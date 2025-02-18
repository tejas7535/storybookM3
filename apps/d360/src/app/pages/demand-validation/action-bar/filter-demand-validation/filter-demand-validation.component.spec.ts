import { MatDialog } from '@angular/material/dialog';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { MockComponent } from 'ng-mocks';

import { MultiAutocompleteOnTypeComponent } from '../../../../shared/components/inputs/autocomplete/multi-autocomplete-on-type/multi-autocomplete-on-type.component';
import { FilterDemandValidationComponent } from './filter-demand-validation.component';

describe('FilterDemandValidationComponent', () => {
  let spectator: Spectator<FilterDemandValidationComponent>;

  const createComponent = createComponentFactory({
    component: FilterDemandValidationComponent,
    imports: [MockComponent(MultiAutocompleteOnTypeComponent)],
    providers: [mockProvider(MatDialog)],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
