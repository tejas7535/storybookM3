import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Color } from '../../../shared/models/color.enum';
import { OpenApplication } from '../../models/open-application.model';

@Component({
  selector: 'ia-open-positions-list',
  templateUrl: './open-positions-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .mat-badge-medium.mat-badge-above .mat-badge-content {
        top: 12px;
      }
    `,
  ],
})
export class OpenPositionsListComponent {
  @Input() openApplications: OpenApplication[];
  @Input() isLoadingOpenApplications: boolean;

  colors = Color;

  trackByFn(index: number): number {
    return index;
  }
}
