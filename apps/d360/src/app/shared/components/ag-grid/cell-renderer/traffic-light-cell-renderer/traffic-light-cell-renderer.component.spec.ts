import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ICellRendererParams } from 'ag-grid-enterprise';

import { TrafficLightCellRendererComponent } from './traffic-light-cell-renderer.component';

describe('TrafficLightCellRendererComponent', () => {
  let spectator: Spectator<TrafficLightCellRendererComponent>;

  const createComponent = createComponentFactory({
    component: TrafficLightCellRendererComponent,
    imports: [],
  });

  beforeEach(() => {
    spectator = createComponent({ detectChanges: false });
    spectator.component.agInit({} as ICellRendererParams);
    spectator.detectChanges();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
