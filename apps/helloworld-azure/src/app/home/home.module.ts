import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar';
import { RouterModule } from '@angular/router';

import { PushPipe } from '@ngrx/component';

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
    PushPipe,
  ],
  exports: [HomeComponent],
})
export class HomeModule {}
