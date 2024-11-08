import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ITooltipParams } from 'ag-grid-community';

import { TrafficLightTooltipComponent } from './traffic-light-tooltip.component';

describe('TrafficLightTooltipComponent', () => {
  let spectator: Spectator<TrafficLightTooltipComponent>;
  const createComponent = createComponentFactory({
    component: TrafficLightTooltipComponent,
    imports: [],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {},
      detectChanges: false,
    });

    spectator.component.agInit({
      value: {},
    } as ITooltipParams);
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
