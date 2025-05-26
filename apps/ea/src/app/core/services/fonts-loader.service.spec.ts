import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { waitForAsync } from '@angular/core/testing';

import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';

import { TranslocoService } from '@jsverse/transloco';
import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from '@ngneat/spectator/jest';
import jsPDF from 'jspdf';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { FontsLoaderService } from './fonts-loader.service';
import { DocumentFonts } from './pdfreport/data';

const assetsPath = 'assetPath';
jest.mock(
  '@ea/core/services/assets-path-resolver/assets-path-resolver.helper',
  () => ({
    getAssetsPath: jest.fn(() => assetsPath),
  })
);

describe('FontsLoaderService', () => {
  let spectator: SpectatorService<FontsLoaderService>;
  let service: FontsLoaderService;
  let httpMock: HttpTestingController;
  const assetBasePath = assetsPath;

  const langChanges$ = new BehaviorSubject<string>('zh');
  const langChangesObservable$: Observable<string> =
    langChanges$.asObservable();

  const translocoServiceMock = {
    langChanges$: langChangesObservable$,
    getActiveLang: jest.fn(),
  };

  const jspdfReport = {
    addFileToVFS: jest.fn(),
    addFont: jest.fn(),
  } as unknown as jsPDF;

  const createService = createServiceFactory({
    service: FontsLoaderService,
    imports: [
      HttpClientTestingModule,
      provideTranslocoTestingModule({ zh: {} }),
    ],
    providers: [mockProvider(TranslocoService, translocoServiceMock)],
  });

  beforeEach(() => {
    translocoServiceMock.getActiveLang.mockReturnValue('zh');
    spectator = createService();
    service = spectator.service;
    httpMock = spectator.inject(HttpTestingController);

    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when created', () => {
    it('should load inital fonts', () => {
      const regularFontUrl = `${assetBasePath}/fonts/EASans-Regular.ttf`;
      const boldFontUrl = `${assetBasePath}/fonts/EASans-Bold.ttf`;
      const chineseRegularFontUrl = `${assetBasePath}/fonts/EASansSC-Regular.ttf`;
      const chineseBoldFontUrl = `${assetBasePath}/fonts/EASansSC-Bold.ttf`;

      const regularFontRequest = httpMock.expectOne(regularFontUrl);
      expect(regularFontRequest.request.method).toBe('GET');

      const boldFontRequest = httpMock.expectOne(boldFontUrl);
      expect(boldFontRequest.request.method).toBe('GET');

      const regularChineseFontRequest = httpMock.expectOne(
        chineseRegularFontUrl
      );
      expect(regularChineseFontRequest.request.method).toBe('GET');

      const boldChineseFontRequest = httpMock.expectOne(chineseBoldFontUrl);
      expect(boldChineseFontRequest.request.method).toBe('GET');

      httpMock.verify();
    });
  });

  describe('when loading fonts', () => {
    it('should load forms', () => {
      service.loadFonts(jspdfReport);

      expect(jspdfReport.addFileToVFS).toHaveBeenCalledWith(
        'EASans-Regular.ttf',
        undefined
      );

      expect(jspdfReport.addFileToVFS).toHaveBeenCalledWith(
        'EASans-Bold.ttf',
        undefined
      );

      expect(jspdfReport.addFont).toHaveBeenCalledWith(
        'EASans-Regular.ttf',
        DocumentFonts.family,
        DocumentFonts.style.normal
      );

      expect(jspdfReport.addFont).toHaveBeenCalledWith(
        'EASans-Bold.ttf',
        DocumentFonts.family,
        DocumentFonts.style.bold
      );

      expect(jspdfReport.addFileToVFS).toHaveBeenCalledWith(
        'EASansSC-Regular.ttf',
        undefined
      );

      expect(jspdfReport.addFileToVFS).toHaveBeenCalledWith(
        'EASansSC-Bold.ttf',
        undefined
      );

      expect(jspdfReport.addFont).toHaveBeenCalledWith(
        'EASansSC-Regular.ttf',
        DocumentFonts.family,
        DocumentFonts.style.normal
      );

      expect(jspdfReport.addFont).toHaveBeenCalledWith(
        'EASansSC-Bold.ttf',
        DocumentFonts.family,
        DocumentFonts.style.bold
      );
    });
  });

  describe('when languge is changed to special characters one', () => {
    beforeEach(() => {
      langChanges$.next('zh_TW');
    });

    it('should load additional font', waitForAsync(() => {
      const regularFontUrl = `${assetBasePath}/fonts/EASansTC-Regular.ttf`;
      const boldFontUrl = `${assetBasePath}/fonts/EASansTC-Bold.ttf`;

      const regularFontRequest = httpMock.expectOne(regularFontUrl);
      expect(regularFontRequest.request.method).toBe('GET');

      const boldFontRequest = httpMock.expectOne(boldFontUrl);
      expect(boldFontRequest.request.method).toBe('GET');
    }));
  });
});
