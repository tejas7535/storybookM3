import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockComponent } from 'ng-mocks';
import { marbles } from 'rxjs-marbles/marbles';

import { LoadingSpinnerComponent } from '@schaeffler/loading-spinner';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { BarChartConfig } from '../shared/charts/models';
import { TimePeriod } from '../shared/models';
import { NavItem } from '../shared/nav-buttons/models';
import { NavButtonsComponent } from '../shared/nav-buttons/nav-buttons.component';
import { SelectInputModule } from '../shared/select-input/select-input.module';
import { AttritionAnalyticsComponent } from './attrition-analytics.component';
import { FeatureAnalysisComponent } from './feature-analysis/feature-analysis.component';
import { initialState } from './store';
import { selectCluster } from './store/actions/attrition-analytics.action';
import {
  getAvailableClusters,
  getClustersLoading,
  getEmployeeAnalytics,
  getEmployeeAnalyticsLoading,
} from './store/selectors/attrition-analytics.selector';

describe('AttritionAnalyticsComponent', () => {
  let component: AttritionAnalyticsComponent;
  let store: MockStore;
  let spectator: Spectator<AttritionAnalyticsComponent>;

  const createComponent = createComponentFactory({
    component: AttritionAnalyticsComponent,
    imports: [
      provideTranslocoTestingModule({ en: {} }),
      SelectInputModule,
      MatCardModule,
      MatChipsModule,
    ],
    providers: [
      provideMockStore({
        initialState: {
          attritionAnalytics: initialState,
          filter: {
            selectedTimePeriod: TimePeriod.LAST_12_MONTHS,
          },
        },
      }),
    ],
    declarations: [
      PushPipe,
      MockComponent(FeatureAnalysisComponent),
      MockComponent(LoadingSpinnerComponent),
      MockComponent(NavButtonsComponent),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;

    store = spectator.inject(MockStore);
    jest.spyOn(store, 'dispatch');
  });

  test('should be created', () => {
    expect(component).toBeTruthy();
  });

  test(
    'should set clusters$',
    marbles((m) => {
      store.overrideSelector(getAvailableClusters, [
        { label: 'a', translation: 't' } as NavItem,
      ]);

      m.expect(component.clusters$).toBeObservable(
        m.cold('a', {
          a: [{ label: 'a', translation: 't' } as NavItem],
        })
      );
    })
  );

  test(
    'should set employeeAnalytics$',
    marbles((m) => {
      store.overrideSelector(getEmployeeAnalytics, [
        { title: 'abc' } as BarChartConfig,
      ]);

      m.expect(component.employeeAnalytics$).toBeObservable(
        m.cold('a', {
          a: [{ title: 'abc' } as BarChartConfig],
        })
      );
    })
  );

  test(
    'should set clustersLoading$',
    marbles((m) => {
      store.overrideSelector(getClustersLoading, true);

      m.expect(component.clustersLoading$).toBeObservable(
        m.cold('a', {
          a: true,
        })
      );
    })
  );

  test(
    'should set analyticsLoading$',
    marbles((m) => {
      store.overrideSelector(getEmployeeAnalyticsLoading, true);

      m.expect(component.analyticsLoading$).toBeObservable(
        m.cold('a', {
          a: true,
        })
      );
    })
  );

  test('should dispatch selectCluster', () => {
    const cluster = 'a';
    component.onClusterSelected(cluster);

    expect(store.dispatch).toHaveBeenCalledWith(selectCluster({ cluster }));
  });

  describe('init observables', () => {
    test(
      'should select getAvailableClusters',
      marbles((m) => {
        const clusters: NavItem[] = [
          {
            label: 'abc',
            translation: 'xx.yy.zz',
          },
        ];
        store.overrideSelector(getAvailableClusters, clusters);

        m.expect(component.clusters$).toBeObservable(
          m.cold('a', { a: clusters })
        );
      })
    );
  });
});
