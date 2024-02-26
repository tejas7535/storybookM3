import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { RadioButtonGroupComponent } from './radio-button-group.component';

describe('RadioButtonGroupComponent', () => {
  let spectator: Spectator<RadioButtonGroupComponent<string>>;
  let component: RadioButtonGroupComponent<string>;

  const createComponent = createComponentFactory({
    component: RadioButtonGroupComponent<string>,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;

    spectator.setInput('control', new FormControl<string>(''));

    spectator.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onOptionSelected', () => {
    it('should set control value and emit', () => {
      component.optionSelected.emit = jest.fn();
      component.control.setValue = jest.fn();

      component.onOptionSelected({ value: 'test' } as MatRadioChange & {
        value: string;
      });

      expect(component.control.setValue).toHaveBeenCalledWith('test');
      expect(component.optionSelected.emit).toHaveBeenCalledWith('test');
    });
  });
});
