import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Breadcrumb } from '../../breadcrumb.model';

@Component({
  selector: 'schaeffler-breadcrumbs-item',
  templateUrl: './breadcrumbs-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbsItemComponent {
  @Input() public breadcrumb!: Breadcrumb;
  @Input() public hasFollowerBreadcrumb = false;
}
