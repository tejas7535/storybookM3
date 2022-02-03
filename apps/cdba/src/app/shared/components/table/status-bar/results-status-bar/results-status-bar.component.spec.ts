import { IStatusPanelParams } from '@ag-grid-enterprise/all-modules';
import { CompareButtonModule } from '@cdba/shared/components/table/button/compare-button';
import { DetailViewButtonModule } from '@cdba/shared/components/table/button/detail-view-button';
import { PortfolioAnalysisButtonModule } from '@cdba/shared/components/table/button/portfolio-analysis-button';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockModule } from 'ng-mocks';

import { ResultsStatusBarComponent } from './results-status-bar.component';

describe('ResultsStatusBarComponent', () => {
  let spectator: Spectator<ResultsStatusBarComponent>;
  let component: ResultsStatusBarComponent;
  let params: IStatusPanelParams;

  const createComponent = createComponentFactory({
    component: ResultsStatusBarComponent,
    imports: [
      MockModule(CompareButtonModule),
      MockModule(DetailViewButtonModule),
      MockModule(PortfolioAnalysisButtonModule),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;

    params = {
      api: {
        getRowNode: jest.fn(),
      },
    } as unknown as IStatusPanelParams;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('agInit', () => {
    test('should set grid api', () => {
      component.agInit(params);

      expect(component['gridApi']).toEqual(params.api);
    });
  });
});
