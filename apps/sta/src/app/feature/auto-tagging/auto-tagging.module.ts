import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { AutoTaggingRoutingModule } from './auto-tagging-routing.module';

import { AutoTaggingComponent } from './auto-tagging.component';

@NgModule({
  declarations: [AutoTaggingComponent],
  imports: [
    AutoTaggingRoutingModule,
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  exports: [AutoTaggingComponent]
})
export class AutoTaggingModule {}
