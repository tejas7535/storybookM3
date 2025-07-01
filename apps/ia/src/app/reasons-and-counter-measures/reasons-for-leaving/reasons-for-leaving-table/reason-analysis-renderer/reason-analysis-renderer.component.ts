import { Component, ElementRef } from '@angular/core';

import { SharedModule } from '../../../../shared/shared.module';
import { AnalysisData } from '../../../models';
import { AbstractReasonAnalysisRendererComponent } from '../../shared/reason-analysis/abstract-reason-analysis-renderer.component';
import { ReasonAnalysisComponent } from '../../shared/reason-analysis/reason-analysis.component';

@Component({
  selector: 'ia-reason-analysis-renderer',
  standalone: true,
  imports: [SharedModule, ReasonAnalysisComponent],
  templateUrl: './reason-analysis-renderer.component.html',
  host: {
    class: 'block my-1 ml-1 mr-4',
  },
})
export class ReasonAnalysisRendererComponent extends AbstractReasonAnalysisRendererComponent<AnalysisData> {
  constructor(public elRef: ElementRef) {
    super(elRef);
  }
}
