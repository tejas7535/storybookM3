import { MatTooltipModule } from '@angular/material/tooltip';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';
import { IStatusPanelParams } from 'ag-grid-enterprise';
import { MockComponent, MockModule, MockPipe, MockProvider } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { CompareButtonModule } from '@cdba/shared/components/table/button/compare-button';
import { PortfolioAnalysisButtonModule } from '@cdba/shared/components/table/button/portfolio-analysis-button';
import { BetaFeatureService } from '@cdba/shared/services/beta-feature/beta-feature.service';

import { BomExportButtonComponent } from '../../button/bom-export-button';
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
      MockComponent(BomExportButtonComponent),
      MockModule(PaginationControlsModule),
      MockModule(MatTooltipModule),
      MockPipe(PushPipe),
      provideTranslocoTestingModule({
        en: {},
      }),
    ],
    providers: [
      MockProvider(PaginationControlsService),
      MockProvider(BetaFeatureService),
      provideMockStore(),
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
    it('should set grid api', () => {
      component.agInit(params);

      expect(component['gridApi']).toEqual(params.api);
    });
  });

  describe('ngOnInit', () => {
    it('should load bom export loading tooltip', () => {
      component.ngOnInit();

      expect(component.bomExportLoadingTooltip).toBe(
        'search.bomExport.tooltips.loading'
      );
    });
  });
});
