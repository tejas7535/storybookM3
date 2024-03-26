import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';

import { environment } from '@hc/environments/environment';
import {
  TRANSLOCO_PERSIST_LANG_STORAGE,
  TranslocoPersistLangModule,
} from '@ngneat/transloco-persist-lang';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import {
  AVAILABLE_LANGUAGES,
  FALLBACK_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
} from '../constants';

let defaultLang; // default -> undefined would lead to browser detection

@NgModule({
  imports: [
    // Material Modules
    MatSnackBarModule,

    // Translation
    SharedTranslocoModule.forRoot(
      environment.production,
      AVAILABLE_LANGUAGES,
      defaultLang, // default -> undefined would lead to browser detection
      FALLBACK_LANGUAGE.id,
      LANGUAGE_STORAGE_KEY,
      true,
      !environment.localDev
    ),
    TranslocoPersistLangModule.forRoot({
      storageKey: LANGUAGE_STORAGE_KEY,
      storage: {
        provide: TRANSLOCO_PERSIST_LANG_STORAGE,
        useValue: localStorage,
      },
    }),
    HttpClientModule,
  ],
  exports: [SharedTranslocoModule],
})
export class CoreModule {
  public constructor(
    private readonly matIconRegistry: MatIconRegistry,
    private readonly sanitizer: DomSanitizer
  ) {
    this.registerEAIcons();
  }

  public registerEAIcons(): void {
    const iconSet: Record<string, string> = {
      hardness_converter: 'hardness_converter.svg',
    };
    for (const [name, url] of Object.entries(iconSet)) {
      const setUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        `/assets/icons/${url}`
      );
      this.matIconRegistry.addSvgIcon(name, setUrl);
    }
  }
}
