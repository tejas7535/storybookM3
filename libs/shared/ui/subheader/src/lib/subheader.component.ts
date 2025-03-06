import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

import { Breadcrumb } from '@schaeffler/breadcrumbs';

@Component({
  selector: 'schaeffler-subheader',
  templateUrl: './subheader.component.html',
  standalone: false,
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
    const breadcrumbForNavigation = this.breadcrumbs.at(-2);
    if (breadcrumbForNavigation) {
      this.router.navigate([breadcrumbForNavigation.url], {
        queryParams: breadcrumbForNavigation.queryParams,
      });
    } else {
      this.backButtonClicked.emit();
    }
  }
}
