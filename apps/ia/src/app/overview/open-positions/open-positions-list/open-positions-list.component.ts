import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Color } from '../../../shared/models/color';
import { OpenApplication } from '../../models/open-application.model';

@Component({
  selector: 'ia-open-positions-list',
  templateUrl: './open-positions-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      ::ng-deep {
        .mat-badge-content {
          top: unset !important;
          bottom: unset !important;
          left: 0 !important;
        }
      }
    `,
  ],
  standalone: false,
})
export class OpenPositionsListComponent {
  @Input() openApplications: OpenApplication[];
  @Input() isLoadingOpenApplications: boolean;

  colors = Color;
}
