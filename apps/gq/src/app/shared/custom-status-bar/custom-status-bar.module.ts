import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { AddToOfferButtonComponent } from './add-to-offer-button/add-to-offer-button.component';
import { DetailViewButtonComponent } from './detail-view-button/detail-view-button.component';

@NgModule({
  declarations: [DetailViewButtonComponent, AddToOfferButtonComponent],
  imports: [
    CommonModule,
    SharedTranslocoModule,
    MatButtonModule,
    RouterModule,
    MatIconModule,
  ],
  exports: [DetailViewButtonComponent, AddToOfferButtonComponent],
})
export class CustomStatusBarModule {}
