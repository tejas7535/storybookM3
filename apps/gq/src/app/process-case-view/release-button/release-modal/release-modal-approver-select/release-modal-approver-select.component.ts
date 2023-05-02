import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Approver } from '../../../../shared/models/quotation/approver.model';

@Component({
  selector: 'gq-release-modal-approver-select',
  templateUrl: './release-modal-approver-select.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReleaseModalApproverSelectComponent {
  @Input()
  approverSelectFormControl: FormControl;

  @Input()
  title: string;

  @Input()
  approvers: Approver[];
}
