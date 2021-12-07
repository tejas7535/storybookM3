import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatIconTestingModule } from '@angular/material/icon/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { EChartsOption } from 'echarts';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { EmptyGraphComponent } from './empty-graph.component';

describe('StatusIndicatorComponent', () => {
  let component: EmptyGraphComponent;
  let spectator: Spectator<EmptyGraphComponent>;

  const createComponent = createComponentFactory({
    component: EmptyGraphComponent,
    imports: [
      MatIconModule,
      MatIconTestingModule,
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
      },
    ],
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
    it('should return true if none of the grease status graph datas contain data but legends exist', () => {
      const mockgraphData: EChartsOption = {
        legend: {
          data: ['deteriorationPercent', 'temperatureOptics'],
        },
        series: [
          {
            name: 'deteriorationPercent',
            type: 'line',
            data: [],
          },
          {
            name: 'temperatureOptics',
            type: 'line',
            data: [],
          },
        ],
      };

      component.graphData = mockgraphData;
      expect(component.emptyGraphData()).toBe(true);
    });

    it('should return false if none of the grease status graph datas contain but also no legend is active', () => {
      const mockgraphData: EChartsOption = {
        legend: {
          data: [],
        },
        series: [
          {
            name: 'deteriorationPercent',
            type: 'line',
            data: [],
          },
          {
            name: 'temperatureOptics',
            type: 'line',
            data: [],
          },
        ],
      };

      component.graphData = mockgraphData;
      expect(component.emptyGraphData()).toBe(false);
    });
  });
});
