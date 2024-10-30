import { FormControl, FormGroup } from '@angular/forms';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { MultiAutocompletePreLoadedComponent } from './multi-autocomplete-pre-loaded.component';

describe('MultiAutocompletePreLoadedComponent', () => {
  let spectator: Spectator<MultiAutocompletePreLoadedComponent>;

  const createComponent = createComponentFactory({
    component: MultiAutocompletePreLoadedComponent,
    providers: [],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        optionsLoadingResult: {
          options: [],
          loading: false,
          loadingError: null,
        },
        searchControl: new FormControl(),
        form: new FormGroup({}),
        control: new FormControl(),
      },
    });
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
