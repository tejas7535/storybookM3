import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ICellRendererParams } from 'ag-grid-community';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { SAP_SYNC_STATUS } from '../../../models/quotation-detail/sap-sync-status.enum';
import { SapStatusCellComponent } from './sap-sync-status-cell.component';

describe('SapStatusCellComponent', () => {
  let component: SapStatusCellComponent;
  let spectator: Spectator<SapStatusCellComponent>;

  const createComponent = createComponentFactory({
    component: SapStatusCellComponent,
    imports: [provideTranslocoTestingModule({ en: {} }), MatTooltipModule],
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
      value: 'SYNCED',
      data: {},
      context: {},
    } as ICellRendererParams;

    test('should set value from Params', () => {
      component.agInit(cellParams);
      expect(component.syncedStatus).toBe(SAP_SYNC_STATUS.SYNCED);
    });
    test('should set the tagType based on the status', () => {
      component.agInit(cellParams);
      expect(component['tagType']).toBe('info');
    });

    test('should set default Value when params value is not present', () => {
      component.agInit({ ...cellParams, value: undefined });
      expect(component.syncedStatus).toBe(SAP_SYNC_STATUS.NOT_SYNCED);
    });

    test('should set error code when data is present', () => {
      component.agInit({ ...cellParams, data: { sapSyncErrorCode: '123' } });
      expect(component.errorCode).toBe('123');
    });

    test('should set error code as undefined when data is not present', () => {
      component.agInit({ ...cellParams, data: {}, value: 'SYNC_FAILED' });
      expect(component.errorCode).toBe(undefined);
    });
  });
});
