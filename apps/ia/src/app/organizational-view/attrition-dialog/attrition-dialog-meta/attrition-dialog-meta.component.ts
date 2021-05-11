import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { EmployeeAttritionMeta } from '../../../shared/models';

@Component({
  selector: 'ia-attrition-dialog-meta',
  templateUrl: './attrition-dialog-meta.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttritionDialogMetaComponent {
  @Input() meta: EmployeeAttritionMeta;
}
