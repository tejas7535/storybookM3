import { Router } from '@angular/router';

import { ICellRendererParams } from 'ag-grid-enterprise';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { BomMaterialDesignationCellRenderComponent } from './bom-material-designation-cell-render.component';

describe('BomMaterialDesignationCellRenderComponent', () => {
  let spectator: Spectator<BomMaterialDesignationCellRenderComponent>;
  let component: BomMaterialDesignationCellRenderComponent;
  let router: Router;

  const params = {
    data: {
      materialNumber: '12345',
      plant: '0060',
    },
    value: 'F-12345',
    api: {
      getRowNode: jest.fn(() => ({
        data: {
          materialNumber: '12345',
          plant: '0060',
        },
        setSelected: jest.fn(),
      })),
    },
    node: { id: 2 },
  } as unknown as ICellRendererParams;

  const createComponent = createComponentFactory({
    component: BomMaterialDesignationCellRenderComponent,
    imports: [provideTranslocoTestingModule({ en: {} })],
    providers: [
      {
        provide: Router,
        useValue: {
          navigate: jest.fn(),
        },
      },
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

  describe('agInit', () => {
    it('should set attributes', () => {
      component.agInit(params);

      expect(component.materialDesignation).toEqual('F-12345');
      expect(component.isRouterLink).toBeTruthy();
      expect(component['materialNumber']).toEqual('12345');
      expect(component['plant']).toEqual('0060');
    });
  });

  describe('navigateToDetailPage', () => {
    test('should navigate to correct detail page', () => {
      component.agInit(params);

      component.navigateToDetailPage();

      const expectedQueryParams = {
        material_number: '12345',
        plant: '0060',
      };

      expect(router.navigate).toHaveBeenCalledWith(['detail/detail'], {
        queryParams: expectedQueryParams,
      });
    });
  });
});
