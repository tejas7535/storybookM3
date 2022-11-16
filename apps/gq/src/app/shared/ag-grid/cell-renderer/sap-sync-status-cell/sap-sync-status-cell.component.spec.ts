import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { SAP_SYNC_STATUS } from '../../../models/quotation-detail/sap-sync-status.enum';
import {
  SapStatusCellComponent,
  SapStatusCellComponentParams,
} from './sap-sync-status-cell.component';

describe('SapStatusCellComponent', () => {
  let component: SapStatusCellComponent;
  let spectator: Spectator<SapStatusCellComponent>;

  const createComponent = createComponentFactory({
    component: SapStatusCellComponent,
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
      valueFormatted: '0',
      syncedText: 'synced',
      notSyncedText: 'notSynced',
      partiallySyncedText: 'partiallySynced',
    } as SapStatusCellComponentParams;

    test('should set NOT_SYNCED Status', () => {
      component.agInit(cellParams);

      expect(component.syncedStatus).toEqual(SAP_SYNC_STATUS.NOT_SYNCED);
    });

    test('should set SYNCED Status', () => {
      component.agInit({ ...cellParams, valueFormatted: '1' });

      expect(component.syncedStatus).toEqual(SAP_SYNC_STATUS.SYNCED);
    });

    test('should set PARTIALLY_SYNCED Status', () => {
      component.agInit({ ...cellParams, valueFormatted: '2' });

      expect(component.syncedStatus).toEqual(SAP_SYNC_STATUS.PARTIALLY_SYNCED);
    });
  });
});
