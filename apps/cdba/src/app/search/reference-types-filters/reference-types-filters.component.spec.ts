import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { configureTestSuite } from 'ng-bullet';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { search } from '../../core/store/actions/search/search.actions';
import {
  FilterItemIdValue,
  FilterItemRange,
  IdValue,
} from '../../core/store/reducers/search/models';
import {
  getPossibleFilters,
  getSelectedFilters,
} from '../../core/store/selectors/search/search.selector';
import { SharedModule } from '../../shared/shared.module';
import { MultiSelectFilterComponent } from './multi-select-filter/multi-select-filter.component';
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
    const possibleFilters = [
      new FilterItemIdValue('id1', [
        new IdValue('1', 'test1'),
        new IdValue('2', 'test2'),
        new IdValue('3', 'test3'),
      ]),
      new FilterItemIdValue('id2', [
        new IdValue('a', 'test4'),
        new IdValue('b', 'test5'),
        new IdValue('c', 'test6'),
      ]),
      new FilterItemRange('filter1', 0, 500),
    ];

    const selectedFilters = [
      new FilterItemIdValue('id2', [
        new IdValue('a', 'test4'),
        new IdValue('b', 'test5', true),
        new IdValue('c', 'test6'),
      ]),
      new FilterItemRange('filter1', 0, 500, 23, 300),
    ];
    mockStore.overrideSelector(getPossibleFilters, possibleFilters);
    mockStore.overrideSelector(getSelectedFilters, selectedFilters);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('selectIdValuesInFilter', () => {
    test('should set filters to true where selected filters match', () => {
      const item = new FilterItemIdValue('item', [
        new IdValue('1', 'test1'),
        new IdValue('2', 'test2'),
        new IdValue('3', 'test3'),
        new IdValue('4', 'test4'),
        new IdValue('5', 'test5'),
      ]);
      const selectedItem = new FilterItemIdValue('item', [
        new IdValue('1', 'test1', true),
        new IdValue('2', 'test2', true),
        new IdValue('3', 'test3', true),
        new IdValue('4', 'test4', true),
        new IdValue('5', 'test5', true),
      ]);

      ReferenceTypesFiltersComponent['selectIdValuesInFilter'](
        item,
        selectedItem
      );

      item.items.forEach((i) => expect(i.selected).toBeTruthy());
    });
  });

  describe('selectRangeInFilter', () => {
    test('should set selectedMin/selectedMax according to selected filter ', () => {
      const item = new FilterItemRange('filter1', 0, 500);

      const selectedItem = new FilterItemRange('filter1', 0, 500, 23, 70);

      ReferenceTypesFiltersComponent['selectRangeInFilter'](item, selectedItem);

      expect(item.maxSelected).toEqual(selectedItem.maxSelected);
      expect(item.minSelected).toEqual(selectedItem.minSelected);
    });
  });

  describe('mergePossibleAndSelectedFilters', () => {
    test('should return filter array with selected values', (done) => {
      const expected = [
        new FilterItemIdValue('id1', [
          new IdValue('1', 'test1'),
          new IdValue('2', 'test2'),
          new IdValue('3', 'test3'),
        ]),
        new FilterItemIdValue('id2', [
          new IdValue('a', 'test4'),
          new IdValue('b', 'test5', true),
          new IdValue('c', 'test6'),
        ]),
        new FilterItemRange('filter1', 0, 500, 23, 300),
      ];

      component.filters$.subscribe((val) => {
        expect(val).toEqual(expected);
        done();
      });

      component.mergePossibleAndSelectedFilters();
    });
  });

  describe('search', () => {
    test('should dispatch search action', () => {
      mockStore.dispatch = jest.fn();

      component.search();

      expect(mockStore.dispatch).toHaveBeenCalledWith(search());
    });
  });

  describe('trackByFn', () => {
    test('should return index', () => {
      const idx = 5;

      const result = component.trackByFn(idx, {});

      expect(result).toEqual(idx);
    });
  });
});
