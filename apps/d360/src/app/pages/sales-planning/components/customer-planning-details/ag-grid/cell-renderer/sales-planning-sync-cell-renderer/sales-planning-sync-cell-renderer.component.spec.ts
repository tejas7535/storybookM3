import { ICellRendererParams } from 'ag-grid-enterprise';

import { Stub } from '../../../../../../../shared/test/stub.class';
import { SalesPlanningSyncCellRendererComponent } from './sales-planning-sync-cell-renderer.component';

describe('SalesPlanningSyncCellRendererComponent', () => {
  let component: SalesPlanningSyncCellRendererComponent;
  const mockParams: ICellRendererParams = {
    value: 72_997,
    valueFormatted: '72.997 EUR',
    data: {
      infoIcon: 'S',
    },
  } as any;

  beforeEach(() => {
    component = Stub.get({ component: SalesPlanningSyncCellRendererComponent });
    component.agInit(mockParams);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the correct icon', () => {
    component['setValue'](mockParams);
    expect(component['infoIcon']).toBe('S');
  });

  it('should show the formatted value', () => {
    expect(component['valueFormatted']()).toBe('72.997 EUR');
  });
});
