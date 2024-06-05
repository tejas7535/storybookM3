/* eslint-disable unicorn/consistent-function-scoping */
import { of } from 'rxjs';

import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
  SpyObject,
} from '@ngneat/spectator/jest';

import { SettingsFacade } from '@ga/core/store/facades/settings.facade';
import {
  GREASE_PDF_INPUT_MOCK,
  GREASE_PDF_MESSAGE,
  GREASE_PDF_RESULT_MOCK,
} from '@ga/testing/mocks';

import { GreaseReportDataGeneratorService } from '../grease-report-data-generator.service';
import { fontFamily, fontType } from './fonts.constants';
import { FontsLoaderService } from './fonts-loader.service';
import { GreaseReportPdfFileSaveService } from './grease-report-pdf-file-save.service';
import { GreaseReportPdfGeneratorService } from './grease-report-pdf-generator.service';
import { ImageLoaderService } from './image-loader.service';

const saveFile = jest.fn();
const textSpy = jest.fn();
const fontSpy = jest.fn();
const setPageSpy = jest.fn();
const addImageSpy = jest.fn();

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
        setFont: fontSpy,
        setPage: setPageSpy,
        setFontSize: jest.fn(),
        getFontSize: jest.fn(),
        getStringUnitWidth: jest.fn(),
        addImage: addImageSpy,
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
  let saveFileServiceSpy: SpyObject<GreaseReportPdfFileSaveService>;
  let fontsLoaderServiceSpy: SpyObject<FontsLoaderService>;
  const pageMargin = 35;
  const REPORT_GENERATION_DATE = '2022-11-14T00:00:00Z';

  const createService = createServiceFactory({
    service: GreaseReportPdfGeneratorService,
    providers: [
      mockProvider(GreaseReportDataGeneratorService),
      mockProvider(TranslocoLocaleService, {
        localizeDate: () => '14.11.2022',
      }),
      mockProvider(GreaseReportPdfFileSaveService),
      mockProvider(FontsLoaderService),
      {
        provide: ImageLoaderService,
        useValue: {
          schaefflerLogo$: of('schaefflerLogo'),
          partnerLogo$: of('partnerLogo'),
        },
      },
      {
        provide: SettingsFacade,
        useValue: {
          partnerVersion$: of(undefined),
        },
      },
    ],
  });

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(Date.parse(REPORT_GENERATION_DATE));
    spectator = createService();
    service = spectator.service;
    dataServiceSpy = spectator.inject(GreaseReportDataGeneratorService);
    saveFileServiceSpy = spectator.inject(GreaseReportPdfFileSaveService);
    fontsLoaderServiceSpy = spectator.inject(FontsLoaderService);
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
      expect(fontsLoaderServiceSpy.loadFonts).toBeCalled();
    });

    it('should print report title', () => {
      const reportTitle = 'report title';
      const expectedX = pageMargin;
      const expectedY = expect.any(Number);

      expect(textSpy).toHaveBeenCalledWith(reportTitle, expectedX, expectedY);
    });

    it('should set document font style', () => {
      expect(fontSpy).toHaveBeenCalledWith(fontFamily, fontType.Bold);
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
      expect(saveFileServiceSpy.saveAndOpenFile).toHaveBeenCalledWith(
        expect.any(Object),
        'Grease App report title - 14.11.2022.pdf'
      );
    });

    it('should generate page numbers', () => {
      const xPositionValue = 200 - 2 * pageMargin;
      const yPositionValue = 400 - 10;

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
        'schaefflerLogo',
        'png',
        36,
        pageMargin - 10 + 1,
        130,
        16
      );
    });
  });
});
