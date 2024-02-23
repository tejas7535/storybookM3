import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from '@ngneat/spectator/jest';
import { TranslocoService } from '@ngneat/transloco';
import { TranslocoLocaleService } from '@ngneat/transloco-locale';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { ResultReport } from './data';
import { PDFDocumentSettingsService } from './pdf-document-settings.service';

describe('PDFDocumentSettingsService', () => {
  let service: PDFDocumentSettingsService;
  let spectator: SpectatorService<PDFDocumentSettingsService>;
  let translocoService: TranslocoService;
  let translocoServiceSpy: jest.SpyInstance;
  const localizeDate = jest.fn();

  const createService = createServiceFactory({
    service: PDFDocumentSettingsService,
    imports: [provideTranslocoTestingModule({ en: {} })],
    providers: [mockProvider(TranslocoLocaleService, { localizeDate })],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    translocoService = spectator.inject(TranslocoService);
    translocoServiceSpy = jest.spyOn(translocoService, 'translate');
  });

  it('should create service', () => {
    expect(service).toBeTruthy();
  });

  describe('when generating document settings', () => {
    it('should generate settings', () => {
      const designationId = '1234';
      const data: ResultReport = {
        designation: designationId,
        calculationMethods: [],
        calculationInput: [],
        notices: {
          header: 'errors',
          data: {
            errors: {
              header: 'errors',
              data: [],
            },
            warnings: {
              header: 'warnings',
              data: [],
            },
            notes: {
              header: 'notes',
              data: [],
            },
          },
        },
      };

      const result = service.generateDocumentSettings(data);

      expect(result).toEqual({
        page: 'pdfReport.page',
        reportHeading: 'pdfReport.reportHeading',
        bearingLink: {
          link: 'pdfReport.mediasBearingLink.link',
          text: 'pdfReport.mediasBearingLink.text',
        },
        generationDate: undefined,
        documentDisclaimer: 'pdfReport.disclaimer',
        calculationMethodsHeading: 'pdfReport.selectedMethods',
        inputSectionHeading: 'pdfReport.inputHeading',
        co2disclaimer: 'calculationResultReport.co2Emissions.upstreamHint',
        noticeHeading: 'calculationResultReport.reportSectionWarnings',
      });

      expect(translocoServiceSpy).toBeCalledWith('pdfReport.reportHeading', {
        bearingDesignation: designationId,
      });

      expect(translocoServiceSpy).toBeCalledWith(
        'pdfReport.mediasBearingLink.link',
        {
          bearingDesignation: designationId,
        }
      );

      expect(localizeDate).toHaveBeenCalled();
    });
  });
});
