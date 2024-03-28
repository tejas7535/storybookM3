import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { IdValue } from '../models';
import { SelectInputComponent } from './select-input.component';

describe('SelectInputComponent', () => {
  let component: SelectInputComponent;
  let spectator: Spectator<SelectInputComponent>;
  let options: IdValue[];

  const createComponent = createComponentFactory({
    component: SelectInputComponent,
    declarations: [SelectInputComponent],
    imports: [MatSelectModule, FormsModule, ReactiveFormsModule],
    providers: [{ provide: MATERIAL_SANITY_CHECKS, useValue: false }],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    options = [new IdValue('1', 'one'), new IdValue('2', 'two')];
    component.options = options;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('set disabled', () => {
    test('should disable control when true', () => {
      component.selectControl.disable = jest.fn();
      component.selectControl.enable = jest.fn();

      component.disabled = true;

      expect(component.selectControl.disable).toHaveBeenCalled();
      expect(component.selectControl.enable).not.toHaveBeenCalled();
    });
    test('should enable control when false', () => {
      component.selectControl.disable = jest.fn();
      component.selectControl.enable = jest.fn();

      component.disabled = false;

      expect(component.selectControl.disable).not.toHaveBeenCalled();
      expect(component.selectControl.enable).toHaveBeenCalled();
    });
  });

  describe('closePanel', () => {
    test('should trigger close in select input component', () => {
      component.matSelect.close = jest.fn();

      component.closePanel();

      expect(component.matSelect.close).toHaveBeenCalled();
    });
  });

  describe('selectionChange', () => {
    test('should call emitChange', () => {
      component.emitChange = jest.fn();

      component.selectionChange({
        value: '1',
      } as unknown as MatSelectChange);

      expect(component.emitChange).toHaveBeenCalledWith(options[0]);
    });
  });

  describe('emitChange', () => {
    test('should emit option', () => {
      component.selected.emit = jest.fn();

      component.emitChange(options[0]);

      expect(component.selected.emit).toHaveBeenCalledWith(options[0]);
    });
  });

  describe('findOptionById', () => {
    test('should return option by id', () => {
      const expectedOption = { id: '1', value: 'bug' };
      component.options = [{ id: '0', value: 'idea' }, expectedOption];

      const result = component.findOptionById(expectedOption.id);

      expect(result).toBe(expectedOption);
    });
  });

  describe('writeValue', () => {
    test('should set value', () => {
      const value = 'idea';

      component.writeValue(value);

      expect(component.selectControl.value).toBe(value);
    });
  });

  describe('registerOnChange', () => {
    test('should register on change function', () => {
      const onChange = () => {};

      component.registerOnChange(onChange);

      expect(component.onChange).toEqual(onChange);
    });
  });

  describe('registerOnTouched', () => {
    test('should register on touched function', () => {
      const onTouched = () => {};

      component.registerOnTouched(onTouched);

      expect(component.onTouched).toEqual(onTouched);
    });
  });

  describe('setDisabledState', () => {
    test('should set disabled state', () => {
      component.selectControl.disable = jest.fn();
      component.selectControl.enable = jest.fn();
      component.setDisabledState(true);

      expect(component.selectControl.disable).toHaveBeenCalled();
    });

    test('should set enabled state', () => {
      component.selectControl.disable = jest.fn();
      component.selectControl.enable = jest.fn();

      component.setDisabledState(false);

      expect(component.selectControl.enable).toHaveBeenCalled();
    });
  });
});
