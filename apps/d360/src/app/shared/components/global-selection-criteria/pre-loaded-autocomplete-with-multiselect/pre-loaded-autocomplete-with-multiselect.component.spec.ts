import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { MockComponent } from 'ng-mocks';

import { MultiAutocompletePreLoadedComponent } from '../../inputs/autocomplete/multi-autocomplete-pre-loaded/multi-autocomplete-pre-loaded.component';
import { PreLoadedAutocompleteWithMultiselectComponent } from './pre-loaded-autocomplete-with-multiselect.component';

describe('PreLoadedAutocompleteWithMultiselectComponent', () => {
  let spectator: Spectator<PreLoadedAutocompleteWithMultiselectComponent>;

  const createComponent = createComponentFactory({
    component: PreLoadedAutocompleteWithMultiselectComponent,
    imports: [MockComponent(MultiAutocompletePreLoadedComponent)],
    providers: [mockProvider(MatDialog)],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        resolveFunction: jest.fn(),
        control: new FormControl(),
        form: new FormGroup({}),
        autocompleteLabel: 'test',
        getOptionLabel: jest.fn(),
        getOptionLabelInTag: jest.fn(),
        optionsLoadingResult: {
          options: [],
          loading: false,
          loadingError: null,
        },
        entityName: 'test',
        entityNamePlural: 'tests',
      },
    });
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
