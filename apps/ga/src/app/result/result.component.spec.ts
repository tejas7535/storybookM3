import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { translate } from '@ngneat/transloco';
import { ReactiveComponentModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { BreadcrumbsModule } from '@schaeffler/breadcrumbs';
import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { ReportModule } from '@schaeffler/report';
import { SubheaderModule } from '@schaeffler/subheader';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import {
  CALCULATION_RESULT_MOCK_ID,
  MODEL_MOCK_ID,
  REPORT_URLS_MOCK,
} from '../../testing/mocks/rest.service.mock';
import { AppRoutePath } from '../app-route-path.enum';
import { initialState } from '../core/store/reducers/result/result.reducer';
import { GreaseCalculationPath } from '../grease-calculation/grease-calculation-path.enum';
import { ReportUrls } from '../shared/models';
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
      FormsModule,
      HttpClientTestingModule,
      provideTranslocoTestingModule({ en: {} }),

      // UI Modules
      SubheaderModule,
      BreadcrumbsModule,
      ReportModule,
      LoadingSpinnerModule,
      MatSlideToggleModule,

      // Material Modules
    ],
    providers: [
      provideMockStore({
        initialState: {
          result: {
            ...initialState,
            resultId: CALCULATION_RESULT_MOCK_ID,
          },
          bearing: {
            selectedBearing: 'testBearing',
            modelId: MODEL_MOCK_ID,
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
      component.reportUrls$.subscribe((reportUrls: ReportUrls) => {
        expect(reportUrls).toEqual(REPORT_URLS_MOCK);
        done();
      });

      component.ngOnInit();
    });
  });

  describe('navigateBack', () => {
    it('should navigate to bearing selection', () => {
      component['router'].navigate = jest.fn();

      component.navigateBack();

      expect(component['router'].navigate).toHaveBeenCalledWith([
        `${AppRoutePath.GreaseCalculationPath}/${GreaseCalculationPath.ParametersPath}`,
      ]);
    });
  });
});
