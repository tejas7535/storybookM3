import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { Color } from '../../../shared/models';
import { SharedModule } from '../../../shared/shared.module';
import { PmgmAssessment } from '../../models';

@Component({
  selector: 'ia-pmgm-assessment',
  standalone: true,
  imports: [
    SharedModule,
    MatIconModule,
    MatTooltipModule,
    SharedTranslocoModule,
  ],
  templateUrl: './pmgm-assessment.component.html',
})
export class PmgmAssessmentComponent implements ICellRendererAngularComp {
  assessment: PmgmAssessment;
  color: { color: string };
  tooltipPath: string;
  showTooltip = false;

  agInit(params: ICellRendererParams): void {
    this.assessment = params.value;
    this.defineColor(this.assessment);
  }

  refresh(): boolean {
    return false;
  }

  defineColor(assessment: PmgmAssessment): void {
    switch (assessment) {
      case PmgmAssessment.RED: {
        this.color = { color: Color.RED };
        this.tooltipPath = 'red';
        this.showTooltip = true;
        break;
      }
      case PmgmAssessment.YELLOW: {
        this.color = { color: Color.YELLOW };
        this.tooltipPath = 'yellow';
        this.showTooltip = true;
        break;
      }
      case PmgmAssessment.GREEN: {
        this.color = { color: Color.GREEN };
        break;
      }
      case PmgmAssessment.GREY: {
        this.color = { color: Color.SHADOW_GREY };
        break;
      }
      default: {
        throw new Error('Invalid assessment value');
      }
    }
  }
}
