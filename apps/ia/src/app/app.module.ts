import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';

import { Observable } from 'rxjs';

import { MsalRedirectComponent } from '@azure/msal-angular';
import { HttpCacheInterceptorModule } from '@ngneat/cashew';
import { TranslocoService } from '@ngneat/transloco';

import { AppShellModule } from '@schaeffler/app-shell';
import { PERSON_RESPONSIBLE, PURPOSE } from '@schaeffler/legal-pages';
import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { FilterSectionModule } from './filter-section/filter-section.module';
import { SharedModule } from './shared/shared.module';
import { UserSettingsModule } from './user-settings/user-settings.module';

function DynamicPurpose(
  translocoService: TranslocoService
): Observable<string> {
  return translocoService.selectTranslate('legal.purpose');
}
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
    UserSettingsModule,
    FilterSectionModule,
  ],
  providers: [
    {
      provide: PERSON_RESPONSIBLE,
      useValue: 'Marius Rößner',
    },
    {
      provide: PURPOSE,
      useFactory: DynamicPurpose,
      deps: [TranslocoService],
    },
  ],
  bootstrap: [AppComponent, MsalRedirectComponent],
})
export class AppModule {}
