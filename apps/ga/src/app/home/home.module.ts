import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AdvancedBearingButtonModule } from '@ga/shared/components/advanced-bearing-button';
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
    QuickBearingSelectionModule,
  ],
  bootstrap: [HomeComponent],
})
export class HomeModule {}
