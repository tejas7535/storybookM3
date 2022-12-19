import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { ICellRendererParams } from 'ag-grid-community';

import { EditCaseMaterialComponent } from './edit-case-material.component';

describe('EditCaseMaterialComponent', () => {
  let component: EditCaseMaterialComponent;
  let spectator: Spectator<EditCaseMaterialComponent>;

  const createComponent = createComponentFactory({
    component: EditCaseMaterialComponent,
    imports: [MatIconModule, CommonModule],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('agInit', () => {
    test('should set params and cellValue', () => {
      const params = {
        value: 'test',
      } as any as ICellRendererParams;
      component.getValueToDisplay = jest.fn(() => 'value');

      component.agInit(params);

      expect(component.params).toEqual(params);
      expect(component.cellValue).toEqual('value');
    });
  });

  describe('refresh', () => {
    test('should return true and setCellValue', () => {
      component.cellValue = 'currentCellValue';
      const newValue = 'newValue';

      const params = { value: newValue };

      const result = component.refresh(params as any);

      expect(component.cellValue).toEqual(newValue);
      expect(result).toBeTruthy();
    });
  });

  describe('getValueToDisplay', () => {
    test('should return valueFormatted', () => {
      const params = { valueFormatted: 'valueFormatted', value: 'value' };

      const result = component.getValueToDisplay(params as any);

      expect(result).toEqual(params.valueFormatted);
    });
    test('should return value', () => {
      const params = { valueFormatted: undefined as any, value: 'value' };

      const result = component.getValueToDisplay(params as any);

      expect(result).toEqual(params.value);
    });
  });
});
