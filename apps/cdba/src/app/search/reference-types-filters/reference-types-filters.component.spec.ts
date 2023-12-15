import { MatButtonModule } from '@angular/material/button';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { PushModule } from '@ngrx/component';
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
  getFiltersWithoutLimit,
  getTooManyResults,
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
  new FilterItemRange(
    'filter1',
    0,
    500,
    undefined,
    undefined,
    'xy',
    false,
    false
  ),
];

describe('ReferenceTypesFiltersComponent', () => {
  let component: ReferenceTypesFiltersComponent;
  let spectator: Spectator<ReferenceTypesFiltersComponent>;
  let mockStore: MockStore;
  let betaFeatureService: BetaFeatureService;

  const createComponent = createComponentFactory({
    component: ReferenceTypesFiltersComponent,
    imports: [
      PushModule,
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
          { selector: getFiltersWithoutLimit, value: filters },
          { selector: getTooManyResults, value: false },
          { selector: getChangedFilters, value: [] },
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
    betaFeatureService = spectator.inject(BetaFeatureService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should get filters based on BetaFeature.LIMIT_FILTER state', () => {
      jest.spyOn(mockStore, 'select');
      betaFeatureService.getBetaFeature = jest.fn(() => true);

      component.ngOnInit();

      expect(mockStore.select).toHaveBeenCalledWith(getFilters);

      betaFeatureService.getBetaFeature = jest.fn(() => false);
      component.ngOnInit();

      expect(mockStore.select).toHaveBeenCalledWith(getFiltersWithoutLimit);
    });

    it('should dispatch action loadInitialFilters when filters are empty', () => {
      mockStore.dispatch = jest.fn();
      component.LIMIT_FILTER_ENABLED = false;

      component.ngOnInit();
      expect(mockStore.dispatch).not.toHaveBeenCalledWith(loadInitialFilters());

      mockStore.overrideSelector(getFiltersWithoutLimit, []);
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
        false,
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

  describe('trackByFn', () => {
    test('should return index', () => {
      const filter = new FilterItemIdValue('test', [], [], true, false);

      const result = component.trackByFn(undefined, filter);

      expect(result).toEqual(filter.name);
    });
  });
});
