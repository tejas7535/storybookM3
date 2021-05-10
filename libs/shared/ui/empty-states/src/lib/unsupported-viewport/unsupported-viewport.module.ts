/* eslint-disable */
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import deJson from './i18n/de.json';
import enJson from './i18n/en.json';
import { UnsupportedViewportComponent } from './unsupported-viewport.component';

@NgModule({
  imports: [SharedTranslocoModule, FlexLayoutModule, TranslocoModule],
  declarations: [UnsupportedViewportComponent],
  exports: [UnsupportedViewportComponent],
})
export class UnsupportedViewportModule {
  constructor(private readonly translocoService: TranslocoService) {
    this.translocoService.setTranslation(enJson, 'en');
    this.translocoService.setTranslation(deJson, 'de');
  }
}
