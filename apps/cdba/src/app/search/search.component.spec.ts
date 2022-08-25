import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';
import { MockModule } from 'ng-mocks';
import { marbles } from 'rxjs-marbles/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { BlockUiModule } from '@cdba/shared/components';
import { SEARCH_STATE_MOCK } from '@cdba/testing/mocks';

import { ReferenceTypesFiltersModule } from './reference-types-filters/reference-types-filters.module';
import { SearchComponent } from './search.component';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let spectator: Spectator<SearchComponent>;

  const createComponent = createComponentFactory({
    component: SearchComponent,
    imports: [
      PushModule,
      provideTranslocoTestingModule({ en: {} }),
      RouterTestingModule,
      MockModule(BlockUiModule),
      MockModule(ReferenceTypesFiltersModule),
    ],
    providers: [
      provideMockStore({
        initialState: {
          search: SEARCH_STATE_MOCK,
        },
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    test(
      'should initialize observables',
      marbles((m) => {
        m.expect(component.loading$).toBeObservable(m.cold('a', { a: false }));

        m.expect(component.tooManyResults$).toBeObservable(
          m.cold('a', { a: false })
        );

        m.expect(component.noResultsFound$).toBeObservable(
          m.cold('a', { a: false })
        );

        m.expect(component.resultCount$).toBeObservable(m.cold('a', { a: 10 }));
      })
    );
  });
});
