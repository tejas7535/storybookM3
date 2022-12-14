import { MatExpansionModule } from '@angular/material/expansion';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles/marbles';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import * as en from '../../assets/i18n/en.json';
import { filterSelected, loadFilterDimensionData } from '../core/store/actions';
import {
  getOrgUnitsLoading,
  getSelectedDimensionFilter,
  getSelectedDimensionIdValue,
  getSelectedFilterValues,
  getSelectedTimePeriod,
  getSelectedTimeRange,
  getTimePeriods,
} from '../core/store/selectors';
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

  const createComponent = createComponentFactory({
    component: FilterSectionComponent,
    imports: [
      NoopAnimationsModule,
      PushModule,
      MatExpansionModule,
      FilterModule,
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
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
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
      'should set orgUnitsLoading',
      marbles((m) => {
        const result = true;
        store.overrideSelector(getOrgUnitsLoading, result);
        component.ngOnInit();

        m.expect(component.orgUnitsLoading$).toBeObservable(
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
        const result = ['Offenbach', '01.01.2019 - 01.03.2019'];
        store.overrideSelector(getSelectedFilterValues, result);
        component.ngOnInit();

        m.expect(component.selectedFilterValues$).toBeObservable(
          m.cold('a', { a: result })
        );
      })
    );
  });

  describe('filterSelected', () => {
    test('should dispatch action', () => {
      const filter = new SelectedFilter('test', undefined);
      store.dispatch = jest.fn();

      component.filterSelected(filter);

      expect(store.dispatch).toHaveBeenCalledWith(filterSelected({ filter }));
    });
  });

  describe('timePeriodSelected', () => {
    test('should dispatch timePeriodSelected', () => {
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

  describe('autoCompleteOrgUnitsChange', () => {
    test('should dispatch loadOrgUnits action', () => {
      store.dispatch = jest.fn();
      const searchFor = 'search';
      component.autoCompleteOrgUnitsChange(searchFor);

      expect(store.dispatch).toHaveBeenCalledWith(
        loadFilterDimensionData({
          filterDimension: FilterDimension.ORG_UNIT,
          searchFor,
        })
      );
    });
  });

  describe('dimensionSelected', () => {
    test('should return selected dimension', () => {
      const dimension = {
        id: FilterDimension.COUNTRY,
        value: 'Germany',
      };

      store.dispatch = jest.fn();

      component.dimensionSelected(dimension);

      expect(store.dispatch).toHaveBeenCalledWith(
        loadFilterDimensionData({ filterDimension: FilterDimension.COUNTRY })
      );
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
  });
});
