import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { PushPipe } from '@ngrx/component';

import { MaterialEmissionClassificationComponent } from '../../components/material-emission-classification/material-emission-classification.component';
import { EditCellRendererComponent } from '../edit-cell-renderer/edit-cell-renderer.component';

@Component({
  selector: 'mac-green-steel-cell-renderer',
  templateUrl: './green-steel-cell-renderer.component.html',
  standalone: true,
  imports: [
    // default
    CommonModule,
    // msd
    EditCellRendererComponent,
    MaterialEmissionClassificationComponent,
    // angular material
    MatButtonModule,
    MatIconModule,
    // ngrx
    PushPipe,
  ],
})
export class GreenSteelCellRendererComponent extends EditCellRendererComponent {}
