import { signal } from '@angular/core';
import { FormControl } from '@angular/forms';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { AbstractMultiAutocompleteComponent } from './abstract-multi-autocomplete.component';

class TestComponent extends AbstractMultiAutocompleteComponent {
  protected resetOptions(): void {}
  protected isPreloaded = false;
  public control = signal(new FormControl(null)) as any;
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
