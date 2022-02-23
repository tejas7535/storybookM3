import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';

import { MsalRedirectComponent } from '@azure/msal-angular';
import { HttpCacheInterceptorModule } from '@ngneat/cashew';

import { AppShellModule } from '@schaeffler/app-shell';
import { PERSON_RESPONSIBLE } from '@schaeffler/legal-pages';
import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { FilterSectionModule } from './filter-section/filter-section.module';
import { SharedModule } from './shared/shared.module';
import { UserSettingsModule } from './shared/user-settings/user-settings.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    HttpClientModule,
    HttpCacheInterceptorModule.forRoot(),
    SharedModule,

    AppRoutingModule,
    CoreModule,
    MatTabsModule,
    SharedTranslocoModule,

    LoadingSpinnerModule,
    AppShellModule,
    FilterSectionModule,
    UserSettingsModule,
  ],
  providers: [
    {
      provide: PERSON_RESPONSIBLE,
      useValue: 'Marius Rößner',
    },
  ],
  bootstrap: [AppComponent, MsalRedirectComponent],
})
export class AppModule {}
