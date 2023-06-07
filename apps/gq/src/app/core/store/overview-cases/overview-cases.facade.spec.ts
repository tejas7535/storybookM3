import { ExtendedViewToggle } from '@gq/case-view/models/extended-view-toggle';
import { AgStatusBar } from '@gq/shared/ag-grid/models/ag-status-bar.model';
import { QuotationStatus, ViewQuotation } from '@gq/shared/models/quotation';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { OverviewCasesActions } from './overview-cases.actions';
import { OverviewCasesFacade } from './overview-cases.facade';
import { overviewCasesFeature } from './overview-cases.reducer';
import * as fromOverviewCasesSelector from './overview-cases.selectors';

describe('OverviewCasesFacade', () => {
  let facade: OverviewCasesFacade;
  let spectator: SpectatorService<OverviewCasesFacade>;
  let mockStore: MockStore;

  const createService = createServiceFactory({
    service: OverviewCasesFacade,
    providers: [provideMockStore({})],
  });

  beforeEach(() => {
    spectator = createService();
    facade = spectator.service;
    mockStore = spectator.inject(MockStore);
  });

  test('should be created', () => {
    expect(facade).toBeTruthy();
  });

  describe('should provide Observables', () => {
    test(
      'should provide quotations$',
      marbles((m) => {
        const viewQuotationsMock: ViewQuotation[] = [
          { gqId: '1213' } as unknown as ViewQuotation,
        ];
        mockStore.overrideSelector(
          fromOverviewCasesSelector.getQuotations,
          viewQuotationsMock
        );
        m.expect(facade.quotations$).toBeObservable(
          m.cold('a', { a: viewQuotationsMock })
        );
      })
    );

    test(
      'should provide statusBarForQuotationStatus$',
      marbles((m) => {
        const agStatusBarMock: AgStatusBar = {
          statusPanels: [{ key: 'mKey' }],
        } as unknown as AgStatusBar;
        mockStore.overrideSelector(
          fromOverviewCasesSelector.getStatusBarForQuotationStatus,
          agStatusBarMock
        );
        m.expect(facade.statusBarForQuotationStatus$).toBeObservable(
          m.cold('a', { a: agStatusBarMock })
        );
      })
    );
    test(
      'should provide viewToggles$',
      marbles((m) => {
        const viewToggleMock: ExtendedViewToggle[] = [
          { id: '1213' } as unknown as ExtendedViewToggle,
        ];
        mockStore.overrideSelector(
          fromOverviewCasesSelector.getViewToggles,
          viewToggleMock
        );
        m.expect(facade.viewToggles$).toBeObservable(
          m.cold('a', { a: viewToggleMock })
        );
      })
    );

    test(
      'should provide displayStatus$',
      marbles((m) => {
        mockStore.overrideSelector(
          fromOverviewCasesSelector.getDisplayStatus,
          QuotationStatus.APPROVED
        );
        m.expect(facade.displayStatus$).toBeObservable(
          m.cold('a', { a: QuotationStatus.APPROVED })
        );
      })
    );

    test(
      'should provide quotationsLoading$',
      marbles((m) => {
        mockStore.overrideSelector(
          overviewCasesFeature.selectQuotationsLoading,
          false
        );
        m.expect(facade.quotationsLoading$).toBeObservable(
          m.cold('a', { a: false })
        );
      })
    );
    test(
      'should provide deleteLoading$',
      marbles((m) => {
        mockStore.overrideSelector(
          overviewCasesFeature.selectDeleteLoading,
          false
        );
        m.expect(facade.deleteLoading$).toBeObservable(
          m.cold('a', { a: false })
        );
      })
    );

    test(
      'should provide selectedIds$',
      marbles((m) => {
        mockStore.overrideSelector(
          overviewCasesFeature.selectSelectedCases,
          [1, 2]
        );
        m.expect(facade.selectedIds$).toBeObservable(
          m.cold('a', { a: [1, 2] })
        );
      })
    );
  });

  describe('should dispatch actions', () => {
    it('should dispatch selectCase', () => {
      mockStore.dispatch = jest.fn();
      facade.selectCase(123);
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        OverviewCasesActions.selectCase({ gqId: 123 })
      );
    });

    it('should dispatch deselectCase', () => {
      mockStore.dispatch = jest.fn();
      facade.deselectCase(123);
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        OverviewCasesActions.deselectCase({ gqId: 123 })
      );
    });

    it('should dispatch loadCasesForView', () => {
      mockStore.dispatch = jest.fn();
      facade.loadCasesForView(123);
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        OverviewCasesActions.loadCasesForView({ viewId: 123 })
      );
    });

    it('should dispatch updateCaseStatuses', () => {
      mockStore.dispatch = jest.fn();
      facade.updateCasesStatus([123], QuotationStatus.ACTIVE);
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        OverviewCasesActions.updateCasesStatus({
          gqIds: [123],
          status: QuotationStatus.ACTIVE,
        })
      );
    });
  });
});
