import { PRODUCT_COST_ANALYSIS_MOCK } from '@cdba/testing/mocks/models/product-cost-analysis.mock';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { NgxEchartsModule } from 'ngx-echarts';

import { PortfolioAnalysisChartService } from './portfolio-analysis-chart.service';

import { PortfolioAnalysisChartComponent } from './portfolio-analysis-chart.component';

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
    spectator = createComponent();
    component = spectator.component;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should call getEChartsOption onInit', () => {
    component.productCostAnalyses = [PRODUCT_COST_ANALYSIS_MOCK];

    component.ngOnInit();

    expect(component['chartService'].getEChartsOption).toBeCalledTimes(1);
  });
});
