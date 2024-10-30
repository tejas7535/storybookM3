import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockComponent, MockProvider } from 'ng-mocks';

import { MultiAutocompleteOnTypeComponent } from '../autocomplete/multi-autocomplete-on-type/multi-autocomplete-on-type.component';
import { MultiAutocompletePreLoadedComponent } from '../autocomplete/multi-autocomplete-pre-loaded/multi-autocomplete-pre-loaded.component';
import { MultiselectFromClipboardModalComponent } from './multiselect-from-clipboard-modal.component';

describe('MultiselectFromClipboardModalComponent', () => {
  let spectator: Spectator<MultiselectFromClipboardModalComponent>;

  const createComponent = createComponentFactory({
    component: MultiselectFromClipboardModalComponent,
    imports: [
      MockComponent(MultiAutocompletePreLoadedComponent),
      MockComponent(MultiAutocompleteOnTypeComponent),
    ],
    providers: [
      MockProvider(MAT_DIALOG_DATA, {
        control: new FormControl([]),
        searchControl: new FormControl(),
        form: new FormGroup({}),
        selectableValuesByKeys: jest.fn(),
        entityName: 'test',
        entityNamePlural: 'tests',
        autocompleteLabel: 'Select...',
        getOptionLabelInTag: jest.fn(),
        optionsLoadingResults: {},
        getOptionLabel: jest.fn(),
        urlBegin: 'https://',
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
