import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { RolesGroup } from '../../models';

@Component({
  selector: 'schaeffler-roles-groups',
  templateUrl: './roles-groups.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RolesGroupsComponent {
  @Input() public rolesGroups?: RolesGroup[];
}
