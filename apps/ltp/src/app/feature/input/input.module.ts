import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';

import { TranslateModule } from '@ngx-translate/core';

import { TooltipModule } from '../../shared/components/tooltip/tooltip.module';

import { InputComponent } from './input.component';
import { LimitsComponent } from './limits/limits.component';
import { MaterialComponent } from './material/material.component';
import { SelectComponent } from './select/select.component';
import { SliderComponent } from './slider/slider.component';
import { ToggleComponent } from './toggle/toggle.component';

@NgModule({
  declarations: [
    InputComponent,
    SliderComponent,
    SelectComponent,
    MaterialComponent,
    ToggleComponent,
    LimitsComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatFormFieldModule,
    MatSliderModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatExpansionModule,
    MatDividerModule,
    MatSlideToggleModule,
    TooltipModule
  ],
  exports: [InputComponent]
})
export class InputModule {}
