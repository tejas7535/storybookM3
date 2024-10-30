import { FormControl, FormGroup } from '@angular/forms';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';

import { SelectableOptionsService } from '../../../../services/selectable-options.service';
import { SingleAutocompletePreLoadedComponent } from './single-autocomplete-pre-loaded.component';

describe('SingleAutocompletePreLoadedComponent', () => {
  let spectator: Spectator<SingleAutocompletePreLoadedComponent>;

  const createComponent = createComponentFactory({
    component: SingleAutocompletePreLoadedComponent,
    providers: [mockProvider(SelectableOptionsService)],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        displayFn: jest.fn(),
        control: new FormControl(),
        optionsLoadingResult: {
          options: [],
          loading: false,
          loadingError: null,
        },
        form: new FormGroup({}),
        label: 'label',
      },
    });
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
