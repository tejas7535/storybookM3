import { Component } from '@angular/core';

import { TRANSLOCO_SCOPE } from '@ngneat/transloco';

// tslint:disable: only-arrow-functions
export function de(): any {
  return import('./i18n/de.json');
}

export function en(): any {
  return import('./i18n/en.json');
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
        loader: { de, en }
      }
    }
  ]
})
export class UnsupportedViewportComponent {}
