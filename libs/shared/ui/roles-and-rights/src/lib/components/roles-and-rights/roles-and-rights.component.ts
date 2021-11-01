import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Role, RolesGroup } from '../../models';

@Component({
  selector: 'schaeffler-roles-and-rights',
  templateUrl: './roles-and-rights.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RolesAndRightsComponent {
  @Input() public headingText?: string;
  @Input() public showHeading?: boolean = true;
  @Input() public rolesGroups?: RolesGroup[];
  @Input() public roles?: Role[];
}
