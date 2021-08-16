import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { provideMockStore } from '@ngrx/store/testing';

import { AttritionAnalyticsComponent } from './attrition-analytics.component';

describe('AttritionAnalyticsComponent', () => {
  let component: AttritionAnalyticsComponent;
  let spectator: Spectator<AttritionAnalyticsComponent>;

  const createComponent = createComponentFactory({
    component: AttritionAnalyticsComponent,
    imports: [],
    providers: [
      provideMockStore({
        initialState: {},
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
