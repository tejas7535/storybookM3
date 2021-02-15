import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../../../shared';
import { ManualPriceComponent } from './manual-price.component';

@NgModule({
  declarations: [ManualPriceComponent],
  imports: [
    SharedModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    SharedTranslocoModule,
    ReactiveFormsModule,
  ],
  exports: [ManualPriceComponent],
})
export class ManualPriceModule {}
