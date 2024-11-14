import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockComponent } from 'ng-mocks';
import { marbles } from 'rxjs-marbles/marbles';

import { LoadingSpinnerComponent } from '@schaeffler/loading-spinner';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { NavItem } from '../shared/nav-buttons/models';
import { NavButtonsComponent } from '../shared/nav-buttons/nav-buttons.component';
import { SelectInputModule } from '../shared/select-input/select-input.module';
import { AttritionAnalyticsComponent } from './attrition-analytics.component';
import { FeatureAnalysisComponent } from './feature-analysis/feature-analysis.component';
import { initialState } from './store';
import { getAvailableClusters } from './store/selectors/attrition-analytics.selector';

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
        },
      }),
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
    ],
    declarations: [
      PushPipe,
      MockComponent(FeatureAnalysisComponent),
      MockComponent(LoadingSpinnerComponent),
      MockComponent(NavButtonsComponent),
      MockComponent(FeatureAnalysisComponent),
      MockComponent(LoadingSpinnerComponent),
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
