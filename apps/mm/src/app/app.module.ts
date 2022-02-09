import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { of } from 'rxjs';

import { ReactiveComponentModule } from '@ngrx/component';

import { AppShellModule } from '@schaeffler/app-shell';
import { PERSON_RESPONSIBLE, TERMS_OF_USE } from '@schaeffler/legal-pages';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { StoreModule } from './core/store/store.module';
import { responsiblePerson } from './shared/constants/legal-constants';
import { MaterialModule } from './shared/material.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserAnimationsModule,
    AppRoutingModule,
    CoreModule,
    StoreModule,
    AppShellModule,
    MaterialModule,
    ReactiveComponentModule,
  ],
  providers: [
    {
      provide: PERSON_RESPONSIBLE,
      useValue: responsiblePerson,
    },
    {
      provide: TERMS_OF_USE,
      useValue: of(false),
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
