import { CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';

import { BehaviorSubject, of } from 'rxjs';

import { ActiveCaseFacade } from '@gq/core/store/active-case/active-case.facade';
import { ProcessCaseFacade } from '@gq/core/store/process-case/process-case.facade';
import { ColumnDefService } from '@gq/process-case-view/quotation-details-table/config/column-def.service';
import { AgGridStateService } from '@gq/shared/services/ag-grid-state/ag-grid-state.service';
import { TranslocoModule } from '@jsverse/transloco';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockBuilder } from 'ng-mocks';
import { marbles } from 'rxjs-marbles';

import { ViewToggle } from '@schaeffler/view-toggle';

import { AddCustomViewModalComponent } from './add-custom-view-modal/add-custom-view-modal.component';
import { DeleteCustomViewModalComponent } from './delete-custom-view-modal/delete-custom-view-modal.component';
import { SingleQuotesTabComponent } from './single-quotes-tab.component';

jest.mock('@jsverse/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@jsverse/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('SingleQuotesTab', () => {
  const viewsSubject = new BehaviorSubject<ViewToggle[]>([]);
  describe('SingleQuotesTabComponent', () => {
    let component: SingleQuotesTabComponent;
    let spectator: Spectator<SingleQuotesTabComponent>;
    let matDialog: MatDialog;
    let processCaseFacade: ProcessCaseFacade;
    const quotationDetailUpdating$ = new BehaviorSubject<boolean>(false);
    const quotationLoading$ = new BehaviorSubject<boolean>(false);

    const dependencies = MockBuilder(SingleQuotesTabComponent)
      .mock(ActiveCaseFacade, {
        quotationDetailUpdating$,
        quotationLoading$,
      })
      .mock(ColumnDefService, {
        COLUMN_DEFS: [
          {
            field: 'key1',
            filter: 'agSetColumnFilter',
            filterParams: {
              values: ['gq123'],
            },
          },
        ],
      })
      .mock(AgGridStateService, {
        init: jest.fn(),
        setActiveView: jest.fn(),
        setColumnFilterForCurrentView: jest.fn(),
        resetFilterModelsOfDefaultView: jest.fn(),
        clearDefaultViewColumnAndFilterState: jest.fn(),
        DEFAULT_VIEW_ID: 1,
        views$: viewsSubject.asObservable(),
        views$$: viewsSubject,
      } as unknown as AgGridStateService)
      .provide({
        provide: ActivatedRoute,
        useValue: {
          snapshot: {
            queryParamMap: {
              get: jest.fn().mockReturnValue('gq123'),
              keys: { filter: jest.fn().mockReturnValue(['filter_key1']) },
            },
          },
        },
      })
      .mock(ProcessCaseFacade, {
        tableIsFullscreen: signal(false),
        toggleTableFullscreenView: jest.fn(),
      })
      .mock(MatDialog, {
        open: jest.fn().mockReturnValue({
          afterClosed: jest.fn().mockReturnValue(of(null)),
          close: jest.fn(),
          componentInstance: {},
        }),
      })
      .mock(AddCustomViewModalComponent)
      .mock(DeleteCustomViewModalComponent)
      .build();

    const createComponent = createComponentFactory({
      component: SingleQuotesTabComponent,
      ...dependencies,
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });

    beforeEach(() => {
      spectator = createComponent();
      component = spectator.debugElement.componentInstance;
      matDialog = spectator.inject(MatDialog);
      processCaseFacade = spectator.inject(ProcessCaseFacade);

      quotationDetailUpdating$.next(false);
      quotationLoading$.next(false);
      viewsSubject.next([]);
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    describe('ngOnDestroy', () => {
      test('should save userSettings', () => {
        component['gridStateService'].saveUserSettings = jest.fn();

        component.ngOnDestroy();

        expect(
          component['gridStateService'].saveUserSettings
        ).toHaveBeenCalled();
      });
    });

    describe('onViewToggle', () => {
      test('should open modal for add view', () => {
        component['openCustomViewModal'] = jest.fn();

        component.onViewToggle({ id: 9999, active: false });

        expect(component['openCustomViewModal']).toHaveBeenCalledTimes(1);
        expect(component['openCustomViewModal']).toHaveBeenCalledWith(
          9999,
          true
        );
      });

      test('should update active view for other views', () => {
        component['gridStateService'].setActiveView = jest.fn();

        component.onViewToggle({ id: 2, active: false });

        expect(
          component['gridStateService'].setActiveView
        ).toHaveBeenCalledTimes(1);
        expect(
          component['gridStateService'].setActiveView
        ).toHaveBeenCalledWith(2);
      });
    });

    describe('openCustomViewModal', () => {
      test('should open add custom view modal', () => {
        const dialogSpy = jest.spyOn(matDialog, 'open').mockReturnValue({
          afterClosed: jest.fn().mockReturnValue(of(null)),
        } as any);

        component.openCustomViewModal(9999, true);

        expect(dialogSpy).toHaveBeenCalledWith(
          AddCustomViewModalComponent,
          expect.anything()
        );
      });

      test('should handle modal result correctly - createViewFromScratch', () => {
        component['gridStateService'].createViewFromScratch = jest.fn();
        component['gridStateService'].createViewFromCurrentView = jest.fn();
        component['gridStateService'].updateViewName = jest.fn();
        const dialogSpy = jest.spyOn(matDialog, 'open').mockReturnValue({
          afterClosed: jest
            .fn()
            .mockReturnValue(
              of({ createNewView: true, name: 'hi', createFromDefault: true })
            ),
        } as any);

        component.openCustomViewModal(9999, true);

        expect(dialogSpy).toHaveBeenCalledWith(
          AddCustomViewModalComponent,
          expect.anything()
        );
        expect(
          component['gridStateService'].createViewFromScratch
        ).toHaveBeenCalled();
      });

      test('should handle modal result correctly - updateViewName', () => {
        component['gridStateService'].createViewFromScratch = jest.fn();
        component['gridStateService'].createViewFromCurrentView = jest.fn();
        component['gridStateService'].updateViewName = jest.fn();
        const dialogSpy = jest.spyOn(matDialog, 'open').mockReturnValue({
          afterClosed: jest
            .fn()
            .mockReturnValue(of({ createNewView: false, name: 'hi' })),
        } as any);

        component.openCustomViewModal(9999, true);

        expect(dialogSpy).toHaveBeenCalledWith(
          AddCustomViewModalComponent,
          expect.anything()
        );
        expect(component['gridStateService'].updateViewName).toHaveBeenCalled();
      });
    });

    describe('onViewToggleIconClicked', () => {
      test('should handle add icon', () => {
        component['openCustomViewModal'] = jest.fn();
        component['gridStateService'].getCurrentViewId = jest
          .fn()
          .mockReturnValue(2);

        component.onViewToggleIconClicked({ viewId: 9999, iconName: 'add' });

        expect(component['openCustomViewModal']).toHaveBeenCalled();
      });

      test('should handle edit icon', () => {
        component['openCustomViewModal'] = jest.fn();
        component['gridStateService'].getViewNameById = jest
          .fn()
          .mockReturnValue('Custom View');

        component.onViewToggleIconClicked({ viewId: 2, iconName: 'edit' });

        expect(component['openCustomViewModal']).toHaveBeenCalledWith(
          2,
          false,
          false,
          'Custom View'
        );
      });

      test('should handle delete icon', () => {
        component['gridStateService'].deleteView = jest.fn();

        jest.spyOn(matDialog, 'open').mockReturnValue({
          afterClosed: jest.fn().mockReturnValue(of({ delete: true })),
          close: jest.fn(),
          componentInstance: {},
        } as any);

        component.onViewToggleIconClicked({ viewId: 2, iconName: 'delete' });

        expect(component['gridStateService'].deleteView).toHaveBeenCalledWith(
          2
        );
      });
    });

    describe('onViewToggleDoubleClicked', () => {
      test('should open modal on double click', () => {
        component['openCustomViewModal'] = jest.fn();
        component['gridStateService'].getViewNameById = jest
          .fn()
          .mockReturnValue('test-name');

        component.onViewToggleDoubleClicked(2);

        expect(component['openCustomViewModal']).toHaveBeenCalledTimes(1);
        expect(component['openCustomViewModal']).toHaveBeenCalledWith(
          2,
          false,
          false,
          'test-name'
        );
      });
    });

    describe('applyFilterFromQueryParams', () => {
      test('should apply a filter', () => {
        component['gridStateService'].setColumnFilterForCurrentView = jest.fn();
        component['gridStateService'].setActiveView = jest.fn();

        component.applyFilterFromQueryParams();

        expect(component['gridStateService'].setActiveView).toHaveBeenCalled();
        expect(
          component['gridStateService'].setColumnFilterForCurrentView
        ).toHaveBeenCalledWith('gq123', {
          key1: { filterType: 'set', values: ['gq123'] },
        });
      });
    });

    describe('dataLoading$', () => {
      test(
        'should emit true when any loading is true',
        marbles((m) => {
          quotationDetailUpdating$.next(true);
          quotationLoading$.next(false);

          m.expect(component.dataLoading$).toBeObservable('a', {
            a: true,
          });
        })
      );
      test(
        'should emit true when any loadin is true (2)',
        marbles((m) => {
          quotationDetailUpdating$.next(false);
          quotationLoading$.next(true);

          m.expect(component.dataLoading$).toBeObservable('a', {
            a: true,
          });
        })
      );

      test(
        'should emit false when both loadings are false',
        marbles((m) => {
          quotationDetailUpdating$.next(false);
          quotationLoading$.next(false);

          m.expect(component.dataLoading$).toBeObservable('a', {
            a: false,
          });
        })
      );
    });

    describe('customViews$', () => {
      test(
        'should emit view with icons and add view',
        marbles((m) => {
          const mockViews: ViewToggle[] = [
            { id: 1, title: 'View 1', active: false },
            { id: 2, title: 'View 2', active: false },
            { id: 3, title: 'View 3', active: false },
          ];
          viewsSubject.next(mockViews);

          m.expect(component.customViews$).toBeObservable('a', {
            a: [
              {
                id: 1,
                title: 'translate it',
                active: false,
              },
              {
                id: 2,
                title: 'View 2',
                active: false,
                icons: [{ name: 'edit' }, { name: 'delete' }],
              },
              {
                id: 3,
                title: 'View 3',
                active: false,
                icons: [{ name: 'edit' }, { name: 'delete' }],
              },
              {
                id: 9999,
                active: false,
                icons: [{ name: 'add' }],
              },
            ],
          });
        })
      );

      test(
        'should handle empty views array',
        marbles((m) => {
          viewsSubject.next([]);

          m.expect(component.customViews$).toBeObservable('a', {
            a: [
              {
                id: 9999,
                active: false,
                icons: [{ name: 'add' }],
              },
            ],
          });
        })
      );
    });

    describe('Toggle Table Fullscreen View', () => {
      test('should call facade method to toggle fullscreen mode', () => {
        component.toggleTableFullscreenView();

        expect(processCaseFacade.toggleTableFullscreenView).toHaveBeenCalled();
      });

      test('should return expand_content icon when table is not in fullscreen mode', () => {
        expect(component.toggleFullscreenTableIcon()).toBe('expand_content');
      });

      test('should return collapse_content icon when table is in fullscreen mode', () => {
        (processCaseFacade.tableIsFullscreen as any) = signal(true);
        expect(component.toggleFullscreenTableIcon()).toBe('collapse_content');
      });
    });
  });

  describe('SingleQuotesTab Without Filter params', () => {
    let component: SingleQuotesTabComponent;
    let spectator: Spectator<SingleQuotesTabComponent>;

    const dependencies = MockBuilder(SingleQuotesTabComponent)
      .mock(ActiveCaseFacade)
      .mock(ProcessCaseFacade)
      .mock(ColumnDefService, {
        COLUMN_DEFS: [
          {
            field: 'key1',
            filter: 'agSetColumnFilter',
            filterParams: {
              values: ['gq123'],
            },
          },
        ],
      })
      .mock(AgGridStateService, {
        init: jest.fn(),
        setActiveView: jest.fn(),
        setColumnFilterForCurrentView: jest.fn(),
        resetFilterModelsOfDefaultView: jest.fn(),
        clearDefaultViewColumnAndFilterState: jest.fn(),
        DEFAULT_VIEW_ID: 1,
        views$: viewsSubject.asObservable(),
        views$$: viewsSubject,
      } as unknown as AgGridStateService)
      .provide({
        provide: ActivatedRoute,
        useValue: {
          snapshot: {
            queryParamMap: {
              get: jest.fn().mockReturnValue('gq123'),
              keys: { filter: jest.fn().mockReturnValue([]) },
            },
          },
        },
      })
      .build();

    const createComponent = createComponentFactory({
      component: SingleQuotesTabComponent,
      ...dependencies,
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });
    beforeEach(() => {
      spectator = createComponent();
      component = spectator.debugElement.componentInstance;
    });

    test('should NOT apply a filter but reset defaultViews filter', () => {
      component['gridStateService'].setColumnFilterForCurrentView = jest.fn();
      component['gridStateService'].setActiveView = jest.fn();
      component['gridStateService'].resetFilterModelsOfDefaultView = jest.fn();

      component.applyFilterFromQueryParams();

      expect(
        component['gridStateService'].setActiveView
      ).not.toHaveBeenCalled();
      expect(
        component['gridStateService'].setColumnFilterForCurrentView
      ).not.toHaveBeenCalled();
      expect(
        component['gridStateService'].resetFilterModelsOfDefaultView
      ).toHaveBeenCalled();
    });
  });
});
