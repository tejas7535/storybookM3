import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { ResetFilterRoutingModule } from './reset-filter-routing.module';

import { ResetFilterComponent } from './reset-filter.component';

@NgModule({
  declarations: [ResetFilterComponent],
  imports: [CommonModule, ResetFilterRoutingModule, MatButtonModule]
})
export class ResetFilterModule {}
