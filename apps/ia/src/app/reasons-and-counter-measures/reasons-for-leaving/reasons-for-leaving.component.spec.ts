import { MatCardModule } from '@angular/material/card';

import { marbles } from 'rxjs-marbles/jest';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { ReactiveComponentModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import {
  getOrgUnits,
  getSelectedOrgUnit,
  getSelectedTimePeriod,
  getSelectedTimeRange,
  getTimePeriods,
} from '../../core/store/selectors';
import { IdValue, SelectedFilter, TimePeriod } from '../../shared/models';
import {
  changeComparedFilter,
  changeComparedTimePeriod,
  changeComparedTimeRange,
} from '../store/actions/reasons-and-counter-measures.actions';
import {
  getComparedReasonsChartConfig,
  getComparedReasonsChartData,
  getComparedReasonsTableData,
  getComparedSelectedOrgUnit,
  getComparedSelectedTimePeriod,
  getComparedSelectedTimeRange,
  getReasonsChartConfig,
  getReasonsChartData,
  getReasonsLoading,
  getReasonsTableData,
} from '../store/selectors/reasons-and-counter-measures.selector';
import { ReasonsForLeavingTableModule } from './reasons-for-leaving-table/reasons-for-leaving-table.module';
import { ReasonsForLeavingComponent } from './reasons-for-leaving.component';

describe('ReasonsForLeavingComponent', () => {
  let component: ReasonsForLeavingComponent;
  let spectator: Spectator<ReasonsForLeavingComponent>;
  let store: MockStore;

  const createComponent = createComponentFactory({
    component: ReasonsForLeavingComponent,
    imports: [
      provideTranslocoTestingModule({ en: {} }),
      MatCardModule,
      ReasonsForLeavingTableModule,
      ReactiveComponentModule,
    ],
    providers: [provideMockStore({})],
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
    test('should initialize observables', () => {
      component.ngOnInit();

      expect(component.orgUnits$).toBeDefined();
      expect(component.selectedOrgUnit$).toBeDefined();
      expect(component.timePeriods$).toBeDefined();
      expect(component.selectedTimePeriod$).toBeDefined();
      expect(component.selectedTime$).toBeDefined();
      expect(component.comparedSelectedOrgUnit$).toBeDefined();
      expect(component.comparedSelectedTimePeriod$).toBeDefined();
      expect(component.comparedSelectedTime$).toBeDefined();
    });
  });

  test(
    'should initialize observables from store',
    marbles((m) => {
      const result = 'a' as any;
      store.overrideSelector(getOrgUnits, result);
      store.overrideSelector(getSelectedOrgUnit, result);
      store.overrideSelector(getTimePeriods, result);
      store.overrideSelector(getSelectedTimePeriod, result);
      store.overrideSelector(getSelectedTimeRange, result);
      store.overrideSelector(getComparedSelectedOrgUnit, result);
      store.overrideSelector(getComparedSelectedTimePeriod, result);
      store.overrideSelector(getComparedSelectedTimeRange, result);
      store.overrideSelector(getReasonsChartConfig, result);
      store.overrideSelector(getReasonsChartData, result);
      store.overrideSelector(getReasonsLoading, result);
      store.overrideSelector(getReasonsTableData, result);
      store.overrideSelector(getComparedReasonsTableData, result);
      store.overrideSelector(getComparedReasonsChartConfig, result);
      store.overrideSelector(getComparedReasonsChartData, result);

      component.ngOnInit();

      m.expect(component.orgUnits$).toBeObservable(
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
      m.expect(component.comparedSelectedOrgUnit$).toBeObservable(
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
      m.expect(component.reasonsChartConfig$).toBeObservable(
        m.cold('a', {
          a: result,
        })
      );
      m.expect(component.reasonsChartData$).toBeObservable(
        m.cold('a', {
          a: result,
        })
      );
      m.expect(component.comparedReasonsTableData$).toBeObservable(
        m.cold('a', {
          a: result,
        })
      );
      m.expect(component.comparedReasonsChartConfig$).toBeObservable(
        m.cold('a', {
          a: result,
        })
      );
      m.expect(component.comparedReasonsChartData$).toBeObservable(
        m.cold('a', {
          a: result,
        })
      );
    })
  );

  describe('orgUnitInvalid', () => {
    test('should set comparedDisabledTimeRangeFilter', () => {
      component.orgUnitInvalid(true);

      expect(component.comparedDisabledTimeRangeFilter).toBeTruthy();
    });
  });

  describe('comparedOptionSelected', () => {
    test('should dispatch changeComparedFilter action', () => {
      store.dispatch = jest.fn();
      const selectedFilter = {
        name: 'orgUnit',
        value: 'Schaeffler_HR',
      } as SelectedFilter;

      component.comparedOptionSelected(selectedFilter);

      expect(store.dispatch).toHaveBeenCalledWith(
        changeComparedFilter({
          comparedSelectedOrgUnit: selectedFilter.value.toString(),
        })
      );
    });
  });

  describe('comparedTimePeriodSelected', () => {
    test('should dispatch changeComparedTimePeriod action', () => {
      store.dispatch = jest.fn();
      const idValue: IdValue = { id: '1', value: 'orgUnit' };

      component.comparedTimePeriodSelected(idValue);

      expect(store.dispatch).toHaveBeenCalledWith(
        changeComparedTimePeriod({
          comparedSelectedTimePeriod: '1' as unknown as TimePeriod,
        })
      );
    });
  });

  describe('comparedTimeRangeSelected', () => {
    test('should dispatch changeComparedTimeRange action', () => {
      store.dispatch = jest.fn();
      const comparedSelectedTimeRange = '123-321';

      component.comparedTimeRangeSelected(comparedSelectedTimeRange);

      expect(store.dispatch).toHaveBeenCalledWith(
        changeComparedTimeRange({ comparedSelectedTimeRange })
      );
    });
  });
});
