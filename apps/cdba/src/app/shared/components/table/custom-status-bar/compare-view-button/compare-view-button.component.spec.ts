import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { IStatusPanelParams, RowNode } from '@ag-grid-enterprise/all-modules';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { CompareViewButtonComponent } from './compare-view-button.component';

describe('CompareViewButtonComponent', () => {
  let spectator: Spectator<CompareViewButtonComponent>;
  let component: CompareViewButtonComponent;
  let router: Router;
  let params: IStatusPanelParams;

  const createComponent = createComponentFactory({
    component: CompareViewButtonComponent,
    imports: [
      MatButtonModule,
      RouterTestingModule.withRoutes([]),
      provideTranslocoTestingModule({}),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;

    router = spectator.inject(Router);

    params = ({
      api: {
        addEventListener: jest.fn(),
        getSelectedNodes: jest.fn(),
      },
    } as unknown) as IStatusPanelParams;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('agInit', () => {
    test('should set params and add listeners', () => {
      component.agInit((params as unknown) as IStatusPanelParams);

      expect(component['params']).toEqual(params);

      expect(params.api.addEventListener).toHaveBeenCalledTimes(2);
    });
  });

  describe('onGridReady', () => {
    test('should set selections', () => {
      component['params'] = params;
      component.onGridReady();

      expect(params.api.getSelectedNodes).toHaveBeenCalled();
    });
  });

  describe('onSelectionChange', () => {
    test('should set selections', () => {
      component['params'] = params;
      component.onSelectionChange();

      expect(params.api.getSelectedNodes).toHaveBeenCalled();
    });
  });

  describe('showCompareView', () => {
    test('should navigate with correct query params', () => {
      const mockSelections: RowNode[] = [
        ({
          id: '0',
          data: { materialNumber: '1234', plant: '0060' },
        } as unknown) as RowNode,
        ({
          id: '1',
          data: { materialNumber: '5678', plant: '0076' },
        } as unknown) as RowNode,
      ];
      component.selections = mockSelections;
      spyOn(router, 'navigate');
      component.showCompareView();
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
        ({
          id: '1',
          data: {
            materialNumber: '5678',
            plant: '0076',
            identificationHash: 'servus',
          },
        } as unknown) as RowNode,
      ];
      component.selections = mockSelections;
      spyOn(router, 'navigate');
      component.showCompareView();
      expect(router.navigate).toHaveBeenCalledWith(['compare/bom'], {
        queryParams: {
          material_number_item_1: '5678',
          plant_item_1: '0076',
        },
      });
    });
  });
});
