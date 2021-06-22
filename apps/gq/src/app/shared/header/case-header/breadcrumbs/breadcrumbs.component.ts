import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Breadcrumb } from './breadcrumb.model';

@Component({
  selector: 'gq-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbsComponent {
  @Input() breadcrumbs: Breadcrumb[];

  public trackByFn(index: number): number {
    return index;
  }
}
