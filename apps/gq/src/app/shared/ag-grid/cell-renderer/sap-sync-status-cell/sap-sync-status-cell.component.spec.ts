import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

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
      value: true,
      syncedText: 'synced',
      notSyncedText: 'notSynced',
    } as SapStatusCellComponentParams;

    test('should set syncedInSap Status', () => {
      component.agInit(cellParams);

      expect(component.syncedInSap).toBe(true);
    });
  });
});
