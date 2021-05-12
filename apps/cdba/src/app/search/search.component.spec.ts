import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockModule } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { BlockUiModule } from '@cdba/shared/components';

import {
  getReferenceTypes,
  getSearchSuccessful,
  selectReferenceTypes,
} from '../core/store';
import { SharedModule } from '../shared/shared.module';
import { FilterPanelModule } from './filter-panel/filter-panel.module';
import { ReferenceTypesFiltersModule } from './reference-types-filters/reference-types-filters.module';
import { ReferenceTypesTableModule } from './reference-types-table/reference-types-table.module';
import { SearchComponent } from './search.component';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let spectator: Spectator<SearchComponent>;
  let store: MockStore;

  const createComponent = createComponentFactory({
    component: SearchComponent,
    imports: [
      SharedModule,
      provideTranslocoTestingModule({ en: {} }),
      MockModule(FilterPanelModule),
      MockModule(ReferenceTypesFiltersModule),
      MockModule(ReferenceTypesTableModule),
      RouterTestingModule,
      BlockUiModule,
    ],
    providers: [
      provideMockStore({
        initialState: {
          search: {},
        },
        selectors: [
          {
            selector: getSearchSuccessful,
            value: true,
          },
          {
            selector: getReferenceTypes,
            value: [],
          },
        ],
      }),
    ],
    disableAnimations: true,
    detectChanges: false,
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
    test('should initialize observables', () => {
      component.ngOnInit();

      expect(component.searchSuccessful$).toBeDefined();
    });
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
