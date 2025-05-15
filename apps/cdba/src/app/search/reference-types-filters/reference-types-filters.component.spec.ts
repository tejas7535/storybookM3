import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockComponent } from 'ng-mocks';

import { StringOption } from '@schaeffler/inputs';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { BetaFeatureService } from '@cdba/shared/services/beta-feature/beta-feature.service';

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
  FilterItemType,
} from '../../core/store/reducers/search/models';
import {
  getChangedFilters,
  getFilters,
  getTooManyResults,
  getTooManyResultsThreshold,
} from '../../core/store/selectors/search/search.selector';
import { MultiSelectFilterComponent } from './multi-select-filter/multi-select-filter.component';
import { RangeFilterComponent } from './range-filter/range-filter.component';
import { ReferenceTypesFiltersComponent } from './reference-types-filters.component';

const filters = [
  new FilterItemIdValue(
    'id1',
    [
      { id: '1', title: 'test1' } as StringOption,
      { id: '2', title: 'test2' } as StringOption,
      { id: '3', title: 'test3' } as StringOption,
    ],
    [],
    false,
    false
  ),
  new FilterItemIdValue(
    'id2',
    [
      { id: 'a', title: 'test4' } as StringOption,
      { id: 'b', title: 'test5' } as StringOption,
      { id: 'c', title: 'test6' } as StringOption,
    ],
    [],
    false,
    false
  ),
  new FilterItemRange('filter1', 0, 500, undefined, undefined, 'xy', false),
];

describe('ReferenceTypesFiltersComponent', () => {
  let component: ReferenceTypesFiltersComponent;
  let spectator: Spectator<ReferenceTypesFiltersComponent>;
  let mockStore: MockStore;

  const createComponent = createComponentFactory({
    component: ReferenceTypesFiltersComponent,
    imports: [
      PushPipe,
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
      mockProvider(BetaFeatureService),
      provideMockStore({
        initialState: {
          search: {},
        },
        selectors: [
          { selector: getFilters, value: filters },
          { selector: getTooManyResults, value: false },
          { selector: getTooManyResultsThreshold, value: 500 },
          { selector: getChangedFilters, value: [] },
        ],
      }),
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
        'mm',
        false
      );

      component.updateFilter(filter);

      expect(mockStore.dispatch).toHaveBeenCalledWith(updateFilter({ filter }));
    });
  });

  describe('autocomplete', () => {
    it('should dispatch autocomplete action', () => {
      mockStore.dispatch = jest.fn();

      component.autocomplete({
        searchFor: 'searchFor',
        filter: { name: 'filterName', type: FilterItemType.ID_VALUE },
      });

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        autocomplete({
          searchFor: 'searchFor',
          filter: { name: 'filterName', type: FilterItemType.ID_VALUE },
        })
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
});
