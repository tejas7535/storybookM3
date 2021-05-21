import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';

import { Tab } from '@cdba/shared/components';

import { CompareRoutePath } from './compare-route-path.enum';
import { getIsCompareDetailsDisabled } from './store';

@Component({
  selector: 'cdba-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.scss'],
})
export class CompareComponent implements OnInit {
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

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.tabs[0].disabled$ = this.store.select(getIsCompareDetailsDisabled);
  }
  /**
   * Improves performance of ngFor.
   */
  public trackByFn(index: number): number {
    return index;
  }
}
