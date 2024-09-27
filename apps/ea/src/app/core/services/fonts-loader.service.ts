import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';

import { Observable, Subject, takeUntil } from 'rxjs';

import { getAssetsPath } from '@ea/core/services/assets-path-resolver/assets-path-resolver.helper';
import { LANGUAGE_ZH, LANGUAGE_ZH_TW } from '@ea/shared/constants/language';
import { TranslocoService } from '@jsverse/transloco';
import jsPDF from 'jspdf';

import { DocumentFonts } from './pdfreport/data';

interface NotoSansFont {
  regularFontName: string;
  boldFontName: string;
  regularfontValue?: string;
  boldFontValue?: string;
}

@Injectable({ providedIn: 'root' })
export class FontsLoaderService implements OnDestroy {
  private readonly notoSansFonts: Map<string, NotoSansFont> = new Map([
    [
      'defaultFont',
      {
        regularFontName: 'NotoSans-Regular.ttf',
        boldFontName: 'NotoSans-Bold.ttf',
      },
    ],
    [
      LANGUAGE_ZH.id,
      {
        regularFontName: 'NotoSansSC-Regular.ttf',
        boldFontName: 'NotoSansSC-Bold.ttf',
      },
    ],
    [
      LANGUAGE_ZH_TW.id,
      {
        regularFontName: 'NotoSansTC-Regular.ttf',
        boldFontName: 'NotoSansTC-Bold.ttf',
      },
    ],
  ]);

  private readonly destroy$ = new Subject<void>();

  public constructor(
    private readonly translocoService: TranslocoService,
    private readonly httpClient: HttpClient
  ) {
    const currentLanguage = translocoService.getActiveLang();
    this.loadFontFromAsset('defaultFont');

    this.loadFontForLanuage(currentLanguage);

    this.translocoService.langChanges$
      .pipe(takeUntil(this.destroy$))

      .subscribe((language: string) => {
        if (language !== currentLanguage) {
          this.loadFontForLanuage(language);
        }
      });
  }

  public ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public loadFonts(doc: jsPDF): void {
    this.addFontToReport(doc, this.notoSansFonts.get('defaultFont'));
    this.loadAdditionalFontsForSpecificLanuage(doc);
  }

  private loadFontForLanuage(language: string): void {
    if (this.notoSansFonts.has(language)) {
      this.loadFontFromAsset(language);
    }
  }

  private loadAdditionalFontsForSpecificLanuage(doc: jsPDF): void {
    const currentLanguage = this.translocoService.getActiveLang();

    if (this.notoSansFonts.has(currentLanguage)) {
      this.addFontToReport(doc, this.notoSansFonts.get(currentLanguage));
    }
  }

  private addFontToReport(doc: jsPDF, font: NotoSansFont): void {
    this.addNormalFont(doc, font.regularFontName, font.regularfontValue);
    this.addBoldFont(doc, font.boldFontName, font.boldFontValue);
  }

  private addNormalFont(
    doc: jsPDF,
    fileName: string,
    fileContent: string
  ): void {
    doc.addFileToVFS(fileName, fileContent);
    doc.addFont(fileName, DocumentFonts.family, DocumentFonts.style.normal);
  }

  private addBoldFont(doc: jsPDF, fileName: string, fileContent: string): void {
    doc.addFileToVFS(fileName, fileContent);
    doc.addFont(fileName, DocumentFonts.family, DocumentFonts.style.bold);
  }

  private loadFontFromAsset(notoStansKey: string): void {
    const currentFont: NotoSansFont = this.notoSansFonts.get(notoStansKey);

    this.getFontFromAssetsByName(currentFont.regularFontName).subscribe(
      (response) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          currentFont.regularfontValue = this.getFontResultFromReader(reader);
        };

        reader.readAsDataURL(response as Blob);
      }
    );

    this.getFontFromAssetsByName(currentFont.boldFontName).subscribe(
      (response) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          currentFont.boldFontValue = this.getFontResultFromReader(reader);
        };

        reader.readAsDataURL(response as Blob);
      }
    );
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  private getFontFromAssetsByName(fontName: string): Observable<Object> {
    const assetsPath = getAssetsPath();

    return this.httpClient.get(`${assetsPath}/fonts/${fontName}`, {
      responseType: 'blob' as 'json',
    });
  }

  private getFontResultFromReader(reader: FileReader): string {
    return (reader.result as string).split(',')[1];
  }
}
