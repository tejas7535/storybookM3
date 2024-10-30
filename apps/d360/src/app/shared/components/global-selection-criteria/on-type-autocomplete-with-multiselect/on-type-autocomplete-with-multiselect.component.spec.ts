import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { MockComponent } from 'ng-mocks';

import { MultiAutocompleteOnTypeComponent } from '../../inputs/autocomplete/multi-autocomplete-on-type/multi-autocomplete-on-type.component';
import { OnTypeAutocompleteWithMultiselectComponent } from './on-type-autocomplete-with-multiselect.component';

describe('OnTypeAutocompleteWithMultiselectComponent', () => {
  let spectator: Spectator<OnTypeAutocompleteWithMultiselectComponent>;

  const createComponent = createComponentFactory({
    component: OnTypeAutocompleteWithMultiselectComponent,
    imports: [MockComponent(MultiAutocompleteOnTypeComponent)],
    providers: [mockProvider(MatDialog)],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        urlBegin: 'test',
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
