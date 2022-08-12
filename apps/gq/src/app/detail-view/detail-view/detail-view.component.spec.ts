import { MatButtonModule } from '@angular/material/button';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { TranslocoModule } from '@ngneat/transloco';
import { LetModule, PushModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';
import { MockModule } from 'ng-mocks';
import { marbles } from 'rxjs-marbles/jest';

import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { BreadcrumbsModule } from '@schaeffler/breadcrumbs';
import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { ShareButtonModule } from '@schaeffler/share-button';
import { SubheaderModule } from '@schaeffler/subheader';

import {
  MATERIAL_STOCK_STATE_MOCK,
  PLANT_MATERIAL_DETAILS_STATE_MOCK,
  PROCESS_CASE_STATE_MOCK,
  QUOTATION_DETAIL_MOCK,
  QUOTATION_MOCK,
} from '../../../testing/mocks';
import { MATERIAL_STOCK_MOCK } from '../../../testing/mocks/models/material-stock.mock';
import { CustomerHeaderModule } from '../../shared/components/header/customer-header/customer-header.module';
import { SharedPipesModule } from '../../shared/pipes/shared-pipes.module';
import { AgGridStateService } from '../../shared/services/ag-grid-state.service/ag-grid-state.service';
import { DetailViewComponent } from './detail-view.component';
import { FilterPricingModule } from './filter-pricing/filter-pricing.module';
import { PricingDetailsModule } from './pricing-details/pricing-details.module';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('DetailViewComponent', () => {
  let component: DetailViewComponent;
  let spectator: Spectator<DetailViewComponent>;
  let router: Router;

  const createComponent = createComponentFactory({
    component: DetailViewComponent,
    imports: [
      BrowserAnimationsModule,
      FilterPricingModule,
      MatButtonModule,
      MatSidenavModule,
      PricingDetailsModule,
      LoadingSpinnerModule,
      MockModule(LetModule),
      MockModule(PushModule),
      SharedPipesModule,
      SubheaderModule,
      BreadcrumbsModule,
      CustomerHeaderModule,
      ShareButtonModule,
      RouterTestingModule,
    ],
    providers: [
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
      mockProvider(ApplicationInsightsService),
      provideMockStore({
        initialState: {
          processCase: PROCESS_CASE_STATE_MOCK,
          materialStock: MATERIAL_STOCK_STATE_MOCK,
          plantMaterialDetails: PLANT_MATERIAL_DETAILS_STATE_MOCK,
        },
      }),
      mockProvider(AgGridStateService),
    ],
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
          m.cold('a', { a: undefined })
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
