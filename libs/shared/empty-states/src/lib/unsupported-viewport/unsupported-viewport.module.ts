import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { UnsupportedViewportComponent } from './unsupported-viewport.component';

export const unsupportedViewportLoader = ['en', 'de'].reduce(
  (acc: any, lang: string) => {
    acc[lang] = () => import(`./i18n/${lang}.json`);

    return acc;
  },
  {}
);

@NgModule({
  imports: [
    SharedTranslocoModule,
    FlexLayoutModule,
    SharedTranslocoModule.forChild(
      'unsupportedViewport',
      unsupportedViewportLoader
    ),
  ],
  declarations: [UnsupportedViewportComponent],
  exports: [UnsupportedViewportComponent],
})
export class UnsupportedViewportModule {}
