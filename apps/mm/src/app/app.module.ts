import { NgModule } from '@angular/core';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';

@NgModule({
  imports: [
    AppRoutingModule,
    CoreModule,

    // Schaeffler Libs
    SharedTranslocoModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
