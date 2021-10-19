import { MatButtonModule } from '@angular/material/button';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { Router } from '@angular/router';

import { IStatusPanelParams } from '@ag-grid-enterprise/all-modules';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { SharedModule } from '@cdba/shared';

import { DetailViewButtonComponent } from './detail-view-button.component';

describe('DetailViewButtonComponent', () => {
  let spectator: Spectator<DetailViewButtonComponent>;
  let component: DetailViewButtonComponent;
  let router: Router;

  const params = {
    api: {
      getRowNode: jest.fn(() => ({
        data: {
          materialNumber: '12345',
          plant: '0060',
          identificationHash: 'foo',
        },
      })),
    },
  } as unknown as IStatusPanelParams;

  const createComponent = createComponentFactory({
    component: DetailViewButtonComponent,
    imports: [
      SharedModule,
      MatButtonModule,
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
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('agInit', () => {
    test('should set grid api', () => {
      component.agInit(params as unknown as IStatusPanelParams);

      expect(component['gridApi']).toEqual(params.api);
    });
  });

  describe('showDetailView', () => {
    test('should navigate to correct detail page', () => {
      router.navigate = jest.fn();
      component['gridApi'] = params.api;
      component.showDetailView('2');

      const expectedQueryParams = {
        material_number: '12345',
        plant: '0060',
        identification_hash: 'foo',
      };

      expect(router.navigate).toHaveBeenCalledWith(['detail/detail'], {
        queryParams: expectedQueryParams,
      });
    });
  });
});
