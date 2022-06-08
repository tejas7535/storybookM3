import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterTestingModule } from '@angular/router/testing';

import { debounceTime } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { translate, TranslocoService } from '@ngneat/transloco';
import { PushModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockModule } from 'ng-mocks';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SubheaderModule } from '@schaeffler/subheader';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import {
  CALCULATION_RESULT_MOCK_ID,
  MODEL_MOCK_ID,
  REPORT_URLS_MOCK,
} from '@ga/testing/mocks';

import { AppRoutePath } from '../app-route-path.enum';
import { getCalculation } from '../core/store/actions/result/result.actions';
import { initialState } from '../core/store/reducers/result/result.reducer';
import { getReportUrls } from '../core/store/selectors/result/result.selector';
import { GreaseCalculationPath } from '../grease-calculation/grease-calculation-path.enum';
import { ResultComponent } from './result.component';

describe('ResultComponent', () => {
  let component: ResultComponent;
  let spectator: Spectator<ResultComponent>;
  let store: MockStore;
  let translocoService: TranslocoService;

  const createComponent = createComponentFactory({
    component: ResultComponent,
    imports: [
      RouterTestingModule,
      PushModule,
      FormsModule,
      provideTranslocoTestingModule(
        { en: {} },
        { translocoConfig: { defaultLang: 'de' } }
      ),

      // UI Modules
      MockModule(MatSlideToggleModule),
      MockModule(SubheaderModule),
      MockModule(LoadingSpinnerModule),
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
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    translocoService = spectator.inject(TranslocoService);
    store = spectator.inject(MockStore);
    store.dispatch = jest.fn();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should get resultId from store', (done) => {
      store
        .select(getReportUrls)
        .pipe(debounceTime(3000))
        .subscribe(() => {
          expect(component.reportUrls).toEqual(REPORT_URLS_MOCK);

          done();
        });

      component.ngOnInit();

      expect(store.dispatch).toHaveBeenCalledWith(getCalculation());
    });

    it('should reset the report urls and dispatch fetch action on language change', (done) => {
      translocoService.getActiveLang = jest.fn(() => 'es');

      component.ngOnInit();

      translocoService.langChanges$.subscribe(() => {
        expect(component.reportUrls).toBe(undefined);
        expect(store.dispatch).toHaveBeenCalledWith(getCalculation());

        done();
      });
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
