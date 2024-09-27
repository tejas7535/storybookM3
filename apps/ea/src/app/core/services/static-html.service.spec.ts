import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { waitForAsync } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';

import { of } from 'rxjs';

import { TranslocoService } from '@jsverse/transloco';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { StaticHTMLService } from './static-html.service';

const assetsPath = 'assetPath';
jest.mock(
  '@ea/core/services/assets-path-resolver/assets-path-resolver.helper',
  () => ({
    getAssetsPath: jest.fn(() => assetsPath),
  })
);

describe('Static HTML Service', () => {
  let spectator: SpectatorService<StaticHTMLService>;
  let httpMock: HttpTestingController;
  let htmlService: StaticHTMLService;

  const createService = createServiceFactory({
    service: StaticHTMLService,
    imports: [provideTranslocoTestingModule({ en: {} })],
    providers: [
      {
        provide: DomSanitizer,
        useValue: {
          bypassSecurityTrustHtml: jest.fn(() => 'Hello World'),
        },
      },
      {
        provide: TranslocoService,
        useValue: {
          translate: jest.fn(() => '/test.html'),
        },
      },
      provideHttpClient(),
      provideHttpClientTesting(),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    htmlService = spectator.service;
    httpMock = spectator.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(htmlService).toBeDefined();
  });

  describe('getHtmlContentByTranslationKey', () => {
    it('should call to retrieve the HTML file when called with a leading /', waitForAsync(() => {
      htmlService.getHtmlContent = jest.fn(() =>
        of('Hello World! - HTML Content Mock')
      );
      const expectedFileUrl = `${assetsPath}/test.html`;
      htmlService
        .getHtmlContentByTranslationKey(
          'calculationResultReport.calculationDisclaimer.disclaimerFile'
        )
        .subscribe((safeHtml) => {
          expect(htmlService.getHtmlContent).toHaveBeenCalledWith(
            expectedFileUrl
          );
          expect(safeHtml).toBe('Hello World! - HTML Content Mock');
        });

      expect(htmlService['translocoService'].translate).toHaveBeenCalledWith(
        'calculationResultReport.calculationDisclaimer.disclaimerFile',
        undefined
      );
    }));
    it('should call to retrieve the HTML file when called without a leading /', waitForAsync(() => {
      htmlService['translocoService'].translate = jest
        .fn()
        .mockImplementation(() => 'test.html');

      htmlService.getHtmlContent = jest.fn(() =>
        of('Hello World! - HTML Content Mock')
      );
      expect(htmlService['translocoService'].translate('test')).toBe(
        'test.html'
      );
      const expectedFileUrl = `${assetsPath}/test.html`;
      htmlService
        .getHtmlContentByTranslationKey(
          'calculationResultReport.calculationDisclaimer.disclaimerFile'
        )
        .subscribe((safeHtml) => {
          expect(htmlService.getHtmlContent).toHaveBeenCalledWith(
            expectedFileUrl
          );
          expect(safeHtml).toBe('Hello World! - HTML Content Mock');
        });

      expect(htmlService['translocoService'].translate).toHaveBeenCalledWith(
        'calculationResultReport.calculationDisclaimer.disclaimerFile',
        undefined
      );
    }));
  });

  describe('getHtmlContent', () => {
    it('should request a given file and return the HTML contents', waitForAsync(() => {
      const requestUrl = '/assets/test.html';

      htmlService.getHtmlContent(requestUrl).subscribe((html) => {
        expect(html).toBe('Hello World');
        expect(
          htmlService['domSanitizer'].bypassSecurityTrustHtml
        ).toHaveBeenCalledWith('Hello World! HTTP Mock');
      });
      const req = httpMock.expectOne(requestUrl);
      expect(req.request.method).toBe('GET');

      req.flush('Hello World! HTTP Mock');
    }));
  });
});
