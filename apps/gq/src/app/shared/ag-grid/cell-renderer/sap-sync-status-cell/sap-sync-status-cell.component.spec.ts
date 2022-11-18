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
      value: '0',
      data: {},
      context: {},
    } as ICellRendererParams;

    test('should set NOT_SYNCED Status', () => {
      component.agInit(cellParams);

      expect(component.syncedStatus).toEqual(SAP_SYNC_STATUS.NOT_SYNCED);
    });

    test('should set SYNCED Status', () => {
      component.agInit({ ...cellParams, value: '1' });

      expect(component.syncedStatus).toEqual(SAP_SYNC_STATUS.SYNCED);
    });

    test('should set PARTIALLY_SYNCED Status', () => {
      component.agInit({ ...cellParams, value: '2' });

      expect(component.syncedStatus).toEqual(SAP_SYNC_STATUS.PARTIALLY_SYNCED);
    });

    test('should set SYNC_FAILED Status', () => {
      component.agInit({ ...cellParams, value: '3' });

      expect(component.syncedStatus).toEqual(SAP_SYNC_STATUS.SYNC_FAILED);
    });
  });
});
