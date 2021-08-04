import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { FooterTailwindModule } from '@schaeffler/footer-tailwind';
import { IconsModule } from '@schaeffler/icons';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { environment } from '../../environments/environment';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,

    // UI Modules
    FooterTailwindModule,
    IconsModule,

    // Translation
    SharedTranslocoModule.forRoot(
      environment.production,
      [
        { id: 'de', label: 'Deutsch' },
        { id: 'en', label: 'English' },
        { id: 'es', label: 'Español' },
        { id: 'fr', label: 'Français' },
        { id: 'ru', label: 'русский' },
        { id: 'zh', label: '中国' },
      ],
      'en', // default -> undefined would lead to browser detection
      'en',
      true
    ),

    // HTTP
    HttpClientModule,
  ],
  exports: [FooterTailwindModule],
})
export class CoreModule {}
