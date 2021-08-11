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
import {
  getComparedSelectedOrgUnit,
  getComparedSelectedTimePeriod,
  getComparedSelectedTimeRange,
  getReasonsData,
  getReasonsLoading,
  getReasonsChartConfig,
  getReasonsChartData,
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
      store.overrideSelector(getReasonsData, result);

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
      m.expect(component.reasonsData$).toBeObservable(
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
    })
  );
});
