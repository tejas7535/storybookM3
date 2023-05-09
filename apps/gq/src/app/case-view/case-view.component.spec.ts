import { MatCardModule } from '@angular/material/card';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { RouterTestingModule } from '@angular/router/testing';

import { loadCases } from '@gq/core/store/actions';
import { activeCaseFeature } from '@gq/core/store/active-case/active-case.reducer';
import {
  getDeleteLoading,
  getQuotations,
  getStatusBarForQuotationStatus,
  getViewToggles,
} from '@gq/core/store/selectors';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AgGridModule } from 'ag-grid-angular';
import { marbles } from 'rxjs-marbles';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SubheaderModule } from '@schaeffler/subheader';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';
import { ViewToggleModule } from '@schaeffler/view-toggle';

import { VIEW_CASE_STATE_MOCK } from '../../testing/mocks';
import { CustomStatusBarModule } from '../shared/ag-grid/custom-status-bar/custom-status-bar.module';
import { QuotationStatus } from '../shared/models/quotation/quotation-status.enum';
import { CaseTableModule } from './case-table/case-table.module';
import { CaseViewComponent } from './case-view.component';

describe('CaseViewComponent', () => {
  let component: CaseViewComponent;
  let spectator: Spectator<CaseViewComponent>;
  let store: MockStore;

  const createComponent = createComponentFactory({
    component: CaseViewComponent,
    imports: [
      AgGridModule,
      CaseTableModule,
      CustomStatusBarModule,
      provideTranslocoTestingModule({ en: {} }),
      LoadingSpinnerModule,
      PushModule,
      MatCardModule,
      ViewToggleModule,
      SubheaderModule,
      RouterTestingModule,
    ],
    providers: [
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
      provideMockStore({
        initialState: {
          viewCases: { ...VIEW_CASE_STATE_MOCK, quotationsLoading: true },
        },
      }),
    ],
    declarations: [CaseViewComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    store = spectator.inject(MockStore);
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeAll(() => {});

    test(
      'should set caseViews$',
      marbles((m) => {
        store.overrideSelector(getViewToggles, []);

        component.ngOnInit();

        m.expect(component.caseViews$).toBeObservable(m.cold('a', { a: [] }));
      })
    );
    test(
      'should set statusBar$',
      marbles((m) => {
        store.overrideSelector(getStatusBarForQuotationStatus, {
          statusPanels: [],
        });

        component.ngOnInit();

        m.expect(component.statusBar$).toBeObservable(
          m.cold('a', { a: { statusPanels: [] } })
        );
      })
    );
    test(
      'should set displayedQuotations$',
      marbles((m) => {
        store.overrideSelector(getQuotations, []);

        component.ngOnInit();

        m.expect(component.displayedQuotations$).toBeObservable(
          m.cold('a', { a: [] })
        );
      })
    );
    test(
      'should set quotationsLoading$',
      marbles((m) => {
        store.overrideSelector(activeCaseFeature.selectQuotationLoading, true);

        component.ngOnInit();

        m.expect(component.quotationsLoading$).toBeObservable(
          m.cold('a', { a: true })
        );
      })
    );
    test(
      'should set deleteLoading$',
      marbles((m) => {
        store.overrideSelector(getDeleteLoading, false);

        component.ngOnInit();

        m.expect(component.deleteLoading$).toBeObservable(
          m.cold('a', { a: false })
        );
      })
    );
  });

  describe('onViewToggle', () => {
    test('should call setDisplayedQuotations', () => {
      store.overrideSelector(activeCaseFeature.selectQuotationLoading, false);
      store.dispatch = jest.fn();

      component.onViewToggle({
        id: QuotationStatus.ACTIVE,
        title: 'title',
        active: false,
      });

      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(
        loadCases({ status: QuotationStatus.ACTIVE })
      );
    });
  });
});
