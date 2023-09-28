import { MatExpansionModule } from '@angular/material/expansion';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { of } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoService } from '@ngneat/transloco';
import { PushPipe } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles/marbles';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import * as en from '../../assets/i18n/en.json';
import {
  benchmarkFilterSelected,
  dimensionSelected,
  filterSelected,
  loadFilterBenchmarkDimensionData,
  loadFilterDimensionData,
} from '../core/store/actions';
import {
  getBeautifiedFilterValues,
  getBenchmarkDimensionDataLoading,
  getSelectedDimensionFilter,
  getSelectedDimensionIdValue,
  getSelectedTimePeriod,
  getSelectedTimeRange,
  getTimePeriods,
} from '../core/store/selectors';
import { DimensionFilterModule } from '../shared/dimension-filter/dimension-filter.module';
import { DimensionFilterTranslation } from '../shared/dimension-filter/models';
import { FilterModule } from '../shared/filter/filter.module';
import {
  Filter,
  FilterDimension,
  IdValue,
  SelectedFilter,
  TimePeriod,
} from '../shared/models';
import { FilterSectionComponent } from './filter-section.component';

describe('FilterSectionComponent', () => {
  let component: FilterSectionComponent;
  let spectator: Spectator<FilterSectionComponent>;
  let store: MockStore;
  let transloco: TranslocoService;

  const createComponent = createComponentFactory({
    component: FilterSectionComponent,
    imports: [
      NoopAnimationsModule,
      PushPipe,
      MatExpansionModule,
      FilterModule,
      DimensionFilterModule,
      provideTranslocoTestingModule({ en }),
    ],
    providers: [
      provideMockStore({
        initialState: {
          filter: {
            orgUnits: {
              loading: false,
              items: [],
              errorMessage: undefined,
            },
            timePeriods: [],
            selectedFilters: {
              ids: [],
              entities: {},
            },
          },
        },
      }),
    ],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    store = spectator.inject(MockStore);
    transloco = spectator.inject(TranslocoService);
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    test(
      'should set availableDimensions',
      marbles((m) => {
        const expected: IdValue[] = [
          { id: 'ORG_UNIT', level: 0, value: undefined },
          { id: 'REGION', level: 0, value: undefined },
          { id: 'SUB_REGION', level: 1, value: undefined },
          { id: 'COUNTRY', level: 2, value: undefined },
          { id: 'BOARD', level: 0, value: undefined },
          { id: 'SUB_BOARD', level: 1, value: undefined },
          { id: 'FUNCTION', level: 2, value: undefined },
          { id: 'SUB_FUNCTION', level: 3, value: undefined },
          { id: 'SEGMENT', level: 0, value: undefined },
          { id: 'SUB_SEGMENT', level: 1, value: undefined },
          { id: 'SEGMENT_UNIT', level: 2, value: undefined },
        ];
        transloco.translateObject = jest.fn().mockReturnValue(of(expected));

        component.ngOnInit();

        m.expect(component.availableDimensions$).toBeObservable(
          m.cold('a', { a: expected })
        );
      })
    );

    test(
      'should set orgUnitsFilter',
      marbles((m) => {
        const result = new Filter(FilterDimension.ORG_UNIT, []);
        store.overrideSelector(getSelectedDimensionFilter, result);
        component.ngOnInit();

        m.expect(component.selectedDimensionFilter$).toBeObservable(
          m.cold('a', { a: result })
        );
      })
    );

    test(
      'should set benchmarkDimensionDataLoading',
      marbles((m) => {
        const result = true;
        store.overrideSelector(getBenchmarkDimensionDataLoading, result);
        component.ngOnInit();

        m.expect(component.benchmarkDimensionDataLoading$).toBeObservable(
          m.cold('a', { a: result })
        );
      })
    );

    test(
      'should set timePeriods',
      marbles((m) => {
        const result: IdValue[] = [];
        store.overrideSelector(getTimePeriods, result);
        component.ngOnInit();

        m.expect(component.timePeriods$).toBeObservable(
          m.cold('a', { a: result })
        );
      })
    );

    test(
      'should set selectedTimePeriod',
      marbles((m) => {
        const result = TimePeriod.YEAR;
        store.overrideSelector(getSelectedTimePeriod, result);
        component.ngOnInit();

        m.expect(component.selectedTimePeriod$).toBeObservable(
          m.cold('a', { a: result })
        );
      })
    );

    test(
      'should set selectedOrgUnit',
      marbles((m) => {
        const result = {
          id: 'Org123',
          value: 'Org123',
        };
        store.overrideSelector(getSelectedDimensionIdValue, result);
        component.ngOnInit();

        m.expect(component.selectedDimensionIdValue$).toBeObservable(
          m.cold('a', { a: result })
        );
        expect(component.selectedTime$).toBeDefined();
      })
    );

    test(
      'should set selectedTime',
      marbles((m) => {
        const result = {
          id: '1-2',
          value: 'Nice',
        };
        store.overrideSelector(getSelectedTimeRange, result);
        component.ngOnInit();

        m.expect(component.selectedTime$).toBeObservable(
          m.cold('a', { a: result })
        );
      })
    );

    test(
      'should set selectedFilterValues',
      marbles((m) => {
        const result = {
          value: 'Offenbach',
          timeRange: '01.01.2019 - 01.03.2019',
          filterDimension: 'ORG UNIT',
        };
        store.overrideSelector(getBeautifiedFilterValues, result);
        component.ngOnInit();

        m.expect(component.selectedFilterValues$).toBeObservable(
          m.cold('a', { a: result })
        );
      })
    );
  });

  describe('onBenchmarkDimensionSelected', () => {
    test('should dispatch loadFilterBenchmarkDimensionData action', () => {
      const filter: IdValue = { id: 'BOARD', value: 'b' };
      const filterDimension = FilterDimension.BOARD;
      store.dispatch = jest.fn();

      component.onBenchmarkDimensionSelected(filter);

      expect(store.dispatch).toHaveBeenCalledWith(
        loadFilterBenchmarkDimensionData({ filterDimension })
      );
    });
  });

  describe('filterSelected', () => {
    test('should dispatch filterSelected action', () => {
      const filter = new SelectedFilter('test', undefined);
      store.dispatch = jest.fn();

      component.filterSelected(filter);

      expect(store.dispatch).toHaveBeenCalledWith(filterSelected({ filter }));
    });
  });

  describe('timePeriodSelected', () => {
    test('should dispatch timePeriodSelected action', () => {
      store.dispatch = jest.fn();
      component.timePeriodSelected(TimePeriod.YEAR);

      expect(store.dispatch).toHaveBeenCalledWith({
        timePeriod: TimePeriod.YEAR,
        type: '[Filter] Time period selected',
      });
    });
  });

  describe('expansionPanelToggled', () => {
    test('should set isExpanded', () => {
      component.isExpanded = true;

      component.expansionPanelToggled(false);

      expect(component.isExpanded).toBeFalsy();
    });
  });

  describe('onDimensionAutocompleteInput', () => {
    test('should dispatch loadFilterDimensionData action', () => {
      store.dispatch = jest.fn();
      const searchFor = 'search';

      component.onDimensionAutocompleteInput(searchFor);

      expect(store.dispatch).toHaveBeenCalledWith(
        loadFilterDimensionData({
          filterDimension: FilterDimension.ORG_UNIT,
          searchFor,
        })
      );
    });
  });

  describe('onDimensionSelected', () => {
    test('should return selected dimension', () => {
      const dimension = {
        id: FilterDimension.COUNTRY,
        value: 'Germany',
      };

      store.dispatch = jest.fn();

      component.onDimensionSelected(dimension);

      expect(store.dispatch).toHaveBeenCalledWith(
        loadFilterDimensionData({ filterDimension: FilterDimension.COUNTRY })
      );
    });
  });

  describe('onBenchmarkAutocompleteInput', () => {
    test('should dispatch loadFilterBenchmarkDimensionData action', () => {
      store.dispatch = jest.fn();
      const filterDimension = FilterDimension.ORG_UNIT;
      const searchFor = 'abc';

      component.onBenchmarkAutocompleteInput(searchFor);

      expect(store.dispatch).toHaveBeenCalledWith(
        loadFilterBenchmarkDimensionData({ filterDimension, searchFor })
      );
    });
  });

  describe('onBenchmarkOptionSelected', () => {
    test('should dispatch benchmarkFilterSelected action', () => {
      store.dispatch = jest.fn();
      const selectedFilter: SelectedFilter = {
        idValue: { id: 'a', value: 'b' },
        name: 'filter',
      };

      component.onBenchmarkOptionSelected(selectedFilter);

      expect(store.dispatch).toHaveBeenCalledWith(
        benchmarkFilterSelected({ filter: selectedFilter })
      );
    });
  });

  describe('triggerDimensionDataClear', () => {
    test('should dispatch dimensionSelected action', () => {
      store.dispatch = jest.fn();

      component.triggerDimensionDataClear();

      expect(store.dispatch).toHaveBeenCalledWith(dimensionSelected());
    });
  });

  describe('mapTranslationsToIdValues', () => {
    test('should map translations to id value filter dimensions', () => {
      const translations = {
        [FilterDimension.ORG_UNIT]: 'org unit',
        [FilterDimension.REGION]: 'region',
        [FilterDimension.SUB_REGION]: 'sub region',
        [FilterDimension.COUNTRY]: 'country',
        [FilterDimension.BOARD]: 'board',
        [FilterDimension.SUB_BOARD]: 'sub board',
        [FilterDimension.FUNCTION]: 'function',
        [FilterDimension.SUB_FUNCTION]: 'sub function',
        [FilterDimension.SEGMENT]: 'segment',
        [FilterDimension.SUB_SEGMENT]: 'sub segment',
        [FilterDimension.SEGMENT_UNIT]: 'segment unit',
      };

      const result = component.mapTranslationsToIdValues(translations);

      expect(result.length).toBe(11);
      expect(result[0]).toEqual(
        new IdValue(
          FilterDimension.ORG_UNIT,
          translations[FilterDimension.ORG_UNIT],
          0
        )
      );
      expect(result[1]).toEqual(
        new IdValue(
          FilterDimension.REGION,
          translations[FilterDimension.REGION],
          0
        )
      );
      expect(result[2]).toEqual(
        new IdValue(
          FilterDimension.SUB_REGION,
          translations[FilterDimension.SUB_REGION],
          1
        )
      );
      expect(result[3]).toEqual(
        new IdValue(
          FilterDimension.COUNTRY,
          translations[FilterDimension.COUNTRY],
          2
        )
      );
      expect(result[4]).toEqual(
        new IdValue(
          FilterDimension.BOARD,
          translations[FilterDimension.BOARD],
          0
        )
      );
      expect(result[5]).toEqual(
        new IdValue(
          FilterDimension.SUB_BOARD,
          translations[FilterDimension.SUB_BOARD],
          1
        )
      );
      expect(result[6]).toEqual(
        new IdValue(
          FilterDimension.FUNCTION,
          translations[FilterDimension.FUNCTION],
          2
        )
      );
      expect(result[7]).toEqual(
        new IdValue(
          FilterDimension.SUB_FUNCTION,
          translations[FilterDimension.SUB_FUNCTION],
          3
        )
      );
      expect(result[8]).toEqual(
        new IdValue(
          FilterDimension.SEGMENT,
          translations[FilterDimension.SEGMENT],
          0
        )
      );
      expect(result[9]).toEqual(
        new IdValue(
          FilterDimension.SUB_SEGMENT,
          translations[FilterDimension.SUB_SEGMENT],
          1
        )
      );
      expect(result[10]).toEqual(
        new IdValue(
          FilterDimension.SEGMENT_UNIT,
          translations[FilterDimension.SEGMENT_UNIT],
          2
        )
      );
    });

    test(
      'should set dimensionFilterTranslation',
      marbles((m) => {
        const expected = new DimensionFilterTranslation(
          'select dimension',
          'dimension',
          'please select one'
        );
        transloco.translateObject = jest.fn().mockReturnValue(expected);

        component.ngOnInit();

        m.expect(component.dimensionFilterTranslation$).toBeObservable(
          m.cold('a', { a: expected })
        );
      })
    );

    test(
      'should set benchmarkDimensionFilterTranslation',
      marbles((m) => {
        const expected = new DimensionFilterTranslation(
          'select dimension',
          'dimension',
          'please select one'
        );
        transloco.translateObject = jest.fn().mockReturnValue(expected);

        component.ngOnInit();

        m.expect(component.benchmarkDimensionFilterTranslation$).toBeObservable(
          m.cold('a', { a: expected })
        );
      })
    );
  });
});
