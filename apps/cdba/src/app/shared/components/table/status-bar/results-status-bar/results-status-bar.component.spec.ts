import { MatTooltipModule } from '@angular/material/tooltip';

import { Subscription } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';
import {
  GridApi,
  IRowNode,
  IStatusPanelParams,
  RowNode,
} from 'ag-grid-enterprise';
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

  const createComponent = createComponentFactory({
    component: ResultsStatusBarComponent,
    detectChanges: false,
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

    params = {
      api: {},
    } as unknown as IStatusPanelParams;

    component['selectedNodesSubscription'] = {
      unsubscribe: jest.fn(),
    } as unknown as Subscription;

    component.gridApi = {
      getRowNode: jest.fn(),
    } as unknown as GridApi;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('agInit', () => {
    it('should set grid api', () => {
      component.agInit(params);

      expect(component.gridApi).toEqual(params.api);
    });
  });

  describe('ngOnInit', () => {
    it('should setup component', () => {
      component.gridApi.getRowNode = jest
        .fn()
        .mockImplementationOnce(() => ({ id: '2' }))
        .mockImplementationOnce(() => ({ id: '4' }));

      component.ngOnInit();

      expect(component.selectedNodes).toEqual([
        { id: '2' } as IRowNode,
        { id: '4' } as IRowNode,
      ]);
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe from subscriptions', () => {
      component.ngOnDestroy();

      expect(
        component['selectedNodesSubscription'].unsubscribe
      ).toHaveBeenCalled();
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
      component.selectedNodes = [
        { id: '0' } as IRowNode,
        { id: '1' } as IRowNode,
      ];

      component.gridApi = {
        getRowNode: jest.fn((id) =>
          mockSelections.find((selection) => selection.id === id)
        ),
      } as unknown as GridApi;
    });

    it('should dispatch exportBoms with identifiers', () => {
      const storeSpy = jest.spyOn(component['store'], 'dispatch');
      component.selectedNodes = [
        { data: { materialNumber: '123456', plant: '1234' } },
        { data: { materialNumber: '456789', plant: '4567' } },
      ] as IRowNode[];

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
      const storeSpy = jest.spyOn(component['store'], 'dispatch');
      component.selectedNodes = [] as IRowNode[];

      component.requestBomExport();

      expect(storeSpy).not.toHaveBeenCalled();
    });
  });
});
