import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import * as en from '../../assets/i18n/en.json';
import { filterSelected, timeRangeSelected } from '../core/store/actions';
import { AutocompleteInputModule } from '../shared/autocomplete-input/autocomplete-input.module';
import { DateInputModule } from '../shared/date-input/date-input.module';
import { IdValue, SelectedFilter, TimePeriod } from '../shared/models';
import { SelectInputModule } from '../shared/select-input/select-input.module';
import { FilterSectionComponent } from './filter-section.component';

describe('FilterSectionComponent', () => {
  let component: FilterSectionComponent;
  let spectator: Spectator<FilterSectionComponent>;
  let store: MockStore;

  const createComponent = createComponentFactory({
    component: FilterSectionComponent,
    imports: [
      NoopAnimationsModule,
      AutocompleteInputModule,
      provideTranslocoTestingModule({ en }),
      ReactiveComponentModule,
      SelectInputModule,
      DateInputModule,
      MatIconModule,
      MatTooltipModule,
    ],
    providers: [
      provideMockStore({
        initialState: {
          filter: {
            orgUnits: [],
            timePeriods: [],
            selectedFilters: {
              ids: [],
              entities: {},
            },
          },
        },
      }),
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
    ],
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
    test('should set observables', () => {
      component.ngOnInit();

      expect(component.orgUnits$).toBeDefined();
    });
  });

  describe('optionSelected', () => {
    test('should dispatch action', () => {
      const filter = new SelectedFilter('test', undefined);
      store.dispatch = jest.fn();

      component.optionSelected(filter);

      expect(store.dispatch).toHaveBeenCalledWith(filterSelected({ filter }));

      expect(component.orgUnits$).toBeDefined();
    });
  });

  describe('orgUnitInvalid', () => {
    test('should set disabledTimeRangeFilter', () => {
      component.orgUnitInvalid(false);

      expect(component.disabledTimeRangeFilter).toBeFalsy();
    });
  });

  describe('timePeriodSelected', () => {
    test('should dispatch timePeriodSelected', () => {
      store.dispatch = jest.fn();
      component.timePeriodSelected(new IdValue(TimePeriod.CUSTOM, 'custom'));

      expect(store.dispatch).toHaveBeenCalledWith({
        timePeriod: TimePeriod.CUSTOM,
        type: '[Filter] Time period selected',
      });
    });
  });

  describe('timeRangeSelected', () => {
    test('should dispatch timeRangeSelected action', () => {
      store.dispatch = jest.fn();
      const timeRange = '123|456';
      component.timeRangeSelected(timeRange);

      expect(store.dispatch).toHaveBeenCalledWith(
        timeRangeSelected({ timeRange })
      );
    });
  });
});
