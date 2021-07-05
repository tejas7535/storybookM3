import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { OpenApplication } from '../models/open-application.model';

@Component({
  selector: 'ia-open-positions',
  templateUrl: './open-positions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpenPositionsComponent {
  @Input() openApplications: OpenApplication[];

  trackByFn(index: number): number {
    return index;
  }
}
