import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { of } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { ReactiveComponentModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { BreadcrumbsModule } from '@schaeffler/breadcrumbs';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { selectBearing } from '../core/store';
import { initialState } from '../core/store/reducers/settings/settings.reducer';
import { GreaseStepperModule } from './../core/components/grease-stepper/grease-stepper.module';
import { GreaseCalculationComponent } from './grease-calculation.component';

describe('GreaseCalculationComponent', () => {
  let component: GreaseCalculationComponent;
  let spectator: Spectator<GreaseCalculationComponent>;
  let store: MockStore;

  const createComponent = createComponentFactory({
    component: GreaseCalculationComponent,
    imports: [
      NoopAnimationsModule,
      RouterTestingModule,
      BreadcrumbsModule,
      GreaseStepperModule,
      ReactiveComponentModule,
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      provideMockStore({
        initialState: {
          settings: {
            ...initialState,
          },
        },
      }),
      {
        provide: ActivatedRoute,
        useValue: {
          queryParamMap: of(convertToParamMap({ bearing: 'some bearing' })),
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
    store = spectator.inject(MockStore);

    store.dispatch = jest.fn();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set bearing and complete step with bearing param', () => {
      component.ngOnInit();

      expect(store.dispatch).toHaveBeenCalledWith(
        selectBearing({ bearing: 'some bearing' })
      );
    });
  });
});
