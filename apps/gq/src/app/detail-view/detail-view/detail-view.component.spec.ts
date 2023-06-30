import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { SAP_SYNC_STATUS } from '@gq/shared/models/quotation-detail';
import { AgGridStateService } from '@gq/shared/services/ag-grid-state/ag-grid-state.service';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { LetModule, PushModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';
import { MockModule } from 'ng-mocks';
import { marbles } from 'rxjs-marbles/jest';

import { BreadcrumbsModule } from '@schaeffler/breadcrumbs';

import {
  MATERIAL_STOCK_STATE_MOCK,
  PLANT_MATERIAL_DETAILS_STATE_MOCK,
  QUOTATION_DETAIL_MOCK,
  QUOTATION_MOCK,
} from '../../../testing/mocks';
import { MATERIAL_STOCK_MOCK } from '../../../testing/mocks/models/material-stock.mock';
import { ACTIVE_CASE_STATE_MOCK } from '../../../testing/mocks/state/active-case-state.mock';
import { DetailViewComponent } from './detail-view.component';

describe('DetailViewComponent', () => {
  let component: DetailViewComponent;
  let spectator: Spectator<DetailViewComponent>;
  let router: Router;

  const createComponent = createComponentFactory({
    component: DetailViewComponent,
    imports: [
      MockModule(LetModule),
      MockModule(PushModule),
      BreadcrumbsModule,
      RouterTestingModule,
    ],
    providers: [
      provideMockStore({
        initialState: {
          activeCase: {
            ...ACTIVE_CASE_STATE_MOCK,
            selectedQuotationDetail: '5694232',
          },
          materialStock: MATERIAL_STOCK_STATE_MOCK,
          plantMaterialDetails: PLANT_MATERIAL_DETAILS_STATE_MOCK,
        },
      }),
      mockProvider(AgGridStateService),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    router = spectator.inject(Router);
    router.navigate = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    test(
      'should initialize observables',
      marbles((m) => {
        component['breadCrumbsService'].getDetailViewBreadcrumbs = jest.fn(
          () => [{ label: 'test' }]
        );
        m.expect(component.quotation$).toBeObservable(
          m.cold('a', { a: QUOTATION_MOCK })
        );
        m.expect(component.quotationLoading$).toBeObservable(
          m.cold('a', { a: false })
        );
        m.expect(component.quotationDetail$).toBeObservable(
          m.cold('a', { a: QUOTATION_DETAIL_MOCK })
        );
        m.expect(component.materialStock$).toBeObservable(
          m.cold('a', { a: MATERIAL_STOCK_MOCK })
        );
        m.expect(component.materialStockLoading$).toBeObservable(
          m.cold('a', { a: false })
        );
        m.expect(component.breadcrumbs$).toBeObservable(
          m.cold('a', { a: [{ label: 'test' }] })
        );
        m.expect(component.plantMaterialDetails$).toBeObservable(
          m.cold('a', {
            a: PLANT_MATERIAL_DETAILS_STATE_MOCK.plantMaterialDetails,
          })
        );

        m.expect(component.sapStatusPosition$).toBeObservable(
          m.cold('a', {
            a: QUOTATION_DETAIL_MOCK.syncInSap
              ? SAP_SYNC_STATUS.SYNCED
              : SAP_SYNC_STATUS.NOT_SYNCED,
          })
        );
      })
    );
  });

  describe('navigateToQuotationByIndex', () => {
    beforeEach(() => {
      component.quotations = [
        { ...QUOTATION_DETAIL_MOCK, gqPositionId: '123' },
        { ...QUOTATION_DETAIL_MOCK, gqPositionId: '456' },
        { ...QUOTATION_DETAIL_MOCK, gqPositionId: '789' },
      ];
    });

    it('should navigate if the quotation exists', () => {
      component.onNavigateToQuotationByIndex(1);

      expect(router.navigate).toHaveBeenCalledWith(['detail-view'], {
        queryParams: { gqPositionId: '456' },
        queryParamsHandling: 'merge',
      });
    });

    it('should NOT navigate if the quotation does not exist', () => {
      component.onNavigateToQuotationByIndex(4);

      expect(router.navigate).not.toHaveBeenCalled();
    });
  });

  describe('getSelectedQuotationIndex', () => {
    beforeEach(() => {
      component.quotations = [
        { ...QUOTATION_DETAIL_MOCK, gqPositionId: '123' },
        { ...QUOTATION_DETAIL_MOCK, gqPositionId: '456' },
        { ...QUOTATION_DETAIL_MOCK, gqPositionId: '789' },
      ];
    });

    it('should find the index of a quotation', () => {
      expect(component.getSelectedQuotationIndex('456')).toEqual(1);
    });

    it("should return -1 if quotation doesn't exist", () => {
      expect(component.getSelectedQuotationIndex('000')).toEqual(-1);
    });
  });
});
