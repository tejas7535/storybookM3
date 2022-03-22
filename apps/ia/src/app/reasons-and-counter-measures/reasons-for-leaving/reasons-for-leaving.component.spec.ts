import { MatCardModule } from '@angular/material/card';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { ReactiveComponentModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import {
  getOrgUnitsFilter,
  getSelectedOrgUnit,
  getSelectedTimePeriod,
  getSelectedTimeRange,
  getTimePeriods,
} from '../../core/store/selectors';
import { TimePeriod } from '../../shared/models';
import {
  comparedFilterSelected,
  comparedTimePeriodSelected,
  loadComparedOrgUnits,
  resetCompareMode,
} from '../store/actions/reasons-and-counter-measures.actions';
import {
  getComparedOrgUnitsFilter,
  getComparedReasonsChartConfig,
  getComparedReasonsChartData,
  getComparedReasonsTableData,
  getComparedSelectedOrgUnit,
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
      ReactiveComponentModule,
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
        store.overrideSelector(getOrgUnitsFilter, result);
        store.overrideSelector(getSelectedOrgUnit, result);
        store.overrideSelector(getTimePeriods, result);
        store.overrideSelector(getSelectedTimePeriod, result);
        store.overrideSelector(getSelectedTimeRange, result);
        store.overrideSelector(getReasonsChartData, result);
        store.overrideSelector(getReasonsTableData, result);
        store.overrideSelector(getReasonsLoading, result);
        store.overrideSelector(getComparedReasonsChartData, result);
        store.overrideSelector(getReasonsCombinedLegend, result);
        store.overrideSelector(getReasonsChartConfig, result);
        store.overrideSelector(getComparedReasonsChartConfig, result);
        store.overrideSelector(getComparedOrgUnitsFilter, result);
        store.overrideSelector(getComparedSelectedOrgUnit, result);
        store.overrideSelector(getComparedSelectedOrgUnitLoading, result);
        store.overrideSelector(getComparedSelectedTimePeriod, result);
        store.overrideSelector(getComparedSelectedTimeRange, result);
        store.overrideSelector(getComparedReasonsTableData, result);

        component.ngOnInit();

        m.expect(component.orgUnitsFilter$).toBeObservable(
          m.cold('a', {
            a: result,
          })
        );
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
});
