import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { ShareButtonComponent } from './share-button.component';

@NgModule({
  declarations: [ShareButtonComponent],
  imports: [
    CommonModule,
    SharedTranslocoModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
  ],
  exports: [ShareButtonComponent],
})
export class ShareButtonModule {}
