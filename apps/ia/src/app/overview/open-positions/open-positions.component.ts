import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { OpenApplication } from '../models/open-application.model';

@Component({
  selector: 'ia-open-positions',
  templateUrl: './open-positions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpenPositionsComponent {
  @Input() openApplications: OpenApplication[];
  @Input() openApplicationsLoading: boolean;
  @Input() openApplicationsCount: number;
  @Input() openApplicationsCountLoading: boolean;
  @Input() available: boolean;

  @Output() openApplicationsRequested = new EventEmitter<void>();

  countOpenPositions() {
    return (
      this.openApplications
        ?.map((openApplication) => openApplication.count)
        // eslint-disable-next-line unicorn/no-array-reduce
        .reduce((valuePrev, valueCurrent) => valuePrev + valueCurrent, 0)
    );
  }

  onButtonClick(): void {
    this.openApplicationsRequested.emit();
  }

  trackByFn(index: number): number {
    return index;
  }
}
