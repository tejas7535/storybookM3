import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { translate } from '@jsverse/transloco';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';

import { SharedModule } from '../../../../shared/shared.module';
import { AnalysisData } from '../../../models';

@Component({
  selector: 'ia-reason-analysis',
  standalone: true,
  imports: [
    SharedModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    LoadingSpinnerModule,
  ],
  templateUrl: './reason-analysis.component.html',
})
export class ReasonAnalysisComponent {
  readonly PADDING = 24;

  @Input() data: AnalysisData;
  @Input() expanded = false;
  @Output() expand = new EventEmitter<void>();

  createButtonLabel(): string {
    const translationPath =
      'reasonsAndCounterMeasures.reasonsForLeaving.table.analysis.button.';

    return this.expanded
      ? translate(`${translationPath}seeLess`)
      : translate(`${translationPath}seeMore`);
  }

  toggleExpand() {
    this.expand.emit();
  }
}
