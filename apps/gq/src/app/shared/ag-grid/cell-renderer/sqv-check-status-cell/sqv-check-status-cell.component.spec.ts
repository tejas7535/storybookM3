import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { SqvCheckStatus } from '@gq/shared/models/quotation-detail/cost';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ICellRendererParams } from 'ag-grid-enterprise';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { SqvCheckStatusCellComponent } from './sqv-check-status-cell.component';

describe('SqvCheckStatusCellComponent', () => {
  let component: SqvCheckStatusCellComponent;
  let spectator: Spectator<SqvCheckStatusCellComponent>;

  const createComponent = createComponentFactory({
    component: SqvCheckStatusCellComponent,
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
      expect(component['sqvCheckStatus']).toBe('OPEN');
    });
    test('should set the tagType based on the status', () => {
      component.agInit(cellParams);
      expect(component['tagType']).toBe('neutral');
    });
  });

  describe('getTagTypeByStatus', () => {
    test('should return neutral for OPEN status', () => {
      expect(component['getTagTypeByStatus'](SqvCheckStatus.OPEN)).toBe(
        'neutral'
      );
    });

    test('should return error for CANCELLED status', () => {
      expect(component['getTagTypeByStatus'](SqvCheckStatus.CANCELLED)).toBe(
        'error'
      );
    });

    test('should return success for CONFIRMED status', () => {
      expect(component['getTagTypeByStatus'](SqvCheckStatus.CONFIRMED)).toBe(
        'success'
      );
    });

    test('should return warning for IN_PROGRESS status', () => {
      expect(component['getTagTypeByStatus'](SqvCheckStatus.IN_PROGRESS)).toBe(
        'warning'
      );
    });

    test('should return neutral for any other status', () => {
      expect(component['getTagTypeByStatus'](null)).toBe('neutral');
    });
  });
});
