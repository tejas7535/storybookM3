import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

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
  ],
  bootstrap: [HomeComponent],
})
export class HomeModule {}
