import { InputSignal, Signal, signal } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Observable, of } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { SelectableValue } from '../../selectable-values.utils';
import { AbstractSingleAutocompleteComponent } from './abstract-single-autocomplete.component';

class TestComponent extends AbstractSingleAutocompleteComponent {
  protected onSearchControlChange$(
    _value: string,
    _setFormControlValue?: boolean
  ): Observable<unknown | void> {
    return of();
  }
  protected resetOptions() {}
  protected onOptionSelected() {}

  protected isPreloaded = false;
  protected filteredOptions: Signal<SelectableValue[]> = signal([]);
  public displayFn:
    | InputSignal<(option: SelectableValue | string) => string>
    | InputSignal<(option?: SelectableValue) => string> = signal(
    () => ''
  ) as any;
}

describe('AbstractSingleAutocompleteComponent', () => {
  let spectator: Spectator<AbstractSingleAutocompleteComponent>;

  const createComponent = createComponentFactory({
    component: TestComponent,
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        control: new FormControl(),
      },
    });
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
