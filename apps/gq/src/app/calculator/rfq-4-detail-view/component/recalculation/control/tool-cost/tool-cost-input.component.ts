import { CommonModule } from '@angular/common';
import { Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { ShowErrorComponent } from '@gq/calculator/rfq-4-detail-view/component/recalculation/control/show-error/show-error.component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { BaseInputComponent } from '../base-input.component';

@Component({
  selector: 'gq-tool-cost-input',
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    SharedTranslocoModule,
    ShowErrorComponent,
  ],
  templateUrl: './tool-cost-input.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ToolCostInputComponent),
      multi: true,
    },
  ],
})
export class ToolCostInputComponent extends BaseInputComponent {}
