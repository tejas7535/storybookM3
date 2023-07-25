/* eslint-disable unicorn/consistent-function-scoping */
import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
  SpyObject,
} from '@ngneat/spectator/jest';

import {
  GREASE_PDF_INPUT_MOCK,
  GREASE_PDF_MESSAGE,
  GREASE_PDF_RESULT_MOCK,
} from '@ga/testing/mocks';

import { GreaseReportDataGeneratorService } from './grease-report-data-generator.service';
import { GreaseReportPdfGeneratorService } from './grease-report-pdf-generator.service';

const saveFile = jest.fn();
const textSpy = jest.fn();
const fontSpy = jest.fn();

jest.mock(
  'jspdf',
  () =>
    function () {
      return {
        internal: {
          pageSize: {
            getHeight: jest.fn(() => 400),
            getWidth: jest.fn(() => 200),
          },
        },
        lastAutoTable: {
          finalY: undefined,
        },
        setFont: fontSpy,
        setFontSize: jest.fn(),
        text: textSpy,
        splitTextToSize: jest.fn(() => ['text 1', 'text 2']),
        addPage: jest.fn(),
        save: saveFile,
      };
    }
);

jest.mock(
  'jspdf-autotable',
  () =>
    function () {
      return {
        autotable: jest.fn(),
      };
    }
);

describe('GreaseReportPdfGeneratorService', () => {
  let spectator: SpectatorService<GreaseReportPdfGeneratorService>;
  let service: GreaseReportPdfGeneratorService;
  let dataServiceSpy: SpyObject<GreaseReportDataGeneratorService>;

  const createService = createServiceFactory({
    service: GreaseReportPdfGeneratorService,
    providers: [mockProvider(GreaseReportDataGeneratorService)],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    dataServiceSpy = spectator.inject(GreaseReportDataGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when report is generated', () => {
    beforeEach(() => {
      dataServiceSpy.prepareReportInputData.andReturn(GREASE_PDF_INPUT_MOCK);
      dataServiceSpy.prepareReportResultData.andReturn(GREASE_PDF_RESULT_MOCK);
      dataServiceSpy.prepareReportErrorsAndWarningsData.andReturn(
        GREASE_PDF_MESSAGE
      );

      service.generateReport({
        reportTitle: 'report title',
        legalNote: 'legal note info',
        data: [],
      });
    });

    it('should print report title', () => {
      expect(textSpy).toHaveBeenCalledWith('report title', 100, 10, {
        align: 'center',
      });
    });

    it('should set document font style', () => {
      expect(fontSpy).toHaveBeenCalledWith(
        service.fontFamily,
        service.fontStyle
      );
    });

    it('should generate input section', () => {
      expect(dataServiceSpy.prepareReportInputData).toHaveBeenCalled();
      expect(textSpy).toBeCalledWith(
        GREASE_PDF_INPUT_MOCK.sectionTitle,
        100,
        expect.any(Number),
        {
          align: 'center',
        }
      );
    });

    it('should generate result data', () => {
      expect(dataServiceSpy.prepareReportResultData).toHaveBeenCalled();
      expect(textSpy).toBeCalledWith(
        GREASE_PDF_RESULT_MOCK.sectionTitle,
        100,
        expect.any(Number),
        {
          align: 'center',
        }
      );
    });

    it('should generate errors and warning data', () => {
      expect(
        dataServiceSpy.prepareReportErrorsAndWarningsData
      ).toHaveBeenCalled();

      expect(textSpy).toBeCalledWith(
        GREASE_PDF_RESULT_MOCK.sectionTitle,
        100,
        expect.any(Number),
        {
          align: 'center',
        }
      );
    });

    it('should save file to pdf', () => {
      expect(saveFile).toHaveBeenCalledWith('greaseReport.pdf', {
        returnPromise: true,
      });
    });
  });
});
