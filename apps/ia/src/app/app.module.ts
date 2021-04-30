import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { MsalRedirectComponent } from '@azure/msal-angular';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { FilterSectionModule } from './filter-section/filter-section.module';
import { SharedModule } from './shared/shared.module';

@NgModule({
  imports: [
    AppRoutingModule,
    HttpClientModule,
    CoreModule,
    SharedModule,
    FilterSectionModule,
    LoadingSpinnerModule,
  ],
  bootstrap: [AppComponent, MsalRedirectComponent],
})
export class AppModule {}
