import { SimpleChanges } from '@angular/core';

import { AgGridModule } from '@ag-grid-community/angular';
import { PRODUCT_COST_ANALYSIS_MOCK } from '@cdba/testing/mocks/models/product-cost-analysis.mock';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { MockModule } from 'ng-mocks';

import { PortfolioAnalysisTableComponent } from './portfolio-analysis-table.component';
import { PortfolioAnalysisTableService } from './portfolio-analysis-table.service';

describe('PortfolioAnalysisTableComponent', () => {
  let spectator: Spectator<PortfolioAnalysisTableComponent>;
  let component: PortfolioAnalysisTableComponent;

  const createComponent = createComponentFactory({
    component: PortfolioAnalysisTableComponent,
    imports: [MockModule(AgGridModule)],
    providers: [
      mockProvider(PortfolioAnalysisTableService, {
        getLabelColumn: jest.fn(() => ''),
        getDataFields: jest.fn(() => [
          { fieldName: 'sqvMargin', label: '' },
          { fieldName: 'sqvCosts', label: '' },
        ]),
        formatValue: jest.fn(() => ''),
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

  it('tableService should be called onInit', () => {
    component.productCostAnalyses = [PRODUCT_COST_ANALYSIS_MOCK];

    component.ngOnInit();

    expect(component['tableService'].getLabelColumn).toBeCalledTimes(3);
    expect(component['tableService'].getDataFields).toBeCalledTimes(1);
    expect(component['tableService'].formatValue).toBeCalledTimes(2);
  });

  it('tableService should be called onChanges with changed data', () => {
    component.productCostAnalyses = [PRODUCT_COST_ANALYSIS_MOCK];

    const changes: SimpleChanges = {
      productCostAnalyses: {
        previousValue: component.productCostAnalyses,
        currentValue: {},
      },
    } as unknown as SimpleChanges;

    component.ngOnChanges(changes);

    expect(component['tableService'].getLabelColumn).toBeCalledTimes(3);
    expect(component['tableService'].getDataFields).toBeCalledTimes(1);
    expect(component['tableService'].formatValue).toBeCalledTimes(2);
  });

  it('tableService should not be called onChanges with unchanged data', () => {
    component.productCostAnalyses = [PRODUCT_COST_ANALYSIS_MOCK];

    component.ngOnChanges(undefined);

    expect(component['tableService'].getLabelColumn).toBeCalledTimes(1);
    expect(component['tableService'].getDataFields).toBeCalledTimes(0);
    expect(component['tableService'].formatValue).toBeCalledTimes(0);
  });
});
