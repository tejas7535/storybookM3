import { of } from 'rxjs';

import { TranslocoService } from '@jsverse/transloco';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { FontResolverService } from '@schaeffler/pdf-generator';

import { SettingsFacade } from '@ga/core/store';
import { PartnerVersion } from '@ga/shared/models';

import { GreasePdfReportModel } from '../../models';
import { GreaseReportDataGeneratorService } from '../grease-report-data-generator.service';
import { GreaseReportPdfFileSaveService } from './grease-report-pdf-file-save.service';
import { PdfGenerationService } from './pdf-generation.service';
import { PdfInputsService } from './sections/pdf-inputs.service';
import { PdfMessagesService } from './sections/pdf-messages.service';
import { PdfResultsService } from './sections/pdf-results.service';

// Mock console to suppress PDF generator warnings in tests
jest.spyOn(console, 'warn').mockImplementation(() => {});

describe('PdfGenerationService', () => {
  let spectator: SpectatorService<PdfGenerationService>;
  let service: PdfGenerationService;

  const mockFonts = {
    'Schaeffler Sans': 'mock-font-data',
  };

  const mockReport: GreasePdfReportModel = {
    reportTitle: 'Test Report',
    sectionSubTitle: 'Test Section',
    data: [],
    results: [],
    legalNote: 'Test legal note disclaimer',
    versions: '1.0.0',
  };

  const createService = createServiceFactory({
    service: PdfGenerationService,
    providers: [
      {
        provide: SettingsFacade,
        useValue: {
          partnerVersion$: of(PartnerVersion.Schmeckthal),
        },
      },
      {
        provide: FontResolverService,
        useValue: {
          fetchForLocale: jest.fn().mockReturnValue(of(mockFonts)),
        },
      },
      {
        provide: GreaseReportPdfFileSaveService,
        useValue: {
          saveAndOpenFile: jest.fn().mockResolvedValue(undefined),
        },
      },
      {
        provide: PdfInputsService,
        useValue: {
          getInputsSection: jest.fn().mockReturnValue([]),
        },
      },
      {
        provide: PdfMessagesService,
        useValue: {
          getMessagesSection: jest.fn().mockReturnValue([]),
        },
      },
      {
        provide: PdfResultsService,
        useValue: {
          generateResultsSection: jest.fn().mockReturnValue([]),
        },
      },
      {
        provide: TranslocoService,
        useValue: {
          getActiveLang: jest.fn().mockReturnValue('en'),
          langChanges$: of('en'),
        },
      },
      {
        provide: GreaseReportDataGeneratorService,
        useValue: {
          prepareReportResultData: jest.fn().mockResolvedValue([]),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have customLogo computed property', () => {
    expect(service.customLogo).toBeDefined();
    expect(typeof service.customLogo()).toEqual('string');
  });

  it('should have activeLang computed property', () => {
    expect(service.activeLang).toBeDefined();
    expect(service.activeLang()).toBe('en');
  });

  it('should have fonts signal', () => {
    expect(service.fonts).toBeDefined();
  });

  describe('generatePdf', () => {
    beforeEach(() => {
      jest.spyOn(Date, 'now').mockReturnValue(1_640_995_200_000); // 2022-01-01
      jest.spyOn(Intl, 'DateTimeFormat').mockReturnValue({
        format: jest.fn().mockReturnValue('1/1/2022'),
      } as any);
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should generate PDF successfully', async () => {
      const fileSaveService = spectator.inject(GreaseReportPdfFileSaveService);

      await service.generatePdf(mockReport);

      expect(fileSaveService.saveAndOpenFile).toHaveBeenCalled();
    });
  });
});
