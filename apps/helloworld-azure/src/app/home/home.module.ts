import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterModule } from '@angular/router';

import { PushModule } from '@ngrx/component';

import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    MatProgressBarModule,
    HomeRoutingModule,
    RouterModule,
    MatProgressBarModule,
    PushModule,
  ],
  exports: [HomeComponent],
})
export class HomeModule {}
