import { marbles } from 'rxjs-marbles/marbles';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { ReactiveComponentModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockComponent } from 'ng-mocks';

import { BarChartComponent } from '../shared/charts/bar-chart/bar-chart.component';
import { BarChartConfig } from '../shared/charts/models/bar-chart-config.model';
import { AttritionAnalyticsComponent } from './attrition-analytics.component';
import { EmployeeAnalyticsComponent } from './employee-analytics/employee-analytics.component';
import { initialState } from './store';
import { loadEmployeeAnalytics } from './store/actions/attrition-analytics.action';

describe('AttritionAnalyticsComponent', () => {
  let component: AttritionAnalyticsComponent;
  let store: MockStore;
  let spectator: Spectator<AttritionAnalyticsComponent>;

  const createComponent = createComponentFactory({
    component: AttritionAnalyticsComponent,
    imports: [ReactiveComponentModule],
    providers: [
      provideMockStore({
        initialState: {
          attritionAnalytics: initialState,
        },
      }),
    ],
    declarations: [MockComponent(BarChartComponent)],
    entryComponents: [EmployeeAnalyticsComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;

    store = spectator.inject(MockStore);
    store.dispatch = jest.fn();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    test(
      'should set bat chart configs',
      marbles((m) => {
        const expected = m.cold('a', { config: {} as BarChartConfig });

        component.ngOnInit();

        m.expect(component.ageChartConfig$).toBeObservable(expected);
        m.expect(component.educationChartConfig$).toBeObservable(expected);
        m.expect(component.positionChartConfig$).toBeObservable(expected);
      })
    );

    test('should dispatch action loadEmployeeAnalytics', () => {
      store.dispatch = jest.fn();

      component.ngOnInit();

      expect(store.dispatch).toHaveBeenCalledWith(loadEmployeeAnalytics());
    });
  });
});
