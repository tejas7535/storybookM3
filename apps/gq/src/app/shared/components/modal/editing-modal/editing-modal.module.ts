import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';
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
