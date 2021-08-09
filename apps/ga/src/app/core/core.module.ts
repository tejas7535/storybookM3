import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';

import { FooterModule } from '@schaeffler/footer';
import { HeaderModule } from '@schaeffler/header';
import { IconsModule } from '@schaeffler/icons';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { environment } from '../../environments/environment';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { StoreModule } from './store/store.module';

@NgModule({
  declarations: [SidebarComponent],
  imports: [
    CommonModule,
    StoreModule,

    // UI Modules
    HeaderModule,
    FooterModule,
    IconsModule,

    // Material Modules
    MatSidenavModule,

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
  exports: [FooterModule, HeaderModule, SidebarComponent, StoreModule],
})
export class CoreModule {}
