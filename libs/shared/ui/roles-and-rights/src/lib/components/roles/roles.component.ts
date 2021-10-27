import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Role } from '../../models';

@Component({
  selector: 'schaeffler-roles',
  templateUrl: './roles.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RolesComponent {
  @Input() public roles?: Role[];
  @Input() public standalone?: boolean;
}
