import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';
import { StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';

import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { BannerModule } from '@schaeffler/banner';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import * as en from '../../../assets/i18n/en.json';
import { InputModule } from './input/input.module';
import { LifetimePredictorComponent } from './lifetime-predictor.component';
import { PredictionModule } from './prediction/prediction.module';
import { initialState as initialInputState } from './store/reducers/input.reducer';
import { initialState as initialPredictionState } from './store/reducers/prediction.reducer';

jest.mock('../../shared/change-favicon.ts', () => ({
  changeFavicon: jest.fn(() => {}),
}));

describe('LifetimePredictorComponent', () => {
  let component: LifetimePredictorComponent;
  let spectator: Spectator<LifetimePredictorComponent>;

  const initialState = {
    ltp: {
      input: initialInputState,
      prediction: initialPredictionState,
    },
    banner: {
      text: '',
      buttonText: '',
      icon: '',
      truncateSize: 0,
      showFullText: true,
      open: true,
    },
  };

  const createComponent = createComponentFactory({
    component: LifetimePredictorComponent,
    declarations: [LifetimePredictorComponent],
    imports: [
      MatSidenavModule,
      MatIconModule,
      RouterTestingModule,
      InputModule,
      PredictionModule,
      StoreModule.forRoot({}),
      provideTranslocoTestingModule({ en }),
      ReactiveComponentModule,
      NoopAnimationsModule,
      BannerModule,
    ],
    providers: [
      provideMockStore({ initialState }),
      {
        provide: ApplicationInsightsService,
        useValue: {
          logEvent: jest.fn(),
        },
      },
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
      },
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
