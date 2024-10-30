import { FormControl, FormGroup } from '@angular/forms';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { FilterDropdownComponent } from './filter-dropdown.component';

describe('SingleAutocompletePreLoadedComponent', () => {
  let spectator: Spectator<FilterDropdownComponent>;

  const createComponent = createComponentFactory({
    component: FilterDropdownComponent,
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        label: 'Dropdown',
        control: new FormControl({ id: '1', text: 'Option 1' }),
        form: new FormGroup({}),
        disabled: false,
        options: [{ id: '1', text: 'Option 1' }],
        loading: false,
        multiSelect: false,
      },
    });
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
