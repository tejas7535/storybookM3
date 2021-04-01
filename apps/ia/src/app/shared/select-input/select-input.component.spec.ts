import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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

  describe('selectionChange', () => {
    test('should call emitChange', () => {
      component.emitChange = jest.fn();

      component.selectionChange(({
        value: '1',
      } as unknown) as MatSelectChange);

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

  describe('trackByFn', () => {
    it('should return index', () => {
      const result = component.trackByFn(3, options[0]);

      expect(result).toEqual(3);
    });
  });
});
