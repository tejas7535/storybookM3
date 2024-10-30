import { FormControl } from '@angular/forms';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { AbstractMultiAutocompleteComponent } from './abstract-multi-autocomplete.component';

class TestComponent extends AbstractMultiAutocompleteComponent {
  protected resetOptions(): void {}
  protected isPreloaded = false;
}

describe('AbstractSingleAutocompleteComponent', () => {
  let spectator: Spectator<TestComponent>;

  const createComponent = createComponentFactory({
    component: TestComponent,
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        searchControl: new FormControl(),
      },
    });
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
