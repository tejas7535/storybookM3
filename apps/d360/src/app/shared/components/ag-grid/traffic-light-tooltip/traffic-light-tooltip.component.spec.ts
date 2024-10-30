import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ITooltipParams } from 'ag-grid-community';
import { MockComponent } from 'ng-mocks';

import { GridTooltipComponent } from '../grid-tooltip/grid-tooltip.component';
import { TrafficLightTooltipComponent } from './traffic-light-tooltip.component';

describe('TrafficLightTooltipComponent', () => {
  let spectator: Spectator<TrafficLightTooltipComponent>;
  const createComponent = createComponentFactory({
    component: TrafficLightTooltipComponent,
    imports: [MockComponent(GridTooltipComponent)],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        tooltipParams: {} as ITooltipParams,
      },
    });
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
