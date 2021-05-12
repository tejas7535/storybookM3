import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import {
  GridApi,
  IStatusPanelParams,
  RowNode,
} from '@ag-grid-enterprise/all-modules';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { provideMockStore } from '@ngrx/store/testing';
import { cold } from 'jest-marbles';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { SharedModule } from '@cdba/shared';
import { DETAIL_STATE_MOCK } from '@cdba/testing/mocks';

import { CompareViewButtonComponent } from './compare-view-button.component';

describe('CompareViewButtonComponent', () => {
  let spectator: Spectator<CompareViewButtonComponent>;
  let component: CompareViewButtonComponent;
  let router: Router;

  const params: IStatusPanelParams = {
    api: {
      getSelectedNodes: jest.fn(),
    },
  } as unknown as IStatusPanelParams;

  const createComponent = createComponentFactory({
    component: CompareViewButtonComponent,
    imports: [
      SharedModule,
      MatButtonModule,
      RouterTestingModule.withRoutes([]),
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
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
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should init with search selector', () => {
      router.routerState.snapshot.url = '/search';

      component.ngOnInit();

      expect(component.selectedNodeIds$).toBeObservable(
        cold('a', {
          a: ['2', '4'],
        })
      );
    });

    it('should init with detail selector', () => {
      router.routerState.snapshot.url = '/detail/detail';

      component.ngOnInit();

      expect(component.selectedNodeIds$).toBeObservable(
        cold('a', {
          a: DETAIL_STATE_MOCK.calculations.selectedNodeIds,
        })
      );
    });
  });

  describe('agInit', () => {
    test('should set grid api', () => {
      component.agInit(params as unknown as IStatusPanelParams);

      expect(component['gridApi']).toEqual(params.api);
    });
  });

  describe('showCompareView', () => {
    test('should navigate with correct query params', () => {
      const mockSelections: RowNode[] = [
        {
          id: '0',
          data: { materialNumber: '1234', plant: '0060' },
        } as unknown as RowNode,
        {
          id: '1',
          data: { materialNumber: '5678', plant: '0076' },
        } as unknown as RowNode,
      ];

      spyOn(router, 'navigate');
      component['gridApi'] = {
        getRowNode: jest.fn((id) =>
          mockSelections.find((selection) => selection.id === id)
        ),
      } as unknown as GridApi;

      component.showCompareView(['0', '1']);

      expect(router.navigate).toHaveBeenCalledWith(['compare/bom'], {
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

    test('should not add identification hash and node id to query params', () => {
      const mockSelections: RowNode[] = [
        {
          id: '1',
          data: {
            materialNumber: '5678',
            plant: '0076',
            identificationHash: 'servus',
          },
        } as unknown as RowNode,
      ];
      component['gridApi'] = {
        getRowNode: jest.fn((id) =>
          mockSelections.find((selection) => selection.id === id)
        ),
      } as unknown as GridApi;
      spyOn(router, 'navigate');
      component.showCompareView(['1']);
      expect(router.navigate).toHaveBeenCalledWith(['compare/bom'], {
        queryParams: {
          material_number_item_1: '5678',
          plant_item_1: '0076',
        },
      });
    });
  });
});
