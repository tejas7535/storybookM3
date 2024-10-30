import { FormControl, FormGroup } from '@angular/forms';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';

import {
  OptionsLoadingResult,
  SelectableOptionsService,
} from '../../../../services/selectable-options.service';
import { MultiAutocompleteOnTypeComponent } from './multi-autocomplete-on-type.component';

describe('MultiAutocompleteOnTypeComponent', () => {
  let spectator: Spectator<MultiAutocompleteOnTypeComponent>;

  const createComponent = createComponentFactory({
    component: MultiAutocompleteOnTypeComponent,
    providers: [mockProvider(SelectableOptionsService)],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        urlBegin: 'https://',
        requestWithLang: true,
        displayFn: jest.fn(),
        searchControl: new FormControl(),
        form: new FormGroup({}),
        control: new FormControl(),
        optionsLoadingResult: {} as OptionsLoadingResult,
      },
    });
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
