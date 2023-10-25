import { MatCardModule } from '@angular/material/card';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import {
  getSelectedDimensionFilter,
  getSelectedDimensionIdValue,
  getSelectedTimePeriod,
  getSelectedTimeRange,
  getTimePeriods,
} from '../../core/store/selectors';
import { FilterDimension, IdValue, TimePeriod } from '../../shared/models';
import {
  comparedFilterSelected,
  comparedTimePeriodSelected,
  loadComparedFilterDimensionData,
  loadComparedOrgUnits,
  resetCompareMode,
} from '../store/actions/reasons-and-counter-measures.actions';
import {
  getComparedOrgUnitsFilter,
  getComparedReasonsChartConfig,
  getComparedReasonsChartData,
  getComparedReasonsTableData,
  getComparedSelectedDimension,
  getComparedSelectedDimensionIdValue,
  getComparedSelectedOrgUnitLoading,
  getComparedSelectedTimePeriod,
  getComparedSelectedTimeRange,
  getReasonsChartConfig,
  getReasonsChartData,
  getReasonsCombinedLegend,
  getReasonsLoading,
  getReasonsTableData,
} from '../store/selectors/reasons-and-counter-measures.selector';
import { ReasonsForLeavingComponent } from './reasons-for-leaving.component';
import { ReasonsForLeavingTableModule } from './reasons-for-leaving-table/reasons-for-leaving-table.module';

describe('ReasonsForLeavingComponent', () => {
  let component: ReasonsForLeavingComponent;
  let spectator: Spectator<ReasonsForLeavingComponent>;
  let store: MockStore;

  const createComponent = createComponentFactory({
    component: ReasonsForLeavingComponent,
    detectChanges: false,
    imports: [
      provideTranslocoTestingModule({ en: {} }),
      MatCardModule,
      ReasonsForLeavingTableModule,
      PushPipe,
    ],
    providers: [
      provideMockStore({}),
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    store = spectator.inject(MockStore);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    test(
      'should initialize observables from store',
      marbles((m) => {
        const result = 'a' as any;
        store.overrideSelector(getSelectedDimensionIdValue, result);
        store.overrideSelector(getTimePeriods, result);
        store.overrideSelector(getSelectedTimePeriod, result);
        store.overrideSelector(getSelectedTimeRange, result);
        store.overrideSelector(getReasonsChartData, result);
        store.overrideSelector(getComparedReasonsChartData, result);
        store.overrideSelector(getReasonsTableData, result);
        store.overrideSelector(getReasonsCombinedLegend, result);
        store.overrideSelector(getReasonsChartConfig, result);
        store.overrideSelector(getReasonsLoading, result);
        store.overrideSelector(getComparedReasonsChartConfig, result);
        store.overrideSelector(getComparedSelectedDimension, result);
        store.overrideSelector(getSelectedDimensionFilter, result);
        store.overrideSelector(getComparedOrgUnitsFilter, result);
        store.overrideSelector(getComparedSelectedDimensionIdValue, result);
        store.overrideSelector(getComparedSelectedOrgUnitLoading, result);
        store.overrideSelector(getComparedSelectedTimePeriod, result);
        store.overrideSelector(getComparedSelectedTimeRange, result);
        store.overrideSelector(getComparedReasonsTableData, result);

        component.ngOnInit();

        m.expect(component.selectedOrgUnit$).toBeObservable(
          m.cold('a', {
            a: result,
          })
        );
        m.expect(component.timePeriods$).toBeObservable(
          m.cold('a', {
            a: result,
          })
        );
        m.expect(component.selectedTimePeriod$).toBeObservable(
          m.cold('a', {
            a: result,
          })
        );
        m.expect(component.selectedTime$).toBeObservable(
          m.cold('a', {
            a: result,
          })
        );
        m.expect(component.reasonsChartData$).toBeObservable(
          m.cold('a', {
            a: result,
          })
        );
        m.expect(component.comparedReasonsChartData$).toBeObservable(
          m.cold('a', {
            a: result,
          })
        );
        m.expect(component.reasonsChartConfig$).toBeObservable(
          m.cold('a', {
            a: result,
          })
        );
        m.expect(component.reasonsTableData$).toBeObservable(
          m.cold('a', {
            a: result,
          })
        );
        m.expect(component.reasonsLoading$).toBeObservable(
          m.cold('a', {
            a: result,
          })
        );
        m.expect(component.comparedReasonsChartConfig$).toBeObservable(
          m.cold('a', {
            a: result,
          })
        );
        m.expect(component.comparedOrgUnitsFilter$).toBeObservable(
          m.cold('a', {
            a: result,
          })
        );
        m.expect(component.comparedSelectedOrgUnit$).toBeObservable(
          m.cold('a', {
            a: result,
          })
        );
        m.expect(component.comparedSelectedOrgUnitLoading$).toBeObservable(
          m.cold('a', {
            a: result,
          })
        );
        m.expect(component.comparedSelectedTimePeriod$).toBeObservable(
          m.cold('a', {
            a: result,
          })
        );
        m.expect(component.comparedSelectedTime$).toBeObservable(
          m.cold('a', {
            a: result,
          })
        );
        m.expect(component.comparedReasonsTableData$).toBeObservable(
          m.cold('a', {
            a: result,
          })
        );
      })
    );
  });

  describe('comparedFilterSelected', () => {
    test('should dispatch comparedFilterSelected action', () => {
      store.dispatch = jest.fn();
      const filter = {
        name: 'orgUnit',
        idValue: {
          id: 'Schaeffler_HR',
          value: 'Schaeffler_HR',
        },
      };

      component.comparedFilterSelected(filter);

      expect(store.dispatch).toHaveBeenCalledWith(
        comparedFilterSelected({
          filter,
        })
      );
    });
  });

  describe('comparedTimePeriodSelected', () => {
    test('should dispatch changeComparedTimePeriod action', () => {
      store.dispatch = jest.fn();
      const timePeriod = TimePeriod.LAST_THREE_YEARS;

      component.comparedTimePeriodSelected(timePeriod);

      expect(store.dispatch).toHaveBeenCalledWith(
        comparedTimePeriodSelected({
          timePeriod,
        })
      );
    });
  });

  describe('comparedAutoCompleteOrgUnitsChange', () => {
    test('should dispatch loadComparedOrgUnits action', () => {
      store.dispatch = jest.fn();
      const searchFor = 'search';

      component.comparedAutoCompleteOrgUnitsChange(searchFor);

      expect(store.dispatch).toHaveBeenCalledWith(
        loadComparedOrgUnits({
          searchFor,
        })
      );
    });
  });

  describe('resetCompareMode', () => {
    test('should dispatch resetCompareMode action', () => {
      store.dispatch = jest.fn();

      component.resetCompareMode();

      expect(store.dispatch).toHaveBeenCalledWith(resetCompareMode());
    });
  });

  describe('getOrgUnitShortName', () => {
    test('should get short name', () => {
      const orgUnitName = 'SH/ZHZ (Human Resources)';

      const shortName = component.getOrgUnitShortName(orgUnitName);

      expect(shortName).toEqual('SH/ZHZ');
    });

    test('should return undefined when name undefined', () => {
      const result = component.getOrgUnitShortName(undefined as string);

      expect(result).toBeUndefined();
    });
  });

  describe('comparedDimensionSelected', () => {
    test('should dispatch loadComparedFilterDimensionData action', () => {
      const filterDimension = FilterDimension.ORG_UNIT;
      const idValue = new IdValue(filterDimension, '123');
      store.dispatch = jest.fn();

      component.comparedDimensionSelected(idValue);

      expect(store.dispatch).toHaveBeenCalledWith(
        loadComparedFilterDimensionData({ filterDimension })
      );
    });
  });

  describe('mapTranslationsToIdValues', () => {
    test('should map translations to id values', () => {
      const translations = {
        [FilterDimension.ORG_UNIT]: 'org unit',
        [FilterDimension.PERSONAL_AREA]: 'personal area',
        [FilterDimension.REGION]: 'region',
        [FilterDimension.SUB_REGION]: 'sub region',
        [FilterDimension.COUNTRY]: 'country',
        [FilterDimension.HR_LOCATION]: 'hr location',
        [FilterDimension.BOARD]: 'board',
        [FilterDimension.SUB_BOARD]: 'sub board',
        [FilterDimension.FUNCTION]: 'function',
        [FilterDimension.SUB_FUNCTION]: 'sub function',
        [FilterDimension.SEGMENT]: 'segment',
        [FilterDimension.SUB_SEGMENT]: 'sub segment',
        [FilterDimension.SEGMENT_UNIT]: 'segment unit',
      };

      const result = component.mapTranslationsToIdValues(translations);

      expect(result.length).toBe(13);
      expect(result[0]).toEqual(
        new IdValue(
          FilterDimension.ORG_UNIT,
          translations[FilterDimension.ORG_UNIT],
          0
        )
      );
      expect(result[1]).toEqual(
        new IdValue(
          FilterDimension.PERSONAL_AREA,
          translations[FilterDimension.PERSONAL_AREA],
          0
        )
      );
      expect(result[2]).toEqual(
        new IdValue(
          FilterDimension.REGION,
          translations[FilterDimension.REGION],
          0
        )
      );
      expect(result[3]).toEqual(
        new IdValue(
          FilterDimension.SUB_REGION,
          translations[FilterDimension.SUB_REGION],
          1
        )
      );
      expect(result[4]).toEqual(
        new IdValue(
          FilterDimension.COUNTRY,
          translations[FilterDimension.COUNTRY],
          2
        )
      );
      expect(result[5]).toEqual(
        new IdValue(
          FilterDimension.HR_LOCATION,
          translations[FilterDimension.HR_LOCATION],
          3
        )
      );
      expect(result[6]).toEqual(
        new IdValue(
          FilterDimension.BOARD,
          translations[FilterDimension.BOARD],
          0
        )
      );
      expect(result[7]).toEqual(
        new IdValue(
          FilterDimension.SUB_BOARD,
          translations[FilterDimension.SUB_BOARD],
          1
        )
      );
      expect(result[8]).toEqual(
        new IdValue(
          FilterDimension.FUNCTION,
          translations[FilterDimension.FUNCTION],
          2
        )
      );
      expect(result[9]).toEqual(
        new IdValue(
          FilterDimension.SUB_FUNCTION,
          translations[FilterDimension.SUB_FUNCTION],
          3
        )
      );
      expect(result[10]).toEqual(
        new IdValue(
          FilterDimension.SEGMENT,
          translations[FilterDimension.SEGMENT],
          0
        )
      );
      expect(result[11]).toEqual(
        new IdValue(
          FilterDimension.SUB_SEGMENT,
          translations[FilterDimension.SUB_SEGMENT],
          1
        )
      );
      expect(result[12]).toEqual(
        new IdValue(
          FilterDimension.SEGMENT_UNIT,
          translations[FilterDimension.SEGMENT_UNIT],
          2
        )
      );
    });
  });
});
