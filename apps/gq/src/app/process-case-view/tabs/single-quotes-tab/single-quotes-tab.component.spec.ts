import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ActivatedRoute, provideRouter } from '@angular/router';

import { BehaviorSubject, of } from 'rxjs';

import { ColumnDefService } from '@gq/case-view/case-table/config/column-def.service';
import { ActiveCaseFacade } from '@gq/core/store/active-case/active-case.facade';
import { AgGridStateService } from '@gq/shared/services/ag-grid-state/ag-grid-state.service';
import { TranslocoModule } from '@jsverse/transloco';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { MockProvider } from 'ng-mocks';
import { marbles } from 'rxjs-marbles';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';
import { ViewToggle } from '@schaeffler/view-toggle';

import { AddCustomViewModalComponent } from './add-custom-view-modal/add-custom-view-modal.component';
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
    const quotationDetailUpdating$ = new BehaviorSubject<boolean>(false);
    const quotationLoading$ = new BehaviorSubject<boolean>(false);

    const createComponent = createComponentFactory({
      component: SingleQuotesTabComponent,
      imports: [
        provideTranslocoTestingModule({ en: {} }),
        PushPipe,
        MatDialogModule,
      ],
      providers: [
        MockProvider(ActiveCaseFacade, {
          quotationDetailUpdating$,
          quotationLoading$,
        }),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: {
                get: jest.fn().mockReturnValue('gq123'),

                keys: { filter: jest.fn().mockReturnValue(['filter_key1']) },
              },
            },
          },
        },
        MockProvider(ColumnDefService, {
          COLUMN_DEFS: [
            {
              field: 'key1',
              filter: 'agSetColumnFilter',
              filterParams: {
                values: ['gq123'],
              },
            },
          ],
        }),
        MockProvider(AgGridStateService, {
          init: jest.fn(),
          setActiveView: jest.fn(),
          setColumnFilterForCurrentView: jest.fn(),
          resetFilterModelsOfDefaultView: jest.fn(),
          clearDefaultViewColumnAndFilterState: jest.fn(),
          DEFAULT_VIEW_ID: 1,
          views$: viewsSubject.asObservable(),
          views$$: viewsSubject,
        } as unknown as AgGridStateService),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });

    beforeEach(() => {
      spectator = createComponent();
      component = spectator.debugElement.componentInstance;
      matDialog = spectator.inject(MatDialog);

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
        matDialog.open = jest.fn().mockReturnValue({
          afterClosed: jest.fn().mockReturnValue(of({ delete: true })),
        });

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
  });

  describe('SingleQuotesTab Without Filter params', () => {
    let component: SingleQuotesTabComponent;
    let spectator: Spectator<SingleQuotesTabComponent>;

    const createComponent = createComponentFactory({
      component: SingleQuotesTabComponent,
      imports: [
        provideTranslocoTestingModule({ en: {} }),
        PushPipe,
        MatDialogModule,
      ],
      providers: [
        provideRouter([]),
        MockProvider(ActiveCaseFacade),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: {
                get: jest.fn().mockReturnValue('gq123'),

                keys: { filter: jest.fn().mockReturnValue([]) },
              },
            },
          },
        },
        MockProvider(ColumnDefService, {
          COLUMN_DEFS: [
            {
              field: 'key1',
              filter: 'agSetColumnFilter',
              filterParams: {
                values: ['gq123'],
              },
            },
          ],
        }),
        MockProvider(AgGridStateService, {
          init: jest.fn(),
          setActiveView: jest.fn(),
          setColumnFilterForCurrentView: jest.fn(),
          resetFilterModelsOfDefaultView: jest.fn(),
          clearDefaultViewColumnAndFilterState: jest.fn(),
          DEFAULT_VIEW_ID: 1,
          views$: viewsSubject.asObservable(),
        } as unknown as AgGridStateService),
      ],

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
