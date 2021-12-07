import { MatButtonModule } from '@angular/material/button';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import {
  GridApi,
  IStatusPanelParams,
  RowNode,
} from '@ag-grid-enterprise/all-modules';
import { DETAIL_STATE_MOCK } from '@cdba/testing/mocks';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

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
      ReactiveComponentModule,
      MatButtonModule,
      RouterTestingModule,
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
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;

    router = spectator.inject(Router);

    router.navigate = jest.fn();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it(
      'should init with search selector',
      marbles((m) => {
        router.routerState.snapshot.url = '/results';

        component.ngOnInit();

        m.expect(component.selectedNodeIds$).toBeObservable(
          m.cold('a', {
            a: ['2', '4'],
          })
        );
      })
    );

    it(
      'should init with detail selector',
      marbles((m) => {
        router.routerState.snapshot.url = '/detail/detail';

        component.ngOnInit();

        m.expect(component.selectedNodeIds$).toBeObservable(
          m.cold('a', {
            a: DETAIL_STATE_MOCK.calculations.selectedNodeIds,
          })
        );
      })
    );
  });

  describe('agInit', () => {
    test('should set grid api', () => {
      component.agInit(params as unknown as IStatusPanelParams);

      expect(component['gridApi']).toEqual(params.api);
    });
  });

  describe('showCompareView', () => {
    let mockSelections: RowNode[];

    beforeEach(() => {
      mockSelections = undefined;
      jest.spyOn(router, 'navigate');
      component['gridApi'] = {
        getRowNode: jest.fn((id) =>
          mockSelections.find((selection) => selection.id === id)
        ),
      } as unknown as GridApi;
    });
    test('should add node id and should route to compare screen', () => {
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

      component.showCompareView(['0', '1']);

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

    test('should add id hash and should route to compare screen', () => {
      mockSelections = [
        {
          id: '0',
          data: {
            materialNumber: '1234',
            plant: '0060',
            identificationHash: 'foo',
          },
        } as unknown as RowNode,
        {
          id: '1',
          data: {
            materialNumber: '5678',
            plant: '0076',
            identificationHash: 'bar',
          },
        } as unknown as RowNode,
      ];

      component.showCompareView(['0', '1']);

      expect(router.navigate).toHaveBeenCalledWith(['compare'], {
        queryParams: {
          material_number_item_1: '1234',
          plant_item_1: '0060',
          identification_hash_item_1: 'foo',
          material_number_item_2: '5678',
          plant_item_2: '0076',
          identification_hash_item_2: 'bar',
        },
      });
    });
  });
});
