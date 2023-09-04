/* eslint-disable unicorn/consistent-function-scoping */
import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
  SpyObject,
} from '@ngneat/spectator/jest';
import { TranslocoDatePipe } from '@ngneat/transloco-locale';

import {
  GREASE_PDF_INPUT_MOCK,
  GREASE_PDF_MESSAGE,
  GREASE_PDF_RESULT_MOCK,
} from '@ga/testing/mocks';

import {
  NotoSansBold,
  NotoSansRegular,
} from '../constants/pdf-report/report-fonts';
import { schaefflerLogo } from '../constants/pdf-report/report-logo';
import { GreaseReportDataGeneratorService } from './grease-report-data-generator.service';
import { GreaseReportPdfGeneratorService } from './grease-report-pdf-generator.service';

const saveFile = jest.fn();
const textSpy = jest.fn();
const fontSpy = jest.fn();
const addFontSpy = jest.fn();
const setPageSpy = jest.fn();
const addImageSpy = jest.fn();
const addFileToVFSSpy = jest.fn();

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
          pages: [undefined, 1, 2],
        },
        lastAutoTable: {
          finalY: undefined,
        },
        addFont: addFontSpy,
        setFont: fontSpy,
        setPage: setPageSpy,
        setFontSize: jest.fn(),
        getFontSize: jest.fn(),
        getStringUnitWidth: jest.fn(),
        addImage: addImageSpy,
        addFileToVFS: addFileToVFSSpy,
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
  const pageMargin = 35;
  const REPORT_GENERATION_DATE = '2022-11-14T00:00:00Z';

  const createService = createServiceFactory({
    service: GreaseReportPdfGeneratorService,
    providers: [
      mockProvider(GreaseReportDataGeneratorService),
      mockProvider(TranslocoDatePipe, { transform: () => '14.11.2022' }),
    ],
  });

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(Date.parse(REPORT_GENERATION_DATE));
    spectator = createService();
    service = spectator.service;
    dataServiceSpy = spectator.inject(GreaseReportDataGeneratorService);
  });

  afterEach(() => {
    jest.useRealTimers();
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
        sectionSubTitle: 'All results refer to continuous 24/7 operation.',
        legalNote: 'legal note info',
        data: [],
        automaticLubrication: true,
      });
    });

    it('should load NotoSans fonts', () => {
      expect(addFileToVFSSpy).toBeCalledWith(
        'NotoSans-Regular.ttf',
        NotoSansRegular
      );

      expect(addFontSpy).toHaveBeenCalledWith(
        'NotoSans-Regular.ttf',
        'NotoSans',
        'normal'
      );

      expect(addFileToVFSSpy).toBeCalledWith('NotoSans-Bold.ttf', NotoSansBold);

      expect(addFontSpy).toHaveBeenCalledWith(
        'NotoSans-Bold.ttf',
        'NotoSans',
        'bold'
      );

      expect(addFontSpy).toBeCalledTimes(2);
      expect(addFileToVFSSpy).toBeCalledTimes(2);
    });

    it('should print report title', () => {
      expect(textSpy).toHaveBeenCalledWith(
        'report title',
        pageMargin,
        expect.any(Number)
      );
    });

    it('should set document font style', () => {
      expect(fontSpy).toHaveBeenCalledWith(
        service.fontFamily,
        service.fontBoldStyle
      );
    });

    it('should generate input section', () => {
      expect(dataServiceSpy.prepareReportInputData).toHaveBeenCalled();
      expect(textSpy).toBeCalledWith(
        GREASE_PDF_INPUT_MOCK.sectionTitle,
        pageMargin,
        expect.any(Number)
      );
    });

    it('should generate result data', () => {
      expect(dataServiceSpy.prepareReportResultData).toHaveBeenCalled();
      expect(textSpy).toBeCalledWith(
        GREASE_PDF_RESULT_MOCK.sectionTitle,
        pageMargin,
        expect.any(Number)
      );
    });

    it('should generate errors and warning data', () => {
      expect(
        dataServiceSpy.prepareReportErrorsAndWarningsData
      ).toHaveBeenCalled();

      expect(textSpy).toBeCalledWith(
        GREASE_PDF_RESULT_MOCK.sectionTitle,
        pageMargin,
        expect.any(Number)
      );
    });

    it('should save file to pdf', () => {
      expect(saveFile).toHaveBeenCalledWith(
        'Grease App report title - 14.11.2022.pdf',
        {
          returnPromise: true,
        }
      );
    });

    it('should generate page numbers', () => {
      const xPositionValue = 200 - 2 * pageMargin;
      const yPositionValue = 400 - 25;

      expect(textSpy).toHaveBeenCalledWith(
        '1/2',
        xPositionValue,
        yPositionValue
      );
      expect(textSpy).toHaveBeenCalledWith(
        '2/2',
        xPositionValue,
        yPositionValue
      );
    });

    it('should load image for every page', () => {
      expect(addImageSpy).toHaveBeenCalledWith(
        schaefflerLogo,
        'png',
        21,
        pageMargin + 1,
        160,
        47
      );
    });
  });
});
