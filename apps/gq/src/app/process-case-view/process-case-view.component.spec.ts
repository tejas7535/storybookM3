import { MatCardModule } from '@angular/material/card';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { TranslocoModule } from '@ngneat/transloco';
import { PushModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AgGridModule } from 'ag-grid-angular';
import { MockModule } from 'ng-mocks';
import { marbles } from 'rxjs-marbles';

import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { Breadcrumb, BreadcrumbsModule } from '@schaeffler/breadcrumbs';
import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { ShareButtonModule } from '@schaeffler/share-button';
import { SubheaderModule } from '@schaeffler/subheader';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { PROCESS_CASE_STATE_MOCK, QUOTATION_MOCK } from '../../testing/mocks';
import {
  getCustomerLoading,
  getGqId,
  getQuotation,
  getQuotationLoading,
  getUpdateLoading,
  updateQuotation,
} from '../core/store';
import { CustomStatusBarModule } from '../shared/ag-grid/custom-status-bar/custom-status-bar.module';
import { AddEntryModule } from '../shared/components/case-material/add-entry/add-entry.module';
import { InputTableModule } from '../shared/components/case-material/input-table/input-table.module';
import { CustomerHeaderModule } from '../shared/components/header/customer-header/customer-header.module';
import { SharedPipesModule } from '../shared/pipes/shared-pipes.module';
import { HelperService } from '../shared/services/helper-service/helper-service.service';
import { UpdateQuotationRequest } from '../shared/services/rest-services/quotation-service/models/update-quotation-request.model';
import { AddMaterialDialogComponent } from './add-material-dialog/add-material-dialog.component';
import { CalculationInProgressComponent } from './calculation-in-progress/calculation-in-progress.component';
import { HeaderContentModule } from './header-content/header-content.module';
import { ProcessCaseViewComponent } from './process-case-view.component';
import { ProcessCaseViewRoutingModule } from './process-case-view-routing.module';
import { QuotationDetailsTableModule } from './quotation-details-table/quotation-details-table.module';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('ProcessCaseViewComponent', () => {
  let component: ProcessCaseViewComponent;
  let spectator: Spectator<ProcessCaseViewComponent>;
  let store: MockStore;

  const createComponent = createComponentFactory({
    component: ProcessCaseViewComponent,
    imports: [
      AddEntryModule,
      MockModule(InputTableModule),
      AgGridModule,
      BrowserAnimationsModule,
      MockModule(CustomStatusBarModule),
      MatCardModule,
      MatDialogModule,
      MatIconModule,
      MatSidenavModule,
      ProcessCaseViewRoutingModule,
      MockModule(QuotationDetailsTableModule),
      RouterTestingModule,
      HeaderContentModule,
      provideTranslocoTestingModule({ en: {} }),
      LoadingSpinnerModule,
      PushModule,
      MatSnackBarModule,
      CustomerHeaderModule,
      MatCardModule,
      SubheaderModule,
      BreadcrumbsModule,
      SharedPipesModule,
      ShareButtonModule,
    ],
    declarations: [CalculationInProgressComponent],
    providers: [
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
      mockProvider(ApplicationInsightsService),
      provideMockStore({
        initialState: {
          processCase: PROCESS_CASE_STATE_MOCK,
          'azure-auth': {},
        },
      }),
      {
        provide: HelperService,
        useValue: {
          transformDate: jest.fn(),
          transformMarginDetails: jest.fn(),
          transformPercentage: jest.fn(),
        },
      },
    ],
    entryComponents: [AddMaterialDialogComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    store = spectator.inject(MockStore);
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    test(
      'should set customerLoading$',
      marbles((m) => {
        store.overrideSelector(getCustomerLoading, true);

        component.ngOnInit();

        m.expect(component.customerLoading$).toBeObservable(
          m.cold('a', { a: true })
        );
      })
    );
    test(
      'should set quotation$',
      marbles((m) => {
        store.overrideSelector(getQuotation, QUOTATION_MOCK);

        component.ngOnInit();

        m.expect(component.quotation$).toBeObservable(
          m.cold('a', { a: QUOTATION_MOCK })
        );
      })
    );
    test(
      'should set quotationLoading$',
      marbles((m) => {
        store.overrideSelector(getQuotationLoading, true);

        component.ngOnInit();

        m.expect(component.quotationLoading$).toBeObservable(
          m.cold('a', { a: true })
        );
      })
    );
    test(
      'should set updateLoading$',
      marbles((m) => {
        store.overrideSelector(getUpdateLoading, true);

        component.ngOnInit();

        m.expect(component.updateLoading$).toBeObservable(
          m.cold('a', { a: true })
        );
      })
    );
    test(
      'should set breadcrumbs$',
      marbles((m) => {
        const breadcrumbs: Breadcrumb[] = [
          {
            label: 'Test',
          },
        ];
        component[
          'breadCrumbsService'
        ].getQuotationBreadcrumbsForProcessCaseView = jest.fn(
          (): Breadcrumb[] => breadcrumbs
        );
        store.overrideSelector(getGqId, 1234);

        component.ngOnInit();

        m.expect(component.breadcrumbs$).toBeObservable(
          m.cold('a', { a: breadcrumbs })
        );
        component.breadcrumbs$.subscribe(() => {
          expect(
            component['breadCrumbsService']
              .getQuotationBreadcrumbsForProcessCaseView
          ).toHaveBeenCalledTimes(1);
          expect(
            component['breadCrumbsService']
              .getQuotationBreadcrumbsForProcessCaseView
          ).toHaveBeenCalledWith(1234);
        });
      })
    );
  });

  describe('updateQuotation', () => {
    test('should dispatch updateQuotation', () => {
      store.dispatch = jest.fn();
      const updateQuotationRequest: UpdateQuotationRequest = {
        caseName: 'caseName',
        currency: 'USD',
      };
      component.updateQuotation(updateQuotationRequest);

      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(
        updateQuotation(updateQuotationRequest)
      );
    });
  });
});
