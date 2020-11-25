import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { TRANSLOCO_SCOPE } from '@ngneat/transloco';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { CompareRoutingModule } from './compare-routing.module';
import { CompareComponent } from './compare.component';

@NgModule({
  declarations: [CompareComponent],
  imports: [
    CommonModule,
    CompareRoutingModule,
    MatCardModule,
    SharedTranslocoModule,
  ],
  providers: [{ provide: TRANSLOCO_SCOPE, useValue: 'compare' }],
})
export class CompareModule {}
