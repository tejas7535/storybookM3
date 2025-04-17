import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';

import {
  catchError,
  forkJoin,
  fromEvent,
  map,
  Observable,
  of,
  switchMap,
  take,
  tap,
} from 'rxjs';

export const FONT_CACHE_EXPIRATION = new InjectionToken<number>(
  'Maximum lifetime of a FontConfig entry in the cache'
);
export const FONT_ASSET_PATH = new InjectionToken<string>(
  'Base path to load the font assets from'
);

export interface FontConfig {
  fontName: string;
  fontStyle: string;
  fileName: string;
  fontData?: string;
}

interface FontCache {
  lastUsed: number;
  config: FontConfig;
}

export interface LanguageFontMappings {
  [key: string]: FontConfig | FontConfig[];
}
export const LANGUAGE_FONT_MAPPINGS = new InjectionToken<LanguageFontMappings>(
  'Mapping object to map specific locales to different font types'
);

export const DEFAULT_FONT = new InjectionToken<FontConfig | FontConfig[]>(
  'Filename of the font that should be loaded by default'
);

export const fontConfigFactory = (
  fontName: string,
  fontStyle: 'Regular' | 'Bold' | 'Italic' | string = 'normal'
): FontConfig => ({
  fontName,
  fileName: `${fontName.replaceAll(' ', '-')}`,
  fontStyle,
});

const DEFAULT_CACHE_EXPIRATION = 5 * 60 * 1000;

@Injectable({ providedIn: 'root' })
export class FontResolverService {
  private readonly languageFontMappings = new Map<string, FontConfig[]>();
  private readonly defaultFont: FontConfig[];

  private readonly fontCache = new Map<string, FontCache>();

  /**
   * Font configurations are evicted from the cache after a set period of not being
   * requested.
   **/

  private readonly cacheExpirationMs: number;

  constructor(
    private readonly httpService: HttpClient,
    @Inject(DEFAULT_FONT) defaultFont: FontConfig,
    @Inject(FONT_ASSET_PATH) private readonly assetPath: string,
    @Optional() @Inject(FONT_CACHE_EXPIRATION) cacheExpiration: number,
    @Optional()
    @Inject(LANGUAGE_FONT_MAPPINGS)
    fontMappings?: LanguageFontMappings
  ) {
    this.handleFontMappings(fontMappings);

    this.defaultFont = this.getDefaultFont(defaultFont);

    this.cacheExpirationMs = cacheExpiration || DEFAULT_CACHE_EXPIRATION;
  }

  /**
   * Some fonts do not include the characters required by languages with a non Latin characterset (i.e. Chinese, etc).
   * Many fonts provide dedicated versions for such languages.
   * To make sure these fonts are available in the PDF context, they should be loaded as such when such a character set is required
   *
   * @param locale the locale currently active (usually managed by tansloco)
   **/
  public fetchForLocale(locale: string): Observable<FontConfig[]> {
    let font: FontConfig[];
    if (this.languageFontMappings.size === 0) {
      font = this.defaultFont;
    } else {
      const mappedFonts = this.languageFontMappings.get(locale);
      font = mappedFonts || this.defaultFont;
    }
    const basePath = this.cleanPath(this.assetPath);

    const fontRequests = font.map((iFont) => {
      const fontUrl = basePath + iFont.fileName;

      return this.hasCacheEntry(fontUrl)
        ? this.resolveCache(fontUrl)
        : this.makeFontRequest(fontUrl, iFont);
    });

    return forkJoin(fontRequests).pipe(
      tap((configs) => this.handleFontCacheUpdate(basePath, configs))
    );
  }

  private cleanPath(path: string) {
    return path.at(-1) === '/' ? path : `${path}/`;
  }

  private makeFontRequest(url: string, fontConfig: FontConfig) {
    return this.makeHttpRequest(url).pipe(
      switchMap((response) => this.handleFontBlob(response)),
      map((event) => this.parseBlobResult(event, fontConfig))
    );
  }

  private handleFontBlob(response: Blob) {
    const reader = new FileReader();
    const loadedEvent = fromEvent(reader, 'loadend');
    reader.readAsDataURL(response);

    return loadedEvent.pipe(take(1));
  }

  private parseBlobResult({ target }: Event, fontConfig: FontConfig) {
    if (!target) {
      throw new Error('failed to load font');
    }
    const components = ((target as FileReader).result as string).split(',');

    return { ...fontConfig, fontData: components[1] };
  }

  private makeHttpRequest(requestUrl: string) {
    return this.httpService
      .get(requestUrl, {
        responseType: 'blob' as 'json',
      })
      .pipe(
        catchError((err) => {
          console.error(`Failed to GET resource from ${requestUrl}:`, err);

          return of(err);
        })
      );
  }

  private handleFontCacheUpdate(baseUrl: string, fonts: FontConfig[]) {
    fonts.forEach((font) => {
      if (!font.fontData) {
        console.error(
          `Attempted to add ${font.fileName} to the cache, despite it missing the font data. Skipped this entry`
        );

        return;
      }
      const cacheKey = `${baseUrl}${font.fileName}`;

      if (this.fontCache.has(cacheKey)) {
        const updated = this.fontCache.get(cacheKey);
        updated!.lastUsed = Date.now();
        this.fontCache.set(cacheKey, updated!);
      } else {
        this.fontCache.set(cacheKey, {
          lastUsed: Date.now(),
          config: font,
        });
      }
    });
    this.handleCacheEviction();
  }

  private handleCacheEviction() {
    const checkDate = Date.now();
    for (const [key, val] of this.fontCache.entries()) {
      if (val.lastUsed + this.cacheExpirationMs < checkDate) {
        this.fontCache.delete(key);
      }
    }
  }

  private hasCacheEntry(fontUrl: string) {
    return this.fontCache.has(fontUrl);
  }

  private resolveCache(fontUrl: string) {
    return of(this.fontCache.get(fontUrl)!.config);
  }

  private handleFontMappings(fontMappings?: LanguageFontMappings): void {
    if (fontMappings) {
      Object.entries(fontMappings).forEach(([locale, config]) => {
        const fontConfig = Array.isArray(config) ? config : [config];
        this.languageFontMappings.set(locale, fontConfig);
      });
    }
  }

  private getDefaultFont(defaultFont: FontConfig | FontConfig[]): FontConfig[] {
    return Array.isArray(defaultFont) ? defaultFont : [defaultFont];
  }
}
