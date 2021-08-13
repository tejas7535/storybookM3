import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PERSON_RESPONSIBLE } from '@schaeffler/legal-pages';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { StoreModule } from './core/store/store.module';
import { responsiblePerson } from './shared/constants/legal-constants';

@NgModule({
  imports: [BrowserAnimationsModule, AppRoutingModule, CoreModule, StoreModule],
  providers: [
    {
      provide: PERSON_RESPONSIBLE,
      useValue: responsiblePerson,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
