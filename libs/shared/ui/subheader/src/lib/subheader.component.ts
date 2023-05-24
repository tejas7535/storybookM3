import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

import { Breadcrumb } from '@schaeffler/breadcrumbs';

@Component({
  selector: 'schaeffler-subheader',
  templateUrl: './subheader.component.html',
})
export class SubheaderComponent {
  @Input() public showBackButton = true;
  @Input() public subheaderTitle = '';
  @Input() public breadcrumbs: Breadcrumb[] = [];
  @Input() public truncateBreadcrumbsAfter = 0;
  @Input() public hideLine? = false;
  @Input() public breakTitle? = false;
  @Output() public backButtonClicked = new EventEmitter();

  public constructor(private readonly router: Router) {}

  public clickBackButton(): void {
    if (this.breadcrumbs.length > 1) {
      const breadcrumbForNavigation =
        this.breadcrumbs[this.breadcrumbs.length - 2];

      this.router.navigate([breadcrumbForNavigation.url], {
        queryParams: breadcrumbForNavigation.queryParams,
      });
    } else {
      this.backButtonClicked.emit();
    }
  }
}
