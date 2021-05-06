import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { EmployeeAttritionMeta } from '../../shared/models';

@Component({
  selector: 'ia-attrition-dialog',
  templateUrl: './attrition-dialog.component.html',
})
export class AttritionDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: EmployeeAttritionMeta) {}
}
