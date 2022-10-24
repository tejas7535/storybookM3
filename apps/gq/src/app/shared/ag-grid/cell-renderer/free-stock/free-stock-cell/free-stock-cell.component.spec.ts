import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { FreeStockTrafficLightComponent } from '../../../../components/free-stock-traffic-light/free-stock-traffic-light.component';
import {
  FreeStockCellComponent,
  FreeStockCellParams,
} from './free-stock-cell.component';

describe('FreeStockCellComponent', () => {
  let component: FreeStockCellComponent;
  let spectator: Spectator<FreeStockCellComponent>;

  const createComponent = createComponentFactory({
    component: FreeStockCellComponent,
    declarations: [FreeStockCellComponent],
    imports: [FreeStockTrafficLightComponent],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('agInit', () => {
    const cellClassParams = {
      value: 20,
      uom: 'ST',
    } as FreeStockCellParams;

    test('should set uom', () => {
      component.agInit(cellClassParams);

      expect(component.params.uom).toEqual('ST');
    });
  });
});
