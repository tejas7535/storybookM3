import { MatIconModule } from '@angular/material/icon';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { GraphData } from '../../core/store/reducers/shared/models';
import { EmptyGraphComponent } from './empty-graph.component';

describe('StatusIndicatorComponent', () => {
  let component: EmptyGraphComponent;
  let spectator: Spectator<EmptyGraphComponent>;

  const createComponent = createComponentFactory({
    component: EmptyGraphComponent,
    imports: [MatIconModule, provideTranslocoTestingModule({})],
    declarations: [EmptyGraphComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('emptyGreaseStatusGraphData', () => {
    it('should return true if none of the grease status graph datas contain data', () => {
      const mockgraphData: GraphData = {
        legend: {
          data: ['deteriorationPercent', 'temperatureCelsius'],
        },
        series: [
          {
            name: 'deteriorationPercent',
            type: 'line',
            data: [],
          },
          {
            name: 'temperatureCelsius',
            type: 'line',
            data: [],
          },
        ],
      };

      component.graphData = mockgraphData;
      expect(component.emptyGraphData()).toBe(true);
    });
  });
});
