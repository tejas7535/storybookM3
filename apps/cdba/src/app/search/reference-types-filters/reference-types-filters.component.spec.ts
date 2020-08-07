import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { configureTestSuite } from 'ng-bullet';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import {
  autocomplete,
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
  getIsDirty,
  getSearchSuccessful,
  getTooManyResults,
} from '../../core/store/selectors/search/search.selector';
import { SharedModule } from '../../shared/shared.module';
import { MultiSelectFilterComponent } from './multi-select-filter/multi-select-filter.component';
import { FormatValuePipe } from './multi-select-filter/pipes/format-value.pipe';
import { MultiSelectValuePipe } from './multi-select-filter/pipes/multi-select-value.pipe';
import { NoResultsFoundPipe } from './multi-select-filter/pipes/no-results-found.pipe';
import { RangeFilterValuePipe } from './range-filter/range-filter-value.pipe';
import { RangeFilterComponent } from './range-filter/range-filter.component';
import { ReferenceTypesFiltersComponent } from './reference-types-filters.component';

describe('ReferenceTypesFiltersComponent', () => {
  let component: ReferenceTypesFiltersComponent;
  let fixture: ComponentFixture<ReferenceTypesFiltersComponent>;
  let mockStore: MockStore;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        ReferenceTypesFiltersComponent,
        RangeFilterComponent,
        MultiSelectFilterComponent,
        RangeFilterValuePipe,
        MultiSelectValuePipe,
        NoResultsFoundPipe,
        FormatValuePipe,
      ],
      imports: [
        NoopAnimationsModule,
        SharedModule,
        provideTranslocoTestingModule({}),
        FormsModule,
        MatButtonModule,
        MatIconModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatSliderModule,
        MatCheckboxModule,
        MatTooltipModule,
        MatProgressSpinnerModule,
      ],
      providers: [
        provideMockStore({
          initialState: {
            search: {},
          },
        }),
      ],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferenceTypesFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    mockStore = TestBed.inject(MockStore);
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

    mockStore.overrideSelector(getFilters, filters);
    mockStore.overrideSelector(getAutocompleteLoading, true);
    mockStore.overrideSelector(getSearchSuccessful, false);
    mockStore.overrideSelector(getTooManyResults, false);
    mockStore.overrideSelector(getIsDirty, true);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('updateFilter', () => {
    it('should disptach action updateFilter', () => {
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
