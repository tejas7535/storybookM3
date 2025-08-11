import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogModule,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatRadioButton } from '@angular/material/radio';

import { PushPipe } from '@ngrx/component';

import { ApplicationInsightsModule } from '@schaeffler/application-insights';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { ENV, getEnv } from '@ga/environments/environments.provider';
import { AppLogoComponent } from '@ga/shared/components/app-logo/app-logo.component';
import { AppStoreButtonsComponent } from '@ga/shared/components/app-store-buttons/app-store-buttons.component';
import { QualtricsInfoBannerComponent } from '@ga/shared/components/qualtrics-info-banner/qualtrics-info-banner.component';
import { QuickBearingSelectionComponent } from '@ga/shared/components/quick-bearing-selection';

import { HomepageCardComponent } from './components';
import { AppAdCardComponent } from './components/app-ad-card/app-ad-card.component';
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
    AppLogoComponent,
    QuickBearingSelectionComponent,
    ApplicationInsightsModule,
    PushPipe,
    QualtricsInfoBannerComponent,
    AppAdCardComponent,
    AppStoreButtonsComponent,
    MatButtonModule,

    // Translation
    SharedTranslocoModule,
    MatRadioButton,

    // MAT-Dialog
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatDialogModule,
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
