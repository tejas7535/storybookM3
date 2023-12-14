import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from '@ngneat/spectator/jest';
import { TranslocoLocaleService } from '@ngneat/transloco-locale';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { ResultReport } from './data';
import { PDFDocumentSettingsService } from './pdf-document-settings.service';

describe('PDFDocumentSettingsService', () => {
  let service: PDFDocumentSettingsService;
  let spectator: SpectatorService<PDFDocumentSettingsService>;
  const localizeDate = jest.fn();

  const createService = createServiceFactory({
    service: PDFDocumentSettingsService,
    imports: [provideTranslocoTestingModule({ en: {} })],
    providers: [mockProvider(TranslocoLocaleService, { localizeDate })],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
  });

  it('should create service', () => {
    expect(service).toBeTruthy();
  });

  describe('when generating document settings', () => {
    it('should generate settings', () => {
      const data: ResultReport = {
        designation: '',
        calculationMethods: [],
        calculationInput: [],
        notices: {
          header: 'errors',
          data: [],
        },
      };

      const result = service.generateDocumentSettings(data);

      expect(result).toEqual({
        page: 'pdfReport.page',
        reportHeading: 'pdfReport.reportHeading',
        generationDate: undefined,
        marketingText: '',
        documentDisclaimer: 'pdfReport.disclaimer',
        calculationMethodsHeading: 'pdfReport.selectedMethods',
        inputSectionHeading: 'pdfReport.inputHeading',
        co2disclaimer: 'calculationResultReport.co2Emissions.upstreamHint',
        noticeHeading: 'calculationResultReport.reportSectionWarnings',
      });

      expect(localizeDate).toHaveBeenCalled();
    });
  });
});
