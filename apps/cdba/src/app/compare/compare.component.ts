import { Component, OnDestroy, OnInit } from '@angular/core';

import { Observable, Subscription } from 'rxjs';

import { Store } from '@ngrx/store';

import { Breadcrumb } from '@schaeffler/breadcrumbs';

import { Tab } from '@cdba/shared/components';
import { BreadcrumbsService } from '@cdba/shared/services';

import { CompareRoutePath } from './compare-route-path.enum';
import { getObjectsAreEqual } from './store';

@Component({
  selector: 'cdba-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.scss'],
})
export class CompareComponent implements OnInit, OnDestroy {
  public breadcrumbs$: Observable<Breadcrumb[]>;
  public tabs: Tab[];
  objectsAreEqual: boolean;
  objectsAreEqualSubscription: Subscription;

  constructor(
    private readonly store: Store,
    private readonly breadcrumbService: BreadcrumbsService
  ) {}

  ngOnInit(): void {
    this.breadcrumbs$ = this.breadcrumbService.breadcrumbs$;

    this.objectsAreEqualSubscription = this.store
      .select(getObjectsAreEqual)
      .subscribe((objectsAreEqual) => {
        this.objectsAreEqual = objectsAreEqual;
      });

    this.tabs = [
      {
        label: 'compare.tabs.details',
        link: CompareRoutePath.DetailsPath,
        disabled: this.objectsAreEqual,
      },
      {
        label: 'compare.tabs.billOfMaterial',
        link: CompareRoutePath.BomPath,
      },
    ];
  }

  ngOnDestroy(): void {
    if (this.objectsAreEqualSubscription) {
      this.objectsAreEqualSubscription.unsubscribe();
    }
  }

  /**
   * Improves performance of ngFor.
   */
  public trackByFn(index: number): number {
    return index;
  }
}
