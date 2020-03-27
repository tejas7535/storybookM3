import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PageNotFoundModule } from '@schaeffler/shared/empty-states';
import { IconsModule } from '@schaeffler/shared/icons';
import { SharedTranslocoModule } from '@schaeffler/shared/transloco';
import { SnackBarModule } from '@schaeffler/shared/ui-components';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    HttpClientModule,
    AppRoutingModule,
    PageNotFoundModule,
    BrowserAnimationsModule,
    SnackBarModule,
    SharedTranslocoModule.forRoot(environment.production, ['en'], 'en', 'en'),
    IconsModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
