import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { ReactiveComponentModule } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../../../shared';
import { GqPriceComponent } from './gq-price.component';

@NgModule({
  declarations: [GqPriceComponent],
  imports: [
    SharedModule,
    MatButtonModule,
    MatIconModule,
    SharedTranslocoModule,
    ReactiveFormsModule,
    ReactiveComponentModule,
  ],
  exports: [GqPriceComponent],
})
export class GqPriceModule {}
