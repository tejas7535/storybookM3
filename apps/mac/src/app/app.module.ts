import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { MsalRedirectComponent } from '@azure/msal-angular';
import { TranslocoService } from '@ngneat/transloco';

import {
  DATA_SOURCE,
  PERSON_RESPONSIBLE,
  PURPOSE,
} from '@schaeffler/legal-pages';

import { AppComponent } from '@mac/app.component';
import { AppRoutingModule } from '@mac/app-routing.module';
import { CoreModule } from '@mac/core/core.module';
import { SharedModule } from '@mac/shared/shared.module';

export function DynamicPurpose(translocoService: TranslocoService) {
  return translocoService.selectTranslateObject('legal.purpose');
}

export function DynamicDataSource(translocoService: TranslocoService) {
  return translocoService.selectTranslateObject('legal.dataSource');
}

@NgModule({
  imports: [AppRoutingModule, HttpClientModule, CoreModule, SharedModule],
  providers: [
    {
      provide: PERSON_RESPONSIBLE,
      useValue: 'Dr. Johannes Möller',
    },
    {
      provide: PURPOSE,
      useFactory: DynamicPurpose,
      deps: [TranslocoService],
    },
    {
      provide: DATA_SOURCE,
      useFactory: DynamicDataSource,
      deps: [TranslocoService],
    },
  ],
  bootstrap: [AppComponent, MsalRedirectComponent],
})
export class AppModule {}
