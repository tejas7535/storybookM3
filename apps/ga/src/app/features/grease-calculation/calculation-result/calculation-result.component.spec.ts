import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { translate, TranslocoService } from '@ngneat/transloco';
import { LetModule, PushModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockModule } from 'ng-mocks';

import { SubheaderModule } from '@schaeffler/subheader';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { AppRoutePath } from '@ga/app-route-path.enum';
import { getCalculation } from '@ga/core/store/actions/calculation-result/calculation-result.actions';

import { GreaseCalculationPath } from '../grease-calculation-path.enum';
import { CalculationResultComponent } from './calculation-result.component';

describe('CalculationResultComponent', () => {
  let component: CalculationResultComponent;
  let spectator: Spectator<CalculationResultComponent>;
  let store: MockStore;
  let translocoService: TranslocoService;

  const createComponent = createComponentFactory({
    component: CalculationResultComponent,
    imports: [
      RouterTestingModule,
      PushModule,
      LetModule,
      FormsModule,
      provideTranslocoTestingModule(
        { en: {} },
        { translocoConfig: { defaultLang: 'de' } }
      ),

      // UI Modules
      MockModule(SubheaderModule),
      MockModule(MatIconModule),
      MockModule(MatProgressSpinnerModule),
      MockModule(MatSlideToggleModule),
      MockModule(MatTooltipModule),
    ],
    providers: [
      provideMockStore(),
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
    it('should dispatch action', () => {
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
