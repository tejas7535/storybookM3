import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';

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
