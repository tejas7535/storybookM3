import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Breadcrumb } from '../../breadcrumb.model';

@Component({
  selector: 'schaeffler-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class BreadcrumbsComponent {
  @Input() public breadcrumbs!: Breadcrumb[];
  @Input() public truncateAfter = 0;

  public showTruncation(): boolean {
    return !!this.truncateAfter && this.truncateAfter > 0;
  }

  public showTruncateMenu(): boolean {
    return (
      this.showTruncation() && this.breadcrumbs.length > this.truncateAfter + 1
    );
  }

  public showItemBeforeTruncateMenu(index: number): boolean {
    return (
      !this.showTruncation() ||
      index === 0 ||
      this.breadcrumbs.length <= this.truncateAfter
    );
  }

  public showItemAfterTruncateMenu(index: number): boolean {
    return (
      this.showTruncation() &&
      this.breadcrumbs.length > this.truncateAfter &&
      (index === this.breadcrumbs.length - 1 ||
        index >= this.breadcrumbs.length - this.truncateAfter)
    );
  }
}
