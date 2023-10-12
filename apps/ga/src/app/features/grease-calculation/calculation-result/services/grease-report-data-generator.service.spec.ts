import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from '@ngneat/spectator/jest';
import { TranslocoModule } from '@ngneat/transloco';
import { TranslocoLocaleService } from '@ngneat/transloco-locale';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import {
  GREASE_PDF_INPUT_MOCK,
  GREASE_PDF_MESSAGE,
  GREASE_RESULT_SUBORDINATES_MOCK,
} from '@ga/testing/mocks';
import { GREASE_PDF_RESULT_MOCK } from '@ga/testing/mocks/models/pdf/grease-pdf-result.mock';

import { GreasePdfInput, GreasePdfMessage, GreasePdfResult } from '../models';
import { GreaseReportDataGeneratorService } from './grease-report-data-generator.service';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@ngneat/transloco'),
  translate: jest.fn((translateKey: string) => {
    switch (translateKey) {
      default:
        return translateKey.toString().replace('calculationResult.', '');
    }
  }),
}));

describe('GreaseReportDataGeneratorService', () => {
  let spectator: SpectatorService<GreaseReportDataGeneratorService>;
  let service: GreaseReportDataGeneratorService;
  let automaticallyLubricated = true;
  const localizeNumber = jest.fn((number) => `${number}`);

  const createService = createServiceFactory({
    service: GreaseReportDataGeneratorService,
    imports: [provideTranslocoTestingModule({ en: {} })],
    providers: [mockProvider(TranslocoLocaleService, { localizeNumber })],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('get disclaimer title', () => {
    it('should get translated title', () => {
      const dislaimerTitle = service.getDisclaimerTitle();

      expect(dislaimerTitle).toBe('legal.disclaimer');
    });
  });

  describe('prepare report input data', () => {
    it('should return formatted data', () => {
      const result: GreasePdfInput = service.prepareReportInputData(
        GREASE_RESULT_SUBORDINATES_MOCK
      );

      expect(result).toEqual(GREASE_PDF_INPUT_MOCK);
    });

    it('should gracefully return empty data if empty input provided', () => {
      const result: GreasePdfInput = service.prepareReportInputData([]);

      expect(result).toEqual({
        sectionTitle: GREASE_PDF_INPUT_MOCK.sectionTitle,
        tableItems: [],
      } as GreasePdfInput);
    });
  });

  describe('prepare report result data', () => {
    it('should return formatted data', () => {
      const result: GreasePdfResult = service.prepareReportResultData(
        GREASE_RESULT_SUBORDINATES_MOCK,
        automaticallyLubricated
      );

      expect(result).toEqual(GREASE_PDF_RESULT_MOCK);
    });

    it('should gracefully return empty data if empty input provided', () => {
      const result: GreasePdfResult = service.prepareReportResultData(
        [],
        automaticallyLubricated
      );

      expect(result).toEqual({
        sectionTitle: '',
        tableItems: [],
      } as GreasePdfResult);
    });
  });

  describe('prepare report result data for not autolubrciated configuration', () => {
    beforeEach(() => {
      automaticallyLubricated = false;
    });

    it('should exclude concept1 information from result', () => {
      const result: GreasePdfResult = service.prepareReportResultData(
        GREASE_RESULT_SUBORDINATES_MOCK,
        automaticallyLubricated
      );

      expect(result).toEqual({
        sectionTitle: GREASE_PDF_RESULT_MOCK.sectionTitle,
        tableItems: [
          {
            title: GREASE_PDF_RESULT_MOCK.tableItems[0].title,
            subTitle: GREASE_PDF_RESULT_MOCK.tableItems[0].subTitle,
            items: GREASE_PDF_RESULT_MOCK.tableItems[0].items,
            concept1: undefined,
          },
          {
            title: GREASE_PDF_RESULT_MOCK.tableItems[1].title,
            subTitle: GREASE_PDF_RESULT_MOCK.tableItems[1].subTitle,
            items: GREASE_PDF_RESULT_MOCK.tableItems[1].items,
            concept1: undefined,
          },
          {
            title: GREASE_PDF_RESULT_MOCK.tableItems[2].title,
            subTitle: GREASE_PDF_RESULT_MOCK.tableItems[2].subTitle,
            items: GREASE_PDF_RESULT_MOCK.tableItems[2].items,
            concept1: undefined,
          },
        ],
      });
      expect(localizeNumber).toBeCalled();
    });
  });

  describe('prepare report errors and warnings data', () => {
    it('should return formatted data', () => {
      const result: GreasePdfMessage =
        service.prepareReportErrorsAndWarningsData(
          GREASE_RESULT_SUBORDINATES_MOCK
        );

      expect(result).toEqual(GREASE_PDF_MESSAGE);
    });

    it('should gracefully return empty data if empty input provided', () => {
      const result: GreasePdfMessage =
        service.prepareReportErrorsAndWarningsData([]);

      expect(result).toEqual({
        sectionTitle: 'calculationResult.errorsWarningsNotes',
        messageItems: [],
      } as GreasePdfMessage);
    });
  });
});
