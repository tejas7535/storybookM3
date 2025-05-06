import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { waitForAsync } from '@angular/core/testing';

import { firstValueFrom, of } from 'rxjs';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import {
  MOCK_FONT_CONFIGS,
  MOCK_LANGUAGE_MAPPING,
} from './font-resolver.mocks';
import {
  DEFAULT_FONT,
  FONT_ASSET_PATH,
  FONT_CACHE_EXPIRATION,
  FontConfig,
  FontResolverService,
  LANGUAGE_FONT_MAPPINGS,
} from './font-resolver.service';

describe('FontResolverService', () => {
  let spectator: SpectatorService<FontResolverService>;
  let service: FontResolverService;

  let httpMock: HttpTestingController;

  const createService = createServiceFactory({
    service: FontResolverService,
    providers: [
      provideHttpClient(),
      provideHttpClientTesting(),
      {
        provide: FONT_CACHE_EXPIRATION,
        useValue: 100,
      },
      {
        provide: FONT_ASSET_PATH,
        useValue: '/test',
      },
      {
        provide: DEFAULT_FONT,
        useValue: MOCK_FONT_CONFIGS,
      },
      {
        provide: LANGUAGE_FONT_MAPPINGS,
        useValue: MOCK_LANGUAGE_MAPPING,
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    httpMock = spectator.inject(HttpTestingController);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
    expect(service['defaultFont'].length).toBeGreaterThan(0);
    expect(service['languageFontMappings'].size).toBeGreaterThan(0);
  });
  describe('Initialization', () => {
    describe('getDefaultFont', () => {
      it('should compose into an array for single fonts', () => {
        expect(service['getDefaultFont'](MOCK_FONT_CONFIGS[0])).toEqual([
          MOCK_FONT_CONFIGS[0],
        ]);
      });

      it('should compose return the array', () => {
        expect(service['getDefaultFont'](MOCK_FONT_CONFIGS)).toEqual(
          MOCK_FONT_CONFIGS
        );
      });
    });

    describe('handleFontMappings', () => {
      let mapSpy: jest.SpyInstance;
      beforeEach(
        () => (mapSpy = jest.spyOn(service['languageFontMappings'], 'set'))
      );

      it('should be skipped if no font mappings are provided', () => {
        service['handleFontMappings']();
        expect(mapSpy).not.toHaveBeenCalled();
      });

      it('should add the font configus for the provided mappings', () => {
        service['handleFontMappings'](MOCK_LANGUAGE_MAPPING);
        expect(mapSpy).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('CacheManagement', () => {
    describe('handleFontCacheUpdate', () => {
      let mapHasSpy: jest.SpyInstance;
      let mapSetSpy: jest.SpyInstance;
      let mapGetSpy: jest.SpyInstance;

      let hasCacheEntryMock: jest.Mock;
      let resolveCacheMock: jest.Mock;

      const mockFont: FontConfig = {
        fontName: 'NotSans',
        fontStyle: 'Regular',
        fileName: 'NotoSans.ttf',
        fontData: 'font data here',
      };

      beforeEach(() => {
        mapHasSpy = jest.spyOn(service['fontCache'], 'has');
        mapSetSpy = jest.spyOn(service['fontCache'], 'set');
        mapGetSpy = jest.spyOn(service['fontCache'], 'get');
        hasCacheEntryMock = jest.fn();
        resolveCacheMock = jest.fn();

        service['hasCacheEntry'] = hasCacheEntryMock;
        service['resolveCache'] = resolveCacheMock;
        service['handleCacheEviction'] = jest.fn();
      });

      it('should update the cache if the font is not already in the cache', () => {
        mapHasSpy.mockReturnValue(false);
        service['handleFontCacheUpdate']('/test/url/', [mockFont]);

        expect(mapHasSpy).toHaveBeenCalledWith(
          `/test/url/${mockFont.fileName}`
        );
        expect(mapSetSpy).toHaveBeenCalledTimes(1);
        expect(service['handleCacheEviction']).toHaveBeenCalled();
      });

      it('should update the last used timestamp of the cache entry', () => {
        mapHasSpy.mockReturnValue(true);
        mapGetSpy.mockReturnValue(mockFont);
        service['handleFontCacheUpdate']('/test/url/', [mockFont]);
        expect(mapGetSpy).toHaveBeenCalledWith(
          `/test/url/${mockFont.fileName}`
        );
        expect(mapSetSpy).toHaveBeenCalled();
      });

      it('should should skip when the font data is empty', () => {
        service['handleFontCacheUpdate']('/test/url/', [
          { ...mockFont, fontData: undefined },
        ]);

        expect(service['handleCacheEviction']).toHaveBeenCalled();
      });
    });

    describe('handleCacheEviction', () => {
      let mapDeleteSpy: jest.SpyInstance;

      const mockFont: FontConfig = {
        fontName: 'NotSans',
        fontStyle: 'Regular',
        fileName: 'NotoSans.ttf',
        fontData: 'font data here',
      };
      const mockFontUrl = '/test/font.ttf';

      beforeEach(() => {
        mapDeleteSpy = jest.spyOn(service['fontCache'], 'delete');
      });

      it('should kick out expired cache entries', () => {
        service['fontCache'].set(mockFontUrl, {
          lastUsed: 100,
          config: mockFont,
        });
        service['handleCacheEviction']();
        expect(mapDeleteSpy).toHaveBeenCalledWith(mockFontUrl);
      });

      it('should keep non expired entries', () => {
        service['fontCache'].set(mockFontUrl, {
          lastUsed: Date.now(),
          config: mockFont,
        });
        service['fontCache'].set(`${mockFontUrl}2`, {
          lastUsed: Date.now() + 300,
          config: mockFont,
        });
        service['handleCacheEviction']();
        expect(mapDeleteSpy).not.toHaveBeenCalledWith(mockFontUrl);
      });
    });
  });

  it('cleanPath should return a clean path', () => {
    expect(service['cleanPath']('/test/')).toEqual('/test/');
    expect(service['cleanPath']('/test')).toEqual('/test/');
  });

  describe('parseBlobResult', () => {
    const fakeEvent = {
      target: { result: 'data:font/ttf;base64,abcdefg' } as any,
    };
    const mockFont: FontConfig = {
      fontName: 'NotSans',
      fontStyle: 'Regular',
      fileName: 'NotoSans.ttf',
    };

    it('errors when target is not present', () => {
      expect(() => service['parseBlobResult']({} as Event, mockFont)).toThrow();
    });

    it('should return a parsed result', () => {
      const result = service['parseBlobResult'](fakeEvent as Event, mockFont);
      expect(result).toEqual({ ...mockFont, fontData: 'abcdefg' });
    });
  });

  it('makeHttpRequest should start an http request', waitForAsync(async () => {
    const fontUrl = '/assets/font.ttf';
    service['makeHttpRequest'](fontUrl).subscribe((ret) => {
      expect(ret).toBeTruthy();
    });

    const req = httpMock.expectOne(fontUrl);
    req.flush(new Blob([''], { type: 'font/ttf' }));
    expect(req.request.method).toEqual('GET');
    expect(req.request.responseType).toEqual('blob');
  }));

  it('makeFontRequest should reach out to the helper functions', () => {
    const fakeEvent = {
      target: { result: 'data:font/ttf;base64,abcdefg' } as any,
    };

    const mockFont: FontConfig = {
      fontName: 'NotSans',
      fontStyle: 'Regular',
      fileName: 'NotoSans.ttf',
    };
    const fakeBlob = new Blob(['test'], { type: 'font/ttf' });
    service['makeHttpRequest'] = jest.fn(() => of(fakeBlob));
    service['handleFontBlob'] = jest.fn(() => of(fakeEvent as any));
    service['parseBlobResult'] = jest.fn(() => ({
      ...mockFont,
      fontData: 'testdata',
    }));

    service['makeFontRequest'](
      '/assets/fonts/NotoSans.ttf',
      mockFont
    ).subscribe((conf) => {
      expect(conf.fileName).toEqual(mockFont.fileName);
      expect(conf.fontName).toEqual(mockFont.fontName);
      expect(conf.fontStyle).toEqual(mockFont.fontStyle);
      expect(conf.fontData).toEqual('testdata');
    });

    expect(service['makeHttpRequest']).toHaveBeenCalledWith(
      '/assets/fonts/NotoSans.ttf'
    );
    expect(service['handleFontBlob']).toHaveBeenCalled();
    expect(service['parseBlobResult']).toHaveBeenCalled();
  });

  describe('Cache', () => {
    it('should check for presence in the cache', () => {
      const fontCacheHasSpy = jest
        .spyOn(service['fontCache'], 'has')
        .mockReturnValue(true);
      expect(service['hasCacheEntry']('example.com')).toEqual(true);
      expect(fontCacheHasSpy).toHaveBeenCalled();
    });

    it('should resolve the cache entry', waitForAsync(async () => {
      const fontCacheGetSpy = jest
        .spyOn(service['fontCache'], 'get')
        .mockReturnValue({ config: 'example' } as any);
      const val = await firstValueFrom(service['resolveCache']('example.com'));

      expect(val).toBe('example');
      expect(fontCacheGetSpy).toHaveBeenCalled();
    }));
  });
});
