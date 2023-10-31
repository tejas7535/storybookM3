import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { SharedDirectivesModule } from '@gq/shared/directives/shared-directives.module';
import { PushPipe } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { AutocompleteInputModule } from '../../autocomplete-input/autocomplete-input.module';
import { InfoIconModule } from '../../info-icon/info-icon.module';
import { AddEntryComponent } from './add-entry.component';
@NgModule({
  declarations: [AddEntryComponent],
  imports: [
    AutocompleteInputModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    SharedTranslocoModule,
    SharedDirectivesModule,
    ReactiveFormsModule,
    PushPipe,
    InfoIconModule,
    CommonModule,
  ],
  exports: [AddEntryComponent],
})
export class AddEntryModule {}
