import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

import { ICellRendererParams } from '@ag-grid-enterprise/all-modules';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';
import { MockModule } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { MaterialDesignationCellRenderComponent } from './material-designation-cell-render.component';

describe('MaterialDesignationCellRenderComponent', () => {
  let spectator: Spectator<MaterialDesignationCellRenderComponent>;
  let component: MaterialDesignationCellRenderComponent;
  let router: Router;

  const params = {
    data: {
      materialNumber: '12345',
      plant: '0060',
    },
    value: '12345',
    api: {
      deselectAll: jest.fn(),
      getRowNode: jest.fn(() => ({
        data: {
          materialNumber: '12345',
          plant: '0060',
        },
      })),
    },
    node: { id: 2 },
  } as unknown as ICellRendererParams;

  const createComponent = createComponentFactory({
    component: MaterialDesignationCellRenderComponent,
    imports: [
      PushModule,
      MockModule(MatButtonModule),
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
        },
      }),
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
    jest.useFakeTimers('legacy');
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('showDetailView', () => {
    test('should navigate to correct detail page', () => {
      jest.spyOn(window, 'setTimeout');
      router.navigate = jest.fn();
      component['gridApi'] = params.api;
      component.agInit(params);

      component.onMaterialDesignationClick();

      const expectedQueryParams = {
        material_number: '12345',
        plant: '0060',
      };

      expect(setTimeout).toHaveBeenCalledTimes(1);
      jest.advanceTimersByTime(10);
      expect(router.navigate).toHaveBeenCalledWith(['detail/detail'], {
        queryParams: expectedQueryParams,
      });
    });
  });
});
