import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Breadcrumb } from '@schaeffler/breadcrumbs';

@Component({
  selector: 'cdba-page-header',
  templateUrl: './page-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageHeaderComponent {
  @Input() showBackButton = true;
  @Input() title: string;
  @Input() breadcrumbs: Breadcrumb[];
}
