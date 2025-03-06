import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Breadcrumb } from '../../breadcrumb.model';

@Component({
  selector: 'schaeffler-breadcrumbs-menu-item',
  templateUrl: './breadcrumbs-menu-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class BreadcrumbsMenuItemComponent {
  @Input() public breadcrumb!: Breadcrumb;
}
