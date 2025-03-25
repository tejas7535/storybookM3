import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ICellRendererParams } from 'ag-grid-enterprise';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { SqvApprovalStatusCellComponent } from './sqv-approval-status-cell.component';

describe('SqvApprovalStatusCellComponent', () => {
  let component: SqvApprovalStatusCellComponent;
  let spectator: Spectator<SqvApprovalStatusCellComponent>;

  const createComponent = createComponentFactory({
    component: SqvApprovalStatusCellComponent,
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
      value: 'APPROVED',
      data: {},
      context: {},
    } as ICellRendererParams;
    test('should set value from Params', () => {
      component.agInit(cellParams);
      expect(component['sqvApprovalStatus']).toBe('APPROVED');
    });

    test('should set the tagType based on the status', () => {
      component.agInit(cellParams);
      expect(component['tagType']).toBe('neutral');
    });
    test('should set default Value when params value is not present', () => {
      component.agInit({ ...cellParams, value: undefined });
      expect(component['sqvApprovalStatus']).toBe(undefined);
    });
  });
});
