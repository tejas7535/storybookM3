import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { Rfq4Status } from '@gq/shared/models/quotation-detail/cost';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ICellRendererParams } from 'ag-grid-enterprise';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { Rfq4CalculatorStatusCellComponent } from './rfq-4-calculator-status-cell.component';

describe('Rfq4CalculatorStatus', () => {
  let component: Rfq4CalculatorStatusCellComponent;
  let spectator: Spectator<Rfq4CalculatorStatusCellComponent>;

  const createComponent = createComponentFactory({
    component: Rfq4CalculatorStatusCellComponent,
    imports: [provideTranslocoTestingModule({ en: {} })],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('agInit', () => {
    const cellParams = {
      value: 'OPEN',
      data: {},
      context: {},
    } as ICellRendererParams;

    test('should set value from Params', () => {
      component.agInit(cellParams);
      expect(component['rfq4Status']).toBe('OPEN');
    });
    test('should set the tagType based on the status', () => {
      component.agInit(cellParams);
      expect(component['tagType']).toBe('info');
    });
  });

  describe('getTagTypeByStatus', () => {
    test('should return neutral for OPEN status', () => {
      expect(component['getTagTypeByStatus'](Rfq4Status.OPEN)).toBe('info');
    });
    test('should return neutral for REOPEN status', () => {
      expect(component['getTagTypeByStatus'](Rfq4Status.REOPEN)).toBe(
        'warning'
      );
    });

    test('should return neutral for any other status', () => {
      expect(component['getTagTypeByStatus'](null)).toBe('neutral');
    });
  });
});
