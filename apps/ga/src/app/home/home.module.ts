import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

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
  ],
  bootstrap: [HomeComponent],
})
export class HomeModule {}
