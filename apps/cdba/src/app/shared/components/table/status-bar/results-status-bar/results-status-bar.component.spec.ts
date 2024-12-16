import { MatTooltipModule } from '@angular/material/tooltip';
import { provideRouter, Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';
import { GridApi, IStatusPanelParams, RowNode } from 'ag-grid-enterprise';
import { MockComponent, MockModule, MockPipe, MockProvider } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { requestBomExport } from '@cdba/core/store';
import { CompareButtonModule } from '@cdba/shared/components/table/button/compare-button';
import { PortfolioAnalysisButtonModule } from '@cdba/shared/components/table/button/portfolio-analysis-button';
import { ReferenceTypeIdentifier } from '@cdba/shared/models';
import { BetaFeatureService } from '@cdba/shared/services/beta-feature/beta-feature.service';
import { DETAIL_STATE_MOCK } from '@cdba/testing/mocks';

import { BomExportButtonComponent } from '../../button/bom-export-button';
import { PaginationControlsModule } from '../../pagination-controls/pagination-controls.module';
import { PaginationControlsService } from '../../pagination-controls/service/pagination-controls.service';
import { ResultsStatusBarComponent } from './results-status-bar.component';

describe('ResultsStatusBarComponent', () => {
  let spectator: Spectator<ResultsStatusBarComponent>;
  let component: ResultsStatusBarComponent;
  let params: IStatusPanelParams;
  let router: Router;

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
      provideRouter([]),
      provideMockStore({
        initialState: {
          search: {
            referenceTypes: {
              selectedNodeIds: ['2', '4'],
            },
          },
          detail: DETAIL_STATE_MOCK,
        },
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    router = spectator.inject(Router);

    router.navigate = jest.fn();

    params = {
      api: {
        getRowNode: jest.fn(),
      },
    } as unknown as IStatusPanelParams;

    component['selectedNodeIdsSubscription'] = {
      unsubscribe: jest.fn(),
    } as unknown as Subscription;

    component.gridApi = {
      hideOverlay: jest.fn(),
      showLoadingOverlay: jest.fn(),
    } as unknown as GridApi;
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
    it('should setup component', () => {
      component.ngOnInit();

      expect(component.selectedNodeIds).toEqual(['2', '4']);
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe from subscriptions', () => {
      component.ngOnDestroy();

      expect(
        component['selectedNodeIdsSubscription'].unsubscribe
      ).toHaveBeenCalled();
    });
  });

  describe('showCompareView', () => {
    let mockSelections: RowNode[];

    beforeEach(() => {
      mockSelections = undefined;
      jest.spyOn(component['router'], 'navigate');

      mockSelections = [
        {
          id: '0',
          data: { materialNumber: '1234', plant: '0060' },
        } as unknown as RowNode,
        {
          id: '1',
          data: { materialNumber: '5678', plant: '0076' },
        } as unknown as RowNode,
      ];
      component.selectedNodeIds = ['0', '1'];

      component['gridApi'] = {
        getRowNode: jest.fn((id) =>
          mockSelections.find((selection) => selection.id === id)
        ),
      } as unknown as GridApi;
    });

    it('should add node id and should route to compare screen if coming from detail page', () => {
      router.routerState.snapshot.url = '/detail/detail';

      component.showCompareView();

      expect(router.navigate).toHaveBeenCalledWith(['compare'], {
        queryParams: {
          material_number_item_1: '1234',
          plant_item_1: '0060',
          node_id_item_1: '0',
          material_number_item_2: '5678',
          plant_item_2: '0076',
          node_id_item_2: '1',
        },
      });
    });

    it('should not add node id and should route to compare screen if coming from results page', () => {
      router.routerState.snapshot.url = '/results';

      component.showCompareView();

      expect(router.navigate).toHaveBeenCalledWith(['compare'], {
        queryParams: {
          material_number_item_1: '1234',
          plant_item_1: '0060',
          material_number_item_2: '5678',
          plant_item_2: '0076',
        },
      });
    });
  });

  describe('requestBomExport', () => {
    let mockSelections: RowNode[];

    beforeEach(() => {
      mockSelections = [
        {
          id: '0',
          data: { materialNumber: '123-456', plant: '1234' },
        } as unknown as RowNode,
        {
          id: '1',
          data: { materialNumber: '456-789', plant: '4567' },
        } as unknown as RowNode,
      ];
      component.selectedNodeIds = ['0', '1'];

      component['gridApi'] = {
        getRowNode: jest.fn((id) =>
          mockSelections.find((selection) => selection.id === id)
        ),
      } as unknown as GridApi;
    });

    it('should dispatch exportBoms with identifiers', () => {
      const storeSpy = jest.spyOn(component['store'], 'dispatch');

      component.requestBomExport();

      expect(storeSpy).toHaveBeenCalledWith(
        requestBomExport({
          ids: [
            new ReferenceTypeIdentifier('123456', '1234'),
            new ReferenceTypeIdentifier('456789', '4567'),
          ],
        })
      );
    });

    it('should not dispatch exportBoms when there are no identifiers', () => {
      component.gridApi = {
        getRowNode: jest.fn(() => {}),
      } as unknown as GridApi;
      const storeSpy = jest.spyOn(component['store'], 'dispatch');

      component.requestBomExport();

      expect(storeSpy).not.toHaveBeenCalled();
    });
  });
});
