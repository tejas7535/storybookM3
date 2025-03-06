import { SimpleChanges } from '@angular/core';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { NgxEchartsModule } from 'ngx-echarts';
import resize_observer_polyfill from 'resize-observer-polyfill';

import { PRODUCT_COST_ANALYSIS_MOCK } from '@cdba/testing/mocks/models/product-cost-analysis.mock';

import { PortfolioAnalysisChartComponent } from './portfolio-analysis-chart.component';
import { PortfolioAnalysisChartService } from './portfolio-analysis-chart.service';
window.ResizeObserver = resize_observer_polyfill;

describe('PortfolioAnalysisChartComponent', () => {
  let spectator: Spectator<PortfolioAnalysisChartComponent>;
  let component: PortfolioAnalysisChartComponent;

  const createComponent = createComponentFactory({
    component: PortfolioAnalysisChartComponent,
    imports: [
      NgxEchartsModule.forRoot({
        echarts: async () => import('echarts'),
      }),
    ],
    providers: [
      mockProvider(PortfolioAnalysisChartService, {
        getEChartsOption: jest.fn(() => ''),
      }),
    ],
  });

  beforeEach(() => {
    jest.clearAllMocks();
    spectator = createComponent();
    component = spectator.component;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should call getEChartsOption onInit', () => {
    component.productCostAnalyses = [PRODUCT_COST_ANALYSIS_MOCK];

    component.ngOnInit();

    expect(component['chartService'].getEChartsOption).toHaveBeenCalledTimes(1);
  });

  it('should call getEChartsOption onChanges with changed data', () => {
    component.productCostAnalyses = [PRODUCT_COST_ANALYSIS_MOCK];

    const changes: SimpleChanges = {
      productCostAnalyses: {
        previousValue: component.productCostAnalyses,
        currentValue: {},
      },
    } as unknown as SimpleChanges;

    component.ngOnChanges(changes);

    expect(component['chartService'].getEChartsOption).toHaveBeenCalledTimes(1);
  });

  it('should not call getEChartsOption onChanges with unchanged data', () => {
    component.productCostAnalyses = [PRODUCT_COST_ANALYSIS_MOCK];

    component.ngOnChanges(undefined);

    expect(component['chartService'].getEChartsOption).toHaveBeenCalledTimes(0);
  });
});
