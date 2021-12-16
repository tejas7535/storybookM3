import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { MockComponent } from 'ng-mocks';

import { ExternalLegendComponent } from '../../../shared/charts/external-legend/external-legend.component';
import {
  DoughnutChartData,
  LegendSelectAction,
} from '../../../shared/charts/models';
import { SolidDoughnutChartComponent } from '../../../shared/charts/solid-doughnut-chart/solid-doughnut-chart.component';
import { ReasonsForLeavingChartComponent } from './reasons-for-leaving-chart.component';

describe('ReasonsForLeavingChartComponent', () => {
  let component: ReasonsForLeavingChartComponent;
  let spectator: Spectator<ReasonsForLeavingChartComponent>;

  const createComponent = createComponentFactory({
    component: ReasonsForLeavingChartComponent,
    detectChanges: false,
    declarations: [
      MockComponent(SolidDoughnutChartComponent),
      MockComponent(ExternalLegendComponent),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('set data', () => {
    test('should set data if available', () => {
      const data1 = [] as DoughnutChartData[];
      const data2 = [] as DoughnutChartData[];

      component.data = [data1, data2];

      expect(component.defaultData).toEqual(data1);
      expect(component.comparedData).toEqual(data2);
    });

    test('should set data to undefined if not available', () => {
      const data2 = [] as DoughnutChartData[];

      component.data = [undefined, data2];

      expect(component.defaultData).toBeUndefined();
      expect(component.comparedData).toEqual(data2);
    });
  });

  describe('onSelectedLegendItem', () => {
    test('should trigger selection action', () => {
      const action: LegendSelectAction = { America: true };
      component.onSelectedLegendItem(action);

      expect(component.legendSelectAction).toEqual(action);
    });
  });
});
