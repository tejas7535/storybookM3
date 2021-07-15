import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { OpenApplication } from '../models/open-application.model';

@Component({
  selector: 'ia-open-positions',
  templateUrl: './open-positions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpenPositionsComponent {
  @Input() loading: boolean; // not used at the moment
  @Input() openApplications: OpenApplication[];

  countOpenPositions() {
    return (
      this.openApplications
        ?.map((openApplication) => openApplication.count)
        // eslint-disable-next-line unicorn/no-array-reduce
        .reduce((valuePrev, valueCurrent) => valuePrev + valueCurrent, 0)
    );
  }

  trackByFn(index: number): number {
    return index;
  }
}
