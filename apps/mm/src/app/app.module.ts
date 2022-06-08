import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TranslocoService } from '@ngneat/transloco';
import { PushModule } from '@ngrx/component';

import { AppShellModule } from '@schaeffler/app-shell';
import { PERSON_RESPONSIBLE, PURPOSE } from '@schaeffler/legal-pages';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { StoreModule } from './core/store/store.module';
import { responsiblePerson } from './shared/constants/legal-constants';
import { MaterialModule } from './shared/material.module';

export function DynamicPurpose(translocoService: TranslocoService) {
  return translocoService.selectTranslateObject('legal.purpose');
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserAnimationsModule,
    AppRoutingModule,
    CoreModule,
    StoreModule,
    AppShellModule,
    MaterialModule,
    PushModule,
  ],
  providers: [
    {
      provide: PERSON_RESPONSIBLE,
      useValue: responsiblePerson,
    },
    {
      provide: PURPOSE,
      useFactory: DynamicPurpose,
      deps: [TranslocoService],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
