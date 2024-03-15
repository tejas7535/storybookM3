import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { of } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoModule } from '@ngneat/transloco';
import { PushPipe } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { BreadcrumbsModule } from '@schaeffler/breadcrumbs';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { GreaseStepperComponent } from '../../core/components/grease-stepper';
import { selectBearing } from '../../core/store';
import { initialState } from '../../core/store/reducers/settings/settings.reducer';
import { GreaseCalculationComponent } from './grease-calculation.component';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@ngneat/transloco'),
  translate: jest.fn((string) => string.split('.').pop()),
}));

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
      GreaseStepperComponent,
      PushPipe,
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

    it('should emit new breadcrumbs on language change', () => {
      component.breadcrumbs$.next = jest.fn();
      component['getBreadcrumbs'] = jest.fn(() => []);

      component.ngOnInit();

      component['translocoService'].setActiveLang('es');

      expect(component.breadcrumbs$.next).toHaveBeenCalledWith([]);
    });
  });

  describe('ngOnDestroy', () => {
    it('should emit and complete the observable', () => {
      component['destroy$'].next = jest.fn();
      component['destroy$'].complete = jest.fn();

      component.ngOnDestroy();

      expect(component['destroy$'].next).toHaveBeenCalled();
      expect(component['destroy$'].complete).toHaveBeenCalled();
    });
  });

  describe('getBreadcrumbs', () => {
    it('should return the breadcrumbs', () => {
      const result = component['getBreadcrumbs']();

      expect(result).toEqual([
        {
          label: 'landingPage',
          url: '/',
        },
        {
          label: 'greaseCalculator',
        },
      ]);
    });
  });
});
