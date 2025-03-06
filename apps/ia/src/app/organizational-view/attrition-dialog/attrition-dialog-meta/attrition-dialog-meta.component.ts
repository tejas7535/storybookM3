import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { AttritionDialogMeta } from '../models/attrition-dialog-meta.model';

@Component({
  selector: 'ia-attrition-dialog-meta',
  templateUrl: './attrition-dialog-meta.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class AttritionDialogMetaComponent {
  @Input() meta: AttritionDialogMeta;
  @Input() fluctuationLoading: boolean;
}
