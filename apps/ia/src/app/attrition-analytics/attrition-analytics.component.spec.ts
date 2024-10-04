import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockComponent } from 'ng-mocks';

import { LoadingSpinnerComponent } from '@schaeffler/loading-spinner';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { SelectInputModule } from '../shared/select-input/select-input.module';
import { AttritionAnalyticsComponent } from './attrition-analytics.component';
import { FeatureAnalysisComponent } from './feature-analysis/feature-analysis.component';
import { initialState } from './store';

describe('AttritionAnalyticsComponent', () => {
  let component: AttritionAnalyticsComponent;
  let store: MockStore;
  let spectator: Spectator<AttritionAnalyticsComponent>;

  const createComponent = createComponentFactory({
    component: AttritionAnalyticsComponent,
    imports: [
      PushPipe,
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
      MockComponent(FeatureAnalysisComponent),
      MockComponent(LoadingSpinnerComponent),
    ],
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
});
