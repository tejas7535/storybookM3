import { HttpClientTestingModule } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { waitForAsync } from '@angular/core/testing';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

import { of } from 'rxjs';

import { TranslocoService } from '@jsverse/transloco';
import {
  MountingTools,
  ReportMessages,
  ResultItem,
} from '@mm/core/store/models/calculation-result-state.model';
import { QualtricsInfoBannerComponent } from '@mm/shared/components/qualtrics-info-banner/qualtrics-info-banner.component';
import { PdfGenerationService } from '@mm/shared/services/pdf';
import { ResultDataService } from '@mm/shared/services/result-data.service';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockComponent, MockProvider } from 'ng-mocks';

import {
  EaDeliveryService,
  EaEmbeddedService,
} from '@schaeffler/engineering-apps-behaviors/utils';
import { FontResolverService } from '@schaeffler/pdf-generator';
import { ResultReportComponent } from '@schaeffler/result-report';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { AdditionalToolsComponent } from './additional-tools/additional-tools.component';
import { GridResultItemCardComponent } from './grid-result-item-card/grid-result-item-card.component';
import { HydraulicOrLockNutComponent } from './hydraulic-or-lock-nut/hydraulic-or-lock-nut.component';
import { MobileDownloadPdfButtonComponent } from './mobile-download-pdf-button/mobile-download-pdf-button.component';
import { MountingRecommendationComponent } from './mounting-recommendation/mounting-recommendation.component';
import { ReportPumpsComponent } from './report-pumps/report-pumps.component';
import { ReportResultPageComponent } from './report-result-page.component';
import { ReportSelectionComponent } from './report-selection/report-selection.component';
import { SleeveConnectorComponent } from './sleeve-connector/sleeve-connector.component';

describe('ReportResultPageComponent', () => {
  let spectator: Spectator<ReportResultPageComponent>;
  let component: ReportResultPageComponent;

  const messages: ReportMessages = {
    notes: ['some note'],
    warnings: [],
    errors: [],
  };

  const mountingTools: MountingTools = {
    additionalTools: [],
    hydraulicNut: [],
    pumps: { title: '', items: [] },
    locknut: [],
    sleeveConnectors: [],
  };

  const selectionTypes = ['mountingInstructions'];

  const isResultAvailable = signal(false);

  const startPositions: ResultItem[] = [
    {
      value: 'exampleValue',
      unit: 'exampleUnit',
      abbreviation: 'ex',
      designation: 'exampleDesignation',
      isImportant: true,
    },
    {
      value: 'exampleValue2',
      unit: 'exampleUnit2',
      abbreviation: 'ex',
      designation: 'exampleDesignation2',
      isImportant: false,
    },
  ];

  const endPositions: ResultItem[] = [
    {
      value: 'endPosition1',
      unit: 'kg',
      abbreviation: 'ex',
      designation: 'endPositionDesingation',
      isImportant: true,
    },
    {
      value: 'endPosition2',
      unit: 'cm',
      abbreviation: 'xt',
      designation: 'endPositionDesingation2',
    },
  ];

  const createComponent = createComponentFactory({
    component: ReportResultPageComponent,
    imports: [
      HttpClientTestingModule,
      provideTranslocoTestingModule({ en: {} }),
      MockComponent(ResultReportComponent),
      MockComponent(ReportPumpsComponent),
      MockComponent(AdditionalToolsComponent),
      MockComponent(HydraulicOrLockNutComponent),
      MockComponent(MountingRecommendationComponent),
      MockComponent(SleeveConnectorComponent),
      MockComponent(ReportSelectionComponent),
      MockComponent(QualtricsInfoBannerComponent),
      MockComponent(GridResultItemCardComponent),
      MockComponent(MobileDownloadPdfButtonComponent),
    ],
    providers: [
      {
        provide: ResultDataService,
        useValue: {
          startPositions: signal(startPositions),
          endPositions: signal(endPositions),
          radialClearance: signal([]),
          clearanceClasses: signal([]),
          temperatures: signal([]),
          inputs: signal([]),
          categorizedMessages: signal(messages),
          mountingRecommendations: signal([]),
          mountingTools: signal(mountingTools),
          isResultAvailable,
          hasMountingTools: signal(false),
          reportSelectionTypes: signal(selectionTypes),
          pumpsTile: signal('pumpsTitle'),
          sleeveConnectors: signal([]),
          allPumps: signal([]),
          additionalTools: signal([]),
          selectedBearing: signal('bearing-123'),
        },
      },
      {
        provide: PdfGenerationService,
        useValue: {
          // eslint-disable-next-line unicorn/no-useless-undefined
          generatePdf: jest.fn().mockResolvedValue(undefined),
        },
      },
      MockProvider(FontResolverService, {
        fetchForLocale: jest.fn().mockReturnValue(of([])),
      }),
      MockProvider(MatSnackBar),
      MockProvider(EaEmbeddedService, {
        isStandalone: signal(true),
      }),
      MockProvider(EaDeliveryService, {
        assetsPath: signal('/base/assets/'),
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
  it('should show loading spinner before data loads', waitForAsync(() => {
    spectator.detectChanges();

    spectator.fixture.whenStable().then(() => {
      const spinner = spectator.query(MatProgressSpinner);
      expect(spinner).toBeTruthy();
    });
  }));

  describe('when data is loaded', () => {
    beforeEach(() => {
      isResultAvailable.set(true);
      spectator.detectChanges();
    });

    describe('when is loaded', () => {
      describe('should display calculation result report selection component', () => {
        let selectionComponent: ReportSelectionComponent;

        beforeEach(() => {
          selectionComponent = spectator.query(ReportSelectionComponent);
        });

        it('should display component', () => {
          expect(selectionComponent).toBeTruthy();
        });

        describe('when calculation type is clicked', () => {
          let scrollingSpy: any;
          const itemName = 'mountingInstructions';

          beforeEach(() => {
            scrollingSpy = {
              scrollIntoView: jest.fn(),
            } as unknown as any;

            jest
              .spyOn(document, 'querySelector')
              .mockImplementation(() => scrollingSpy);
          });

          afterEach(() => {
            jest.restoreAllMocks();
          });

          it('should scroll to the correct section', () => {
            selectionComponent['calculationTypeClicked'].emit(itemName);

            expect(document.querySelector).toHaveBeenCalledWith(`#${itemName}`);
            expect(scrollingSpy.scrollIntoView).toHaveBeenCalledWith({
              behavior: 'smooth',
              block: 'start',
            });
          });
        });
      });
    });
  });

  describe('generatePDF', () => {
    const originalConsoleError = console.error;
    beforeAll(() => {
      console.error = jest.fn();
    });

    afterAll(() => {
      console.error = originalConsoleError;
    });
    it('should set isGeneratingPdf to true while generating the PDF and set it back to false afterwards', async () => {
      expect(component.isGeneratingPdf()).toBe(false);

      const generatePromise = component.generatePDF();
      expect(component.isGeneratingPdf()).toBe(true);

      await generatePromise;
      expect(component.isGeneratingPdf()).toBe(false);
    });

    it('should set isGeneratingPdf back to false even if an error occurs', async () => {
      const pdfService = spectator.inject(PdfGenerationService);
      const snackBar = spectator.inject(MatSnackBar);
      const snackBarSpy = jest.spyOn(snackBar, 'open');
      const translocoService = spectator.inject(TranslocoService);

      const translateSpy = jest.spyOn(translocoService, 'translate');
      translateSpy.mockImplementation(String);

      jest
        .spyOn(pdfService, 'generatePdf')
        .mockRejectedValueOnce(new Error('PDF generation failed'));

      expect(component.isGeneratingPdf()).toBe(false);

      await component.generatePDF();

      expect(component.isGeneratingPdf()).toBe(false);
      expect(console.error).toHaveBeenCalled();

      expect(translateSpy).toHaveBeenCalledWith('pdf.generationError');
      expect(translateSpy).toHaveBeenCalledWith('pdf.close');
      expect(snackBarSpy).toHaveBeenCalledWith(
        'pdf.generationError',
        'pdf.close'
      );
    });
  });
});
