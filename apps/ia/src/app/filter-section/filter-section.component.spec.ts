import { MatExpansionModule } from '@angular/material/expansion';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles/marbles';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import * as en from '../../assets/i18n/en.json';
import { filterSelected, loadOrgUnits } from '../core/store/actions';
import {
  getOrgUnitsFilter,
  getOrgUnitsLoading,
  getSelectedFilterValues,
  getSelectedOrgUnit,
  getSelectedTimePeriod,
  getSelectedTimeRange,
  getTimePeriods,
} from '../core/store/selectors';
import { FilterModule } from '../shared/filter/filter.module';
import {
  Filter,
  FilterKey,
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
      ReactiveComponentModule,
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
        const result = new Filter(FilterKey.ORG_UNIT, []);
        store.overrideSelector(getOrgUnitsFilter, result);
        component.ngOnInit();

        m.expect(component.orgUnitsFilter$).toBeObservable(
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
        store.overrideSelector(getSelectedOrgUnit, result);
        component.ngOnInit();

        m.expect(component.selectedOrgUnit$).toBeObservable(
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

      expect(store.dispatch).toHaveBeenCalledWith(loadOrgUnits({ searchFor }));
    });
  });
});
