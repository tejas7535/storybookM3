import { NgModule } from '@angular/core';

import {
  TRANSLOCO_CONFIG,
  translocoConfig,
  TranslocoModule,
} from '@ngneat/transloco';

@NgModule({
  imports: [TranslocoModule],
  providers: [
    {
      provide: TRANSLOCO_CONFIG,
      useValue: translocoConfig({
        reRenderOnLangChange: true,
        availableLangs: ['en', 'de'],
        defaultLang: 'en',
        prodMode: false,
      }),
    },
  ],
  exports: [TranslocoModule],
})
export class StorybookTranslocoModule {}
