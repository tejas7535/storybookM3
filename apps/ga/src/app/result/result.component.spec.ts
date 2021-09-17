import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { translate } from '@ngneat/transloco';
import { ReactiveComponentModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { BreadcrumbsModule } from '@schaeffler/breadcrumbs';
import { SubheaderModule } from '@schaeffler/subheader';
import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { CALCULATION_RESULT_MOCK } from '../../testing/mocks/rest.service.mock';
import { previousStep } from '../core/store/actions/settings/settings.actions';
import { initialState } from '../core/store/reducers/result/result.reducer';
import { SharedModule } from '../shared/shared.module';
import { ResultComponent } from './result.component';

describe('ResultComponent', () => {
  let component: ResultComponent;
  let spectator: Spectator<ResultComponent>;
  let store: MockStore;

  const createComponent = createComponentFactory({
    component: ResultComponent,
    imports: [
      RouterTestingModule,
      SharedModule,
      ReactiveComponentModule,
      provideTranslocoTestingModule({ en: {} }),

      // UI Modules
      SubheaderModule,
      BreadcrumbsModule,

      // Material Modules
    ],
    providers: [
      provideMockStore({
        initialState: {
          result: {
            ...initialState,
            resultId: CALCULATION_RESULT_MOCK,
          },
        },
      }),
      {
        provide: translate,
        useValue: jest.fn(),
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
    it('should get resultId from store', (done) => {
      component.resultId$.subscribe((bearing: string) => {
        expect(bearing).toEqual(CALCULATION_RESULT_MOCK);
        done();
      });

      component.ngOnInit();
    });
  });

  describe('navigateBack', () => {
    it('should navigate to bearing selection', () => {
      component.navigateBack();

      expect(store.dispatch).toHaveBeenCalledWith(previousStep());
    });
  });
});
