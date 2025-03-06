import { Component, OnDestroy, OnInit } from '@angular/core';

import { Observable, Subscription } from 'rxjs';

import { Store } from '@ngrx/store';

import { Breadcrumb } from '@schaeffler/breadcrumbs';

import { RoleFacade } from '@cdba/core/auth/role.facade';
import { getReferenceType } from '@cdba/core/store';
import { Tab } from '@cdba/shared/components';
import { ReferenceType } from '@cdba/shared/models';
import { BreadcrumbsService } from '@cdba/shared/services';

import { DetailRoutePath } from './detail-route-path.enum';

@Component({
  selector: 'cdba-detail',
  templateUrl: './detail.component.html',
  standalone: false,
})
export class DetailComponent implements OnInit, OnDestroy {
  public breadcrumbs$: Observable<Breadcrumb[]>;
  public referenceType$: Observable<ReferenceType>;
  public tabs: Tab[];
  public userHasPricingRole: boolean;
  private userHasPricingRoleSubscription: Subscription;

  public constructor(
    private readonly store: Store,
    private readonly breadcrumbsService: BreadcrumbsService,
    private readonly roleFacade: RoleFacade
  ) {}

  public ngOnInit(): void {
    this.referenceType$ = this.store.select(getReferenceType);

    this.breadcrumbs$ = this.breadcrumbsService.breadcrumbs$;

    this.userHasPricingRoleSubscription =
      this.roleFacade.hasAnyPricingRole$.subscribe((hasPricingRole) => {
        this.userHasPricingRole = hasPricingRole;
      });

    this.tabs = [
      {
        label: 'detail.tabs.detail',
        link: DetailRoutePath.DetailsPath,
      },
      {
        label: 'detail.tabs.billOfMaterial',
        link: DetailRoutePath.BomPath,
        disabled: !this.userHasPricingRole,
      },
      {
        label: 'detail.tabs.calculations',
        link: DetailRoutePath.CalculationsPath,
        disabled: !this.userHasPricingRole,
      },
    ];
  }

  ngOnDestroy(): void {
    if (this.userHasPricingRoleSubscription) {
      this.userHasPricingRoleSubscription.unsubscribe();
    }
  }

  /**
   * Improves performance of ngFor.
   */
  public trackByFn(index: number): number {
    return index;
  }
}
