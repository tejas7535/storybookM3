/* eslint-disable import/no-extraneous-dependencies */
import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';

import { Observable, Subject, takeUntil } from 'rxjs';

import { TranslocoService } from '@ngneat/transloco';
import jsPDF from 'jspdf';

import {
  LANGUAGE_CHINESE,
  LANGUAGE_JAPANESE,
  LANGUAGE_KOREAN,
  LANGUAGE_THAI,
} from '@ga/shared/constants/language';

import { fontFamily, fontType } from './fonts.constants';

interface NotoSansFont {
  regularFontName: string;
  boldFontName: string;
  regularfontValue?: string;
  boldFontValue?: string;
}

@Injectable()
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
      LANGUAGE_CHINESE.id,
      {
        regularFontName: 'NotoSansSC-Regular.ttf',
        boldFontName: 'NotoSansSC-Bold.ttf',
      },
    ],
    [
      LANGUAGE_KOREAN.id,
      {
        regularFontName: 'NotoSansKR-Regular.ttf',
        boldFontName: 'NotoSansKR-Bold.ttf',
      },
    ],
    [
      LANGUAGE_JAPANESE.id,
      {
        regularFontName: 'NotoSansJP-Regular.ttf',
        boldFontName: 'NotoSansJP-Bold.ttf',
      },
    ],
    [
      LANGUAGE_THAI.id,
      {
        regularFontName: 'NotoSansThai_SemiCondensed-Regular.ttf',
        boldFontName: 'NotoSansThai_SemiCondensed-Bold.ttf',
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
    doc.addFont(fileName, fontFamily, fontType.Normal);
  }

  private addBoldFont(doc: jsPDF, fileName: string, fileContent: string): void {
    doc.addFileToVFS(fileName, fileContent);
    doc.addFont(fileName, fontFamily, fontType.Bold);
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
    return this.httpClient.get(`/assets/fonts/${fontName}`, {
      responseType: 'blob' as 'json',
    });
  }

  private getFontResultFromReader(reader: FileReader): string {
    return (reader.result as string).split(',')[1];
  }
}
