import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { SharedTranslocoModule } from '@schaeffler/shared/transloco';
import { BannerModule } from '@schaeffler/shared/ui-components';

import { PredictionModule } from '../prediction/prediction.module';
import { HomeRoutingModule } from './home-routing.module';

import { HomeComponent } from './home.component';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    BannerModule,
    CommonModule,
    HomeRoutingModule,
    SharedTranslocoModule,
    FlexLayoutModule,
    PredictionModule
  ]
})
export class HomeModule {}
