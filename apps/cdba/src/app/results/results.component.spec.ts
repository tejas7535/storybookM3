import { Router } from '@angular/router';

import { getReferenceTypes, selectReferenceTypes } from '@cdba/core/store';
import { BreadcrumbsService } from '@cdba/shared/services';
import { SEARCH_STATE_MOCK } from '@cdba/testing/mocks';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { PushModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockModule } from 'ng-mocks';
import { marbles } from 'rxjs-marbles/jest';

import { SubheaderModule } from '@schaeffler/subheader';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { ReferenceTypesTableModule } from './reference-types-table/reference-types-table.module';
import { ResultsComponent } from './results.component';

describe('ResultsComponent', () => {
  let component: ResultsComponent;
  let spectator: Spectator<ResultsComponent>;
  let store: MockStore;

  const createComponent = createComponentFactory({
    component: ResultsComponent,
    imports: [
      PushModule,
      provideTranslocoTestingModule({ en: {} }),
      MockModule(SubheaderModule),
      MockModule(ReferenceTypesTableModule),
    ],
    providers: [
      mockProvider(BreadcrumbsService),
      provideMockStore({
        initialState: {
          search: SEARCH_STATE_MOCK,
        },
      }),
      {
        provide: Router,
        useValue: {
          navigateByUrl: jest.fn(),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;

    store = spectator.inject(MockStore);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    test(
      'should initialize store obersvables',
      marbles((m) => {
        m.expect(component.resultCount$).toBeObservable(m.cold('a', { a: 10 }));

        m.expect(component.selectedReferenceTypeIds$).toBeObservable(
          m.cold('a', { a: ['1'] })
        );

        m.expect(component.referenceTypesData$).toBeObservable(
          m.cold('a', { a: SEARCH_STATE_MOCK.referenceTypes.items })
        );
      })
    );

    test(
      'should redirect to search if refTypes are undefined',
      marbles((m) => {
        store.overrideSelector(getReferenceTypes, undefined);

        m.expect(component.referenceTypesData$).toBeObservable(
          m.cold('a', { a: undefined })
        );
        m.flush();

        expect(component['router'].navigateByUrl).toHaveBeenCalled();
      })
    );
  });

  describe('selectReferenceTypes', () => {
    test('should dispatch selectReferenceTypes Action', () => {
      store.dispatch = jest.fn();

      const nodeIds = ['1'];

      component.selectReferenceTypes(nodeIds);

      expect(store.dispatch).toHaveBeenCalledWith(
        selectReferenceTypes({ nodeIds })
      );
    });
  });
});
