import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { Rfq4Status } from '@gq/shared/models/quotation-detail/cost';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ICellRendererParams } from 'ag-grid-enterprise';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { Rfq4StatusCellComponent } from './rfq-4-status-cell.component';

describe('SqvCheckStatusCellComponent', () => {
  let component: Rfq4StatusCellComponent;
  let spectator: Spectator<Rfq4StatusCellComponent>;

  const createComponent = createComponentFactory({
    component: Rfq4StatusCellComponent,
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
      expect(component['tagType']).toBe('neutral');
    });
  });

  describe('getTagTypeByStatus', () => {
    test('should return neutral for OPEN status', () => {
      expect(component['getTagTypeByStatus'](Rfq4Status.OPEN)).toBe('neutral');
    });

    test('should return error for CANCELLED status', () => {
      expect(component['getTagTypeByStatus'](Rfq4Status.CANCELLED)).toBe(
        'error'
      );
    });

    test('should return success for CONFIRMED status', () => {
      expect(component['getTagTypeByStatus'](Rfq4Status.CONFIRMED)).toBe(
        'success'
      );
    });

    test('should return warning for IN_PROGRESS status', () => {
      expect(component['getTagTypeByStatus'](Rfq4Status.IN_PROGRESS)).toBe(
        'warning'
      );
    });

    test('should return neutral for any other status', () => {
      expect(component['getTagTypeByStatus'](null)).toBe('neutral');
    });
  });
});
