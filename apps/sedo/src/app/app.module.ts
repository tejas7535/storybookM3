import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { MsalRedirectComponent } from '@azure/msal-angular';
import { ReactiveComponentModule } from '@ngrx/component';

import { AppShellModule } from '@schaeffler/app-shell';
import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';

@NgModule({
  imports: [
    AppRoutingModule,
    AppShellModule,
    CoreModule,
    HttpClientModule,
    LoadingSpinnerModule,
    ReactiveComponentModule,
    SharedModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent, MsalRedirectComponent],
})
export class AppModule {}
