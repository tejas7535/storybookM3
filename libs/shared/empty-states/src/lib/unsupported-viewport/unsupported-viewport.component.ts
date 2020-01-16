import { Component } from '@angular/core';

import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { sharedScopeLoader } from '@schaeffler/shared/transloco';

// tslint:disable-next-line: only-arrow-functions
export async function importer(lang: string, root: string): Promise<any> {
  return import(`./${root}/${lang}.json`);
}

@Component({
  selector: 'schaeffler-unsupported-viewport',
  templateUrl: './unsupported-viewport.component.html',
  styleUrls: ['./unsupported-viewport.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: {
        scope: 'unsupportedViewport',
        loader: sharedScopeLoader(['de', 'en'], importer)
      }
    }
  ]
})
export class UnsupportedViewportComponent {}
