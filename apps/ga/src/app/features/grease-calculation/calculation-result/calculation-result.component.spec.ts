import { CommonModule } from '@angular/common';
import { signal } from '@angular/core';
import { waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { provideRouter } from '@angular/router';

import { of, Subject } from 'rxjs';

import { translate, TranslocoService } from '@jsverse/transloco';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { MockComponent, MockModule } from 'ng-mocks';

import { SubheaderModule } from '@schaeffler/subheader';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { AppRoutePath } from '@ga/app-route-path.enum';
import { CalculationParametersFacade, SettingsFacade } from '@ga/core/store';
import { BearingSelectionFacade } from '@ga/core/store/facades/bearing-selection/bearing-selection.facade';
import { CalculationResultFacade } from '@ga/core/store/facades/calculation-result/calculation-result.facade';
import { ENV, getEnv } from '@ga/environments/environments.provider';
import { MediasButtonComponent } from '@ga/shared/components/medias-button';
import { QualtricsInfoBannerComponent } from '@ga/shared/components/qualtrics-info-banner/qualtrics-info-banner.component';
import { PartnerVersion } from '@ga/shared/models';

import { ApplicationScenario } from '../calculation-parameters/constants/application-scenarios.model';
import { GreaseCalculationPath } from '../grease-calculation-path.enum';
import { CalculationResultComponent } from './calculation-result.component';
import { GreaseReportComponent } from './components/grease-report';
import { GreasePDFSelectionService } from './services/grease-pdf-select.service';
import { PdfGenerationService } from './services/pdf/pdf-generation.service';

describe('CalculationResultComponent', () => {
  let component: CalculationResultComponent;
  let spectator: Spectator<CalculationResultComponent>;
  let translocoService: TranslocoService;
  let calculationResultFacade: CalculationResultFacade;

  const createComponent = createComponentFactory({
    component: CalculationResultComponent,
    imports: [
      CommonModule,
      FormsModule,
      provideTranslocoTestingModule(
        { en: {}, de: {} },
        { translocoConfig: { defaultLang: 'de' } }
      ),

      MediasButtonComponent,
      MockComponent(QualtricsInfoBannerComponent),
      MockComponent(GreaseReportComponent),

      // UI Modules
      MockModule(SubheaderModule),
      MockModule(MatIconModule),
      MockModule(MatProgressSpinnerModule),
      MockModule(MatSlideToggleModule),
      MockModule(MatTooltipModule),
    ],
    providers: [
      provideRouter([]),
      {
        provide: translate,
        useValue: jest.fn(),
      },
      mockProvider(BearingSelectionFacade, {
        selectedBearing: jest.fn(() => '6206'),
      }),
      mockProvider(CalculationResultFacade, {
        reportUrls: jest.fn(() => ({ jsonReport: 'url' })),
        bearinxVersions: jest.fn(() => 'versions'),
        fetchBearinxVersions: jest.fn(),
        getCalculation: jest.fn(),
      }),
      mockProvider(SettingsFacade, {
        appIsEmbedded$: of(false),
        partnerVersion$: new Subject(),
      }),
      mockProvider(CalculationParametersFacade, {
        selectedGreaseApplication$: of(ApplicationScenario.All),
        automaticLubrication: signal(true),
        preferredGrease: jest.fn(() => ({
          selectedGrease: 'Grease 123',
        })),
      }),
      mockProvider(PdfGenerationService),
      { provide: ENV, useValue: { ...getEnv(), production: false } },
      mockProvider(GreasePDFSelectionService, {
        selectionMode: jest.fn(() => false),
        selectedSet: signal(new Set()),
        isSelected: jest.fn(() => true),
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;

    translocoService = spectator.inject(TranslocoService);
    calculationResultFacade = spectator.inject(CalculationResultFacade);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when partner version is available', () => {
    beforeEach(() => {
      (
        component['settingsFacade'].partnerVersion$ as Subject<PartnerVersion>
      ).next(PartnerVersion.Schmeckthal);
    });

    it('should provide value to medias button component', () => {
      spectator.detectChanges();
      spectator.detectComponentChanges();

      expect(component.selectedBearing()).toBeTruthy();
      expect(component.partnerVersion()).toBe(PartnerVersion.Schmeckthal);
      expect(component.appIsEmbedded()).toBe(false);
      expect(spectator.query(MediasButtonComponent).partnerVersion).toBe(
        PartnerVersion.Schmeckthal
      );
    });
  });

  describe('constructor', () => {
    it('should fetch result on language change', () => {
      translocoService.setActiveLang('en');
      expect(calculationResultFacade.getCalculation).toHaveBeenCalled();
    });
  });

  describe('ngOnInit', () => {
    it('should dispatch action', () => {
      component.ngOnInit();

      expect(calculationResultFacade.fetchBearinxVersions).toHaveBeenCalled();
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
      Object.defineProperty(component, 'greaseReport', {
        value: signal({
          subordinates: signal([{ indentifier: 'text' }]),
          legalNote: signal('some legal note'),
          greaseResultReport: () => ({
            greaseResult: [] as any,
            inputs: { subordinates: [] as any },
            errorWarningsAndNotes: {},
          }),
          automaticLubrication: signal(true),
        }),
        writable: false,
      });

      spy = jest.spyOn(component['pdfGenerationService'], 'generatePdf');
    });

    it('should generate pdf report with all contents', waitForAsync(async () => {
      const signalSpy = jest.spyOn(component.generatingPdf, 'set');

      await component.generateReport('bearing 123');
      expect(spy).toHaveBeenCalledWith({
        data: [{ subordinates: [] }, {}],
        legalNote: 'some legal note',
        reportTitle: 'de.calculationResult.title.main bearing 123',
        results: [],
        sectionSubTitle: 'de.calculationResult.title.247hint',
        versions: 'versions',
      });
      expect(signalSpy).toHaveBeenCalledWith(true);
      expect(signalSpy).toHaveBeenCalledWith(false);
      expect(component.generatingPdf()).toBe(false);
    }));
  });
});
