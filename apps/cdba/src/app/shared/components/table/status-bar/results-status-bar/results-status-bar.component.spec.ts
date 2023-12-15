import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { IStatusPanelParams } from 'ag-grid-enterprise';
import { MockModule, MockProvider } from 'ng-mocks';

import { CompareButtonModule } from '@cdba/shared/components/table/button/compare-button';
import { PortfolioAnalysisButtonModule } from '@cdba/shared/components/table/button/portfolio-analysis-button';
import { BetaFeatureService } from '@cdba/shared/services/beta-feature/beta-feature.service';

import { PaginationControlsModule } from '../../pagination-controls/pagination-controls.module';
import { PaginationControlsService } from '../../pagination-controls/service/pagination-controls.service';
import { ResultsStatusBarComponent } from './results-status-bar.component';

describe('ResultsStatusBarComponent', () => {
  let spectator: Spectator<ResultsStatusBarComponent>;
  let component: ResultsStatusBarComponent;
  let params: IStatusPanelParams;

  const createComponent = createComponentFactory({
    component: ResultsStatusBarComponent,
    imports: [
      MockModule(CompareButtonModule),
      MockModule(PortfolioAnalysisButtonModule),
      MockModule(PaginationControlsModule),
    ],
    providers: [
      MockProvider(PaginationControlsService),
      MockProvider(BetaFeatureService),
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
