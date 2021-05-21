import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { Tab } from '@cdba/shared/components';
import { ReferenceType } from '@cdba/shared/models';

import { getReferenceType } from '../core/store/selectors';
import { DetailRoutePath } from './detail-route-path.enum';

@Component({
  selector: 'cdba-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
  public referenceType$: Observable<ReferenceType>;
  public tabs: Tab[] = [
    {
      label$: 'detail.tabs.detail',
      link: DetailRoutePath.DetailsPath,
    },
    {
      label$: 'detail.tabs.billOfMaterial',
      link: DetailRoutePath.BomPath,
    },
    {
      label$: 'detail.tabs.calculations',
      link: DetailRoutePath.CalculationsPath,
    },
    // { label: this.translateKey('tabs.drawings'), link: DetailRoutePath.DrawingsPath },
  ];

  public constructor(private readonly store: Store) {}

  public ngOnInit(): void {
    this.referenceType$ = this.store.select(getReferenceType);
  }

  /**
   * Improves performance of ngFor.
   */
  public trackByFn(index: number): number {
    return index;
  }
}
