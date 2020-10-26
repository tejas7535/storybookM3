import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

import { ReactiveComponentModule } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { AddToOfferButtonComponent } from './add-to-offer-button/add-to-offer-button.component';
import { CreateCaseButtonComponent } from './create-case-button/create-case-button.component';
import { DetailViewButtonComponent } from './detail-view-button/detail-view-button.component';
import { ResetAllButtonComponent } from './reset-all-button/reset-all-button.component';

@NgModule({
  declarations: [
    DetailViewButtonComponent,
    AddToOfferButtonComponent,
    ResetAllButtonComponent,
    CreateCaseButtonComponent,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    SharedTranslocoModule,
    ReactiveComponentModule,
  ],
  exports: [
    DetailViewButtonComponent,
    AddToOfferButtonComponent,
    ResetAllButtonComponent,
    CreateCaseButtonComponent,
  ],
})
export class CustomStatusBarModule {}
