import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterTestingModule } from '@angular/router/testing';

import { of } from 'rxjs';

import { translate, TranslocoService } from '@jsverse/transloco';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { LetDirective, PushPipe } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockComponent, MockModule } from 'ng-mocks';

import { SubheaderModule } from '@schaeffler/subheader';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { AppRoutePath } from '@ga/app-route-path.enum';
import { SettingsFacade } from '@ga/core/store';
import {
  fetchBearinxVersions,
  getCalculation,
} from '@ga/core/store/actions/calculation-result/calculation-result.actions';
import { ENV, getEnv } from '@ga/environments/environments.provider';
import { MediasButtonComponent } from '@ga/shared/components/medias-button';
import { QualtricsInfoBannerComponent } from '@ga/shared/components/qualtrics-info-banner/qualtrics-info-banner.component';
import { PartnerVersion } from '@ga/shared/models';

import { ApplicationScenario } from '../calculation-parameters/constants/application-scenarios.model';
import { GreaseCalculationPath } from '../grease-calculation-path.enum';
import { GreaseRecommendationMarketingService } from '../grease-recommendation-marketing.service';
import { CalculationResultComponent } from './calculation-result.component';
import { GreaseReportComponent } from './components/grease-report';
import { GreaseReportPdfGeneratorService } from './services';

describe('CalculationResultComponent', () => {
  let component: CalculationResultComponent;
  let spectator: Spectator<CalculationResultComponent>;
  let store: MockStore;
  let translocoService: TranslocoService;

  const createComponent = createComponentFactory({
    component: CalculationResultComponent,
    imports: [
      RouterTestingModule,
      PushPipe,
      LetDirective,
      FormsModule,
      provideTranslocoTestingModule(
        { en: {} },
        { translocoConfig: { defaultLang: 'de' } }
      ),
      MediasButtonComponent,

      MockComponent(QualtricsInfoBannerComponent),
      // UI Modules
      MockModule(SubheaderModule),
      MockModule(MatIconModule),
      MockModule(MatProgressSpinnerModule),
      MockModule(MatSlideToggleModule),
      MockModule(MatTooltipModule),
    ],
    providers: [
      provideMockStore({
        initialState: {
          calculationResult: {},
        },
      }),
      {
        provide: translate,
        useValue: jest.fn(),
      },

      mockProvider(SettingsFacade),
      mockProvider(GreaseReportPdfGeneratorService),
      { provide: ENV, useValue: { ...getEnv(), production: false } },
      {
        provide: GreaseRecommendationMarketingService,
        useValue: {
          selectedApplication$: of(ApplicationScenario.All),
        },
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

  describe('qualtrics banner', () => {
    it('should display qualtrics info banner', () => {
      expect(spectator.query('ga-qualtrics-info-banner')).toBeTruthy();
    });

    it('should not display qualtrics info banner for partner versions', () => {
      component.partnerVersion$ = of(PartnerVersion.Schmeckthal);
      spectator.detectChanges();
      expect(spectator.query('ga-qualtrics-info-banner')).toBeFalsy();
    });
  });

  describe('when partner version is available', () => {
    beforeEach(() => {
      component.partnerVersion$ = of(PartnerVersion.Schmeckthal);
    });

    it('should provide value to medias button component', () => {
      spectator.detectChanges();
      expect(spectator.query(MediasButtonComponent).partnerVersion).toBe(
        PartnerVersion.Schmeckthal
      );
    });
  });

  describe('ngOnInit', () => {
    it('should dispatch action', () => {
      component.ngOnInit();

      expect(store.dispatch).toHaveBeenCalledWith(fetchBearinxVersions());
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

  describe('when generate pdf report', () => {
    let spy: jest.SpyInstance;

    beforeEach(() => {
      component.greaseReport = {
        subordinates: [{ indentifier: 'text' }],
        legalNote: 'some legal note',
        automaticLubrication: true,
      } as any as GreaseReportComponent;

      spy = jest.spyOn(
        component['greaseReportGeneratorService'],
        'generateReport'
      );

      component.generateReport('bearing 123');
    });

    it('should generate pdf report', () => {
      expect(spy).toHaveBeenCalledWith({
        data: [{ indentifier: 'text' }],
        legalNote: 'some legal note',
        reportTitle: 'de.calculationResult.title.main bearing 123',
        sectionSubTitle: 'de.calculationResult.title.247hint',
        automaticLubrication: true,
      });
    });
  });
});
