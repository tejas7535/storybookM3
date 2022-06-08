import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AdvancedBearingButtonModule } from '@ga/shared/components/advanced-bearing-button';
import { AppLogoModule } from '@ga/shared/components/app-logo';
import { QuickBearingSelectionModule } from '@ga/shared/components/quick-bearing-selection';

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
    AdvancedBearingButtonModule,
    AppLogoModule,
    QuickBearingSelectionModule,
  ],
  bootstrap: [HomeComponent],
})
export class HomeModule {}
