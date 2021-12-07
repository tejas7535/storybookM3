import { Location } from '@angular/common';
import { Directive, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { BreadcrumbsService } from '@cdba/shared/services';

import { Breadcrumb } from '@schaeffler/breadcrumbs';

@Directive({
  selector: '[cdbaBackButton]',
})
export class BackButtonDirective implements OnInit, OnDestroy {
  private breadcrumbs: Breadcrumb[];
  private readonly subscription: Subscription = new Subscription();

  constructor(
    private readonly location: Location,
    private readonly router: Router,
    private readonly breadcrumbsService: BreadcrumbsService
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.breadcrumbsService.breadcrumbs$.subscribe(
        (breadcrumbs) => (this.breadcrumbs = breadcrumbs)
      )
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  @HostListener('click')
  navigateBack(): void {
    if (this.breadcrumbs?.length > 1) {
      const breadcrumbForNavigation =
        this.breadcrumbs[this.breadcrumbs.length - 2];

      this.router.navigate([breadcrumbForNavigation.url], {
        queryParams: breadcrumbForNavigation.queryParams,
      });
    } else {
      this.location.back();
    }
  }
}
