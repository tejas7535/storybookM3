import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';

import { MsalRedirectComponent } from '@azure/msal-angular';
import { HttpCacheInterceptorModule } from '@ngneat/cashew';

import { CoreModule } from '@cdba/core';
import { SharedModule } from '@cdba/shared';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    AppRoutingModule,
    HttpClientModule,
    HttpCacheInterceptorModule.forRoot(),
    CoreModule,
    SharedModule,
    MatDialogModule,
  ],
  bootstrap: [AppComponent, MsalRedirectComponent],
})
export class AppModule {}
