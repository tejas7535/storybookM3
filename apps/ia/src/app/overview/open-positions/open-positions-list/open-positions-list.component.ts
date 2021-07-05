import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { OpenApplication } from '../../models/open-application.model';

@Component({
  selector: 'ia-open-positions-list',
  templateUrl: './open-positions-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .mat-badge-medium.mat-badge-above .mat-badge-content {
        top: 5px;
      }
    `,
  ],
})
export class OpenPositionsListComponent {
  @Input() openApplications: OpenApplication[];

  trackByFn(index: number): number {
    return index;
  }
}
