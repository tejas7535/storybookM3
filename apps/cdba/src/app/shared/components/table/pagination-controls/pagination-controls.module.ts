import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { PushPipe } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { PaginationControlsComponent } from './pagination-controls.component';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    PushPipe,
    SharedTranslocoModule,
  ],
  declarations: [PaginationControlsComponent],
  exports: [PaginationControlsComponent],
})
export class PaginationControlsModule {}
