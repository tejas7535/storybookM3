import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../../../shared/shared.module';
import { PerformanceRating } from '../../models';

@Component({
  selector: 'ia-pmgm-performance-rating',
  standalone: true,
  imports: [
    SharedModule,
    MatIconModule,
    MatTooltipModule,
    SharedTranslocoModule,
  ],
  templateUrl: './pmgm-performance-rating.component.html',
})
export class PmgmPerformanceRatingComponent
  implements ICellRendererAngularComp
{
  readonly PERFORMANCE_RATING = PerformanceRating;
  rating: PerformanceRating;

  agInit(params: ICellRendererParams): void {
    this.rating = params.value;
  }

  refresh(): boolean {
    return false;
  }
}
