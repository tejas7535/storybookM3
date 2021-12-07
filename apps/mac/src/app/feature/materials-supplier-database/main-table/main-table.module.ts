import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';

import { AgGridModule } from '@ag-grid-community/angular';
import { ReactiveComponentModule } from '@ngrx/component';

import { MainTableComponent } from './main-table.component';
import { MainTableRoutingModule } from './main-table-routing.module';

@NgModule({
  declarations: [MainTableComponent],
  imports: [
    CommonModule,
    MainTableRoutingModule,
    AgGridModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveComponentModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatMenuModule,
    MatIconModule,
    MatCheckboxModule,
  ],
})
export class MainTableModule {}
