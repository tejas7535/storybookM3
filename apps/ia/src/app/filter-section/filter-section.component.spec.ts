import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { ReactiveComponentModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { filterSelected, timeRangeSelected } from '../core/store/actions';
import { ChartType } from '../overview/models/chart-type.enum';
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
    declarations: [FilterSectionComponent],
    imports: [
      NoopAnimationsModule,
      AutocompleteInputModule,
      provideTranslocoTestingModule({}),
      ReactiveComponentModule,
      SelectInputModule,
      DateInputModule,
    ],
    providers: [
      provideMockStore({
        initialState: {
          employee: {
            filters: {
              orgUnits: [],
              regionsAndSubRegions: [],
              hrLocations: [],
              countries: [],
              timePeriods: [],
            },
            overview: {
              selectedChart: ChartType.ORG_CHART,
            },
          },
        },
      }),
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
      // tslint:disable-next-line: no-lifecycle-call
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

  describe('setTimeRangeHint', () => {
    test('set correct hint value - year', () => {
      component.setTimeRangeHint(TimePeriod.YEAR);

      expect(component.timeRangeHintValue).toEqual('year');
    });

    test('set correct hint value - month', () => {
      component.setTimeRangeHint(TimePeriod.MONTH);

      expect(component.timeRangeHintValue).toEqual('month');
    });
    test('set correct hint value - last 12 month', () => {
      component.setTimeRangeHint(TimePeriod.LAST_12_MONTHS);

      expect(component.timeRangeHintValue).toEqual('reference date');
    });
    test('set correct hint value - custom', () => {
      component.setTimeRangeHint(TimePeriod.CUSTOM);

      expect(component.timeRangeHintValue).toEqual('time range');
    });
  });

  describe('timePeriodSelect', () => {
    test('should dispatch timePeriodSelected', () => {
      store.dispatch = jest.fn();
      component.timePeriodSelected(new IdValue(TimePeriod.CUSTOM, 'custom'));

      expect(store.dispatch).toHaveBeenCalledWith({
        timePeriod: TimePeriod.CUSTOM,
        type: '[Employee] Time period selected',
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
