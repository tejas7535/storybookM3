import { FormControl, FormGroup } from '@angular/forms';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';

import { SelectableOptionsService } from '../../../../services/selectable-options.service';
import { SingleAutocompleteOnTypeComponent } from './single-autocomplete-on-type.component';

describe('SingleAutocompleteOnTypeComponent', () => {
  let spectator: Spectator<SingleAutocompleteOnTypeComponent>;

  const createComponent = createComponentFactory({
    component: SingleAutocompleteOnTypeComponent,
    providers: [mockProvider(SelectableOptionsService)],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        displayFn: jest.fn(),
        control: new FormControl(),
        urlBegin: 'https://',
        form: new FormGroup({}),
        label: 'label',
      },
    });
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
