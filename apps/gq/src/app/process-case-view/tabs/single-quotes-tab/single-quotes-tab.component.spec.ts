import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { activeCaseFeature } from '@gq/core/store/active-case/active-case.reducer';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import {
  PROCESS_CASE_STATE_MOCK,
  QUOTATION_MOCK,
} from '../../../../testing/mocks';
import { SingleQuotesTabComponent } from './single-quotes-tab.component';
describe('SingleQuotesTab', () => {
  describe('SingleQuotesTabComponent', () => {
    let component: SingleQuotesTabComponent;
    let spectator: Spectator<SingleQuotesTabComponent>;
    let store: MockStore;

    const createComponent = createComponentFactory({
      component: SingleQuotesTabComponent,
      imports: [
        provideTranslocoTestingModule({ en: {} }),
        PushPipe,
        MatDialogModule,
      ],
      providers: [
        provideMockStore({
          initialState: {
            processCase: PROCESS_CASE_STATE_MOCK,
            'azure-auth': {},
          },
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
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });

    beforeEach(() => {
      spectator = createComponent();
      component = spectator.debugElement.componentInstance;
      store = spectator.inject(MockStore);
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    describe('ngOnInit', () => {
      test(
        'should set quotation$',
        marbles((m) => {
          store.overrideSelector(
            activeCaseFeature.selectQuotation,
            QUOTATION_MOCK
          );

          component.ngOnInit();

          m.expect(component.quotation$).toBeObservable(
            m.cold('a', { a: QUOTATION_MOCK })
          );
        })
      );
      test(
        'should set updateLoading$',
        marbles((m) => {
          store.overrideSelector(activeCaseFeature.selectUpdateLoading, true);

          component.ngOnInit();

          m.expect(component.updateLoading$).toBeObservable(
            m.cold('a', { a: true })
          );
        })
      );
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
  });

  describe('SingleQuotesTab Without Filter params', () => {
    let component: SingleQuotesTabComponent;
    let spectator: Spectator<SingleQuotesTabComponent>;

    const createComponent = createComponentFactory({
      component: SingleQuotesTabComponent,
      imports: [
        RouterTestingModule,
        provideTranslocoTestingModule({ en: {} }),
        PushPipe,
        MatDialogModule,
      ],
      providers: [
        provideMockStore({
          initialState: {
            processCase: PROCESS_CASE_STATE_MOCK,
            'azure-auth': {},
          },
        }),
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
