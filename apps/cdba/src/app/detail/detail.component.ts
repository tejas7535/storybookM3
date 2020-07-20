import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import { DetailState } from '../core/store/reducers/detail/detail.reducer';
import { ReferenceType } from '../core/store/reducers/shared/models';
import {
  getReferenceType,
  getReferenceTypeLoading,
} from '../core/store/selectors/details/detail.selector';
import { DetailRoutePath } from './detail-route-path.enum';

interface Tab {
  label: string;
  link: string;
}

@Component({
  selector: 'cdba-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
  public loading$: Observable<boolean>;
  public referenceType$: Observable<ReferenceType>;
  public activeRoutPath$: Observable<string>;

  public tabs: Tab[] = [
    { label: 'tabs.detail', link: DetailRoutePath.DetailsPath },
    { label: 'tabs.billOfMaterial', link: DetailRoutePath.BomPath },
    { label: 'tabs.calculations', link: DetailRoutePath.CalculationsPath },
    { label: 'tabs.drawings', link: DetailRoutePath.DrawingsPath },
  ];

  public constructor(
    private readonly store: Store<DetailState>,
    private readonly location: Location
  ) {}

  public ngOnInit(): void {
    this.referenceType$ = this.store.pipe(select(getReferenceType));
    this.loading$ = this.store.pipe(select(getReferenceTypeLoading));
  }

  public backToSearch(): void {
    this.location.back();
  }

  /**
   * Improves performance of ngFor.
   */
  public trackByFn(index: number): number {
    return index;
  }
}
