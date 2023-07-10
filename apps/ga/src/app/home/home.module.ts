import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PushPipe } from '@ngrx/component';

import { ApplicationInsightsModule } from '@schaeffler/application-insights';

import { AppLogoModule } from '@ga/shared/components/app-logo';
import { QuickBearingSelectionComponent } from '@ga/shared/components/quick-bearing-selection';

import { HomepageCardModule } from './components';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,

    // Components
    HomepageCardModule,
    AppLogoModule,
    QuickBearingSelectionComponent,
    ApplicationInsightsModule,

    PushPipe,
  ],
  bootstrap: [HomeComponent],
})
export class HomeModule {}
