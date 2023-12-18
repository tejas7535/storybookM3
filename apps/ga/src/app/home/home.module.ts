import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PushPipe } from '@ngrx/component';

import { ApplicationInsightsModule } from '@schaeffler/application-insights';

import { ENV, getEnv } from '@ga/environments/environments.provider';
import { AppLogoModule } from '@ga/shared/components/app-logo';
import { QualtricsInfoBannerComponent } from '@ga/shared/components/qualtrics-info-banner/qualtrics-info-banner.component';
import { QuickBearingSelectionComponent } from '@ga/shared/components/quick-bearing-selection';

import { HomepageCardComponent } from './components';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { HomeCardsService } from './services/home-cards.service';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    // Components
    HomepageCardComponent,
    AppLogoModule,
    QuickBearingSelectionComponent,
    ApplicationInsightsModule,
    PushPipe,
    QualtricsInfoBannerComponent,
  ],
  providers: [
    HomeCardsService,
    {
      provide: ENV,
      useFactory: getEnv,
    },
  ],
  bootstrap: [HomeComponent],
})
export class HomeModule {}
