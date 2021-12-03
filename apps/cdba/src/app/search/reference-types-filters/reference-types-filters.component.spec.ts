import { MatButtonModule } from '@angular/material/button';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockComponent } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import {
  autocomplete,
  loadInitialFilters,
  resetFilters,
  search,
  updateFilter,
} from '../../core/store/actions/search/search.actions';
import {
  FilterItemIdValue,
  FilterItemRange,
  IdValue,
  TextSearch,
} from '../../core/store/reducers/search/models';
import {
  getAutocompleteLoading,
  getFilters,
  getSelectedFilters,
  getTooManyResults,
} from '../../core/store/selectors/search/search.selector';
import { MultiSelectFilterComponent } from './multi-select-filter/multi-select-filter.component';
import { RangeFilterComponent } from './range-filter/range-filter.component';
import { ReferenceTypesFiltersComponent } from './reference-types-filters.component';

const filters = [
  new FilterItemIdValue(
    'id1',
    [
      new IdValue('1', 'test1', false),
      new IdValue('2', 'test2', false),
      new IdValue('3', 'test3', false),
    ],
    false
  ),
  new FilterItemIdValue(
    'id2',
    [
      new IdValue('a', 'test4', false),
      new IdValue('b', 'test5', false),
      new IdValue('c', 'test6', false),
    ],
    false
  ),
  new FilterItemRange('filter1', 0, 500, undefined, undefined, 'xy'),
];

describe('ReferenceTypesFiltersComponent', () => {
  let component: ReferenceTypesFiltersComponent;
  let spectator: Spectator<ReferenceTypesFiltersComponent>;
  let mockStore: MockStore;

  const createComponent = createComponentFactory({
    component: ReferenceTypesFiltersComponent,
    imports: [
      ReactiveComponentModule,
      MatButtonModule,
      MatIconModule,
      MatTooltipModule,
      provideTranslocoTestingModule({ en: {} }),
    ],
    declarations: [
      MockComponent(RangeFilterComponent),
      MockComponent(MultiSelectFilterComponent),
    ],
    providers: [
      provideMockStore({
        initialState: {
          search: {},
        },
        selectors: [
          { selector: getFilters, value: filters },
          { selector: getAutocompleteLoading, value: true },
          { selector: getTooManyResults, value: false },
          { selector: getSelectedFilters, value: [] },
        ],
      }),
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
      },
    ],
    disableAnimations: true,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    mockStore = spectator.inject(MockStore);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should dispatch action loadInitialFilters when filters are empty', () => {
      mockStore.dispatch = jest.fn();

      component.ngOnInit();
      expect(mockStore.dispatch).not.toHaveBeenCalledWith(loadInitialFilters());

      mockStore.overrideSelector(getFilters, []);
      component.ngOnInit();
      expect(mockStore.dispatch).toHaveBeenCalledWith(loadInitialFilters());
    });
  });

  describe('updateFilter', () => {
    it('should dispatch action updateFilter', () => {
      mockStore.dispatch = jest.fn();
      const filter: FilterItemRange = new FilterItemRange(
        'name',
        0,
        100,
        20,
        80,
        'mm'
      );

      component.updateFilter(filter);

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        updateFilter({ item: filter })
      );
    });
  });

  describe('autocomplete', () => {
    it('should dispatch autocomplete action', () => {
      mockStore.dispatch = jest.fn();
      const textSearch = new TextSearch('name', 'Hans');

      component.autocomplete(textSearch);

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        autocomplete({ textSearch })
      );
    });
  });

  describe('search', () => {
    test('should dispatch search action', () => {
      mockStore.dispatch = jest.fn();

      component.search();

      expect(mockStore.dispatch).toHaveBeenCalledWith(search());
    });
  });

  describe('reset', () => {
    test('should dispatch reset action', () => {
      mockStore.dispatch = jest.fn();

      component.resetFilters();

      expect(mockStore.dispatch).toHaveBeenCalledWith(resetFilters());
    });
  });

  describe('trackByFn', () => {
    test('should return index', () => {
      const filter = new FilterItemIdValue('test', [], true, false);

      const result = component.trackByFn(undefined, filter);

      expect(result).toEqual(filter.name);
    });
  });
});
