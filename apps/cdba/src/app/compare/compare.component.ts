import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { Breadcrumb } from '@schaeffler/breadcrumbs';

import { Tab } from '@cdba/shared/components';
import { BreadcrumbsService } from '@cdba/shared/services';

import { CompareRoutePath } from './compare-route-path.enum';
import { getIsCompareDetailsDisabled } from './store';

@Component({
  selector: 'cdba-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.scss'],
})
export class CompareComponent implements OnInit {
  public breadcrumbs$: Observable<Breadcrumb[]>;
  public tabs: Tab[] = [
    {
      label$: 'compare.tabs.details',
      link: CompareRoutePath.DetailsPath,
    },
    {
      label$: 'compare.tabs.billOfMaterial',
      link: CompareRoutePath.BomPath,
    },
  ];

  constructor(
    private readonly store: Store,
    private readonly breadcrumbService: BreadcrumbsService
  ) {}

  ngOnInit(): void {
    this.tabs[0].disabled$ = this.store.select(getIsCompareDetailsDisabled);

    this.breadcrumbs$ = this.breadcrumbService.breadcrumbs$;
  }
  /**
   * Improves performance of ngFor.
   */
  public trackByFn(index: number): number {
    return index;
  }
}
