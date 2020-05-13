import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { IconsModule } from '@schaeffler/icons';
import { SnackBarModule } from '@schaeffler/snackbar';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SnackBarModule,
    SharedTranslocoModule.forRoot(environment.production, ['en'], 'en', 'en'),
    IconsModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
