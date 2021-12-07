import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Tab } from '@cdba/shared/components';
import { BreadcrumbsService } from '@cdba/shared/services';

import { Breadcrumb } from '@schaeffler/breadcrumbs';

import { CompareRoutePath } from './compare-route-path.enum';

@Component({
  selector: 'cdba-compare',
  templateUrl: './compare.component.html',
})
export class CompareComponent implements OnInit {
  public breadcrumbs$: Observable<Breadcrumb[]>;
  public tabs: Tab[];

  constructor(private readonly breadcrumbService: BreadcrumbsService) {}

  ngOnInit(): void {
    this.breadcrumbs$ = this.breadcrumbService.breadcrumbs$;

    this.tabs = [
      {
        label: 'compare.tabs.billOfMaterial',
        link: CompareRoutePath.BomPath,
      },
      {
        label: 'compare.tabs.details',
        link: CompareRoutePath.DetailsPath,
      },
    ];
  }

  /**
   * Improves performance of ngFor.
   */
  public trackByFn(index: number): number {
    return index;
  }
}
