import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatTooltipModule } from '@angular/material/tooltip';

import { PushPipe } from '@ngrx/component';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { DialogHeaderModule } from '../../header/dialog-header/dialog-header.module';
import { InfoBannerComponent } from '../../info-banner/info-banner.component';
import { KpiListComponent } from './kpi-list/kpi-list.component';
import { DiscountEditingModalComponent } from './modals/discount-editing-modal.component';
import { GpiEditingModalComponent } from './modals/gpi-editing-modal.component';
import { GpmEditingModalComponent } from './modals/gpm-editing-modal.component';
import { PriceEditingModalComponent } from './modals/price-editing-modal.component';
import { QuantityEditingModalComponent } from './modals/quantity-editing-modal.component';
import { TargetPriceEditingModalComponent } from './modals/target-price-editing-modal.component';

@NgModule({
  declarations: [
    KpiListComponent,
    QuantityEditingModalComponent,
    DiscountEditingModalComponent,
    PriceEditingModalComponent,
    GpmEditingModalComponent,
    GpiEditingModalComponent,
    TargetPriceEditingModalComponent,
  ],
  imports: [
    CommonModule,
    InfoBannerComponent,
    PushPipe,
    SharedTranslocoModule,
    DialogHeaderModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    TextFieldModule,
    LoadingSpinnerModule,
    MatIconModule,
    MatRadioModule,
    FormsModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
  ],
})
export class EditingModalModule {}
