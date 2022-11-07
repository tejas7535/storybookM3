import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';

import { LabelValue } from '@schaeffler/label-value';

import { Role } from '../../models';
import { adaptLabelValuesFromRoles } from '../../utils/role-data.utils';

@Component({
  selector: 'schaeffler-roles',
  templateUrl: './roles.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RolesComponent implements OnInit {
  @Input() public roles?: Role[];
  @Input() public standalone?: boolean;
  @Input() public showRights?: boolean = true;

  public labelValues: LabelValue[] | undefined;

  public ngOnInit() {
    this.labelValues = adaptLabelValuesFromRoles(this.roles);
  }
}
