import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { map, Observable } from 'rxjs';

import { environment } from '@ea/environments/environment';
import { HashMap, TranslocoService } from '@ngneat/transloco';
@Injectable({ providedIn: 'root' })
export class StaticHTMLService {
  constructor(
    private readonly translocoService: TranslocoService,
    private readonly httpClient: HttpClient,
    private readonly domSanitizer: DomSanitizer
  ) {}

  /**
   * Loads a html file based on a localized translation key
   *
   * NOTE: Potentially unsafe for unknown sources, bypasses HTML sanitizing. USe with caution
   *
   * @param localizationKey the key of the translation
   * @param localizationParams (optional) parameters for the transloco.translate function
   * @returns Observable<SafeHtml>
   */
  getHtmlContentByTranslationKey(
    localizationKey: string,
    localizationParams?: HashMap
  ): Observable<SafeHtml> {
    let localizedFilePath = this.translocoService.translate(
      localizationKey,
      localizationParams
    );
    localizedFilePath =
      localizedFilePath.indexOf('/') === 0
        ? localizedFilePath
        : `/${localizedFilePath}`;

    return this.getHtmlContent(`${environment.assetsPath}${localizedFilePath}`);
  }

  /**
   * Loads a html file from a given url and returns it as a SafeHtml
   *
   * NOTE: This is potentially unsafe because it skips the sanitization process. Use with caution
   *
   * @param fileUrl path to the html file
   * @returns Observable<SafeHtml>
   */
  getHtmlContent(fileUrl: string): Observable<SafeHtml> {
    return this.httpClient
      .get(fileUrl, {
        responseType: 'text',
      })
      .pipe(
        map((response) => this.domSanitizer.bypassSecurityTrustHtml(response))
      );
  }
}
