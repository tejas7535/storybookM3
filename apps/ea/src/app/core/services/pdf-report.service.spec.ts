import { waitForAsync } from '@angular/core/testing';

import { of } from 'rxjs';

import { ResultReportLargeItem } from '@ea/calculation/calculation-result-report-large-items/result-report-large-item';
import { APP_STATE_MOCK } from '@ea/testing/mocks';
import { TranslocoService } from '@jsverse/transloco';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from '@ngneat/spectator/jest';
import { provideMockStore } from '@ngrx/store/testing';

import { ProductSelectionFacade } from '../store';
import { FontsLoaderService } from './fonts-loader.service';
import { PDFReportService } from './pdf-report.service';

const MOCK_RESULT_ITEMS: ResultReportLargeItem[] = [
  {
    value: 1,
    title: 'test 1',
    short: 'abc',
    unit: 'abc',
  },
  {
    value: 10,
    title: 'test 2',
    short: 'abc',
    unit: 'abc',
  },
];
const mockResultBlock = { header: 'Test', data: MOCK_RESULT_ITEMS };

describe('PDFReportService', () => {
  let pdfReportService: PDFReportService;
  let spectator: SpectatorService<PDFReportService>;

  const createService = createServiceFactory({
    service: PDFReportService,
    providers: [
      PDFReportService,
      provideMockStore({ initialState: APP_STATE_MOCK }),
      mockProvider(TranslocoService),
      mockProvider(FontsLoaderService),
      mockProvider(TranslocoLocaleService, {
        getLocale: jest.fn(() => 'en-US'),
        localizeDate: jest.fn(() => '1.1.1970'),
      }),
      mockProvider(ProductSelectionFacade, {
        bearingDesignation$: of('6226'),
      }),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    pdfReportService = spectator.service;
  });

  it('should be created', () => {
    expect(pdfReportService).toBeDefined();
  });

  it('generate filename should generate a localized filename', waitForAsync(async () => {
    (
      pdfReportService['translocoService'].translate as jest.Mock
    ).mockReturnValue('Report');
    const filename = await pdfReportService.generateFilename();
    expect(pdfReportService['translocoService'].translate).toHaveBeenCalledWith(
      'pdfReport.filename',
      { designation: '6226', date: '1-1-1970' }
    );
    expect(filename).toEqual('Report');
  }));

  it('loadTranslationBlock should match snapshot', () => {
    expect(
      pdfReportService['loadTranslationBlock'](
        'ratingLife',
        mockResultBlock,
        'de'
      )
    ).toMatchSnapshot();
  });

  it('localize number formats should match snapshot', () => {
    expect(
      pdfReportService['localizeNumberFormats'](mockResultBlock)
    ).toMatchSnapshot();
  });

  it('translate emission should match snapshot', () => {
    expect(
      pdfReportService['translateEmission']('key', 'de')
    ).toMatchSnapshot();
  });
});
