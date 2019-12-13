import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { TranslateModule } from '@ngx-translate/core';
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
    TranslateModule,
    FlexLayoutModule,
    PredictionModule
  ]
})
export class HomeModule {}
