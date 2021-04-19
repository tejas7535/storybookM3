import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { TranslocoService } from '@ngneat/transloco';
import { select, Store } from '@ngrx/store';

import { Tab } from '@cdba/shared/components';
import { ReferenceType } from '@cdba/shared/models';

import { DetailState } from '../core/store/reducers/detail/detail.reducer';
import { getReferenceType } from '../core/store/selectors';
import { DetailRoutePath } from './detail-route-path.enum';

@Component({
  selector: 'cdba-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
  public referenceType$: Observable<ReferenceType>;
  public tabs: Tab[];

  public constructor(
    private readonly store: Store<DetailState>,
    private readonly translocoService: TranslocoService
  ) {
    this.tabs = [
      {
        label$: this.translateKey('tabs.detail'),
        link: DetailRoutePath.DetailsPath,
      },
      {
        label$: this.translateKey('tabs.billOfMaterial'),
        link: DetailRoutePath.BomPath,
      },
      {
        label$: this.translateKey('tabs.calculations'),
        link: DetailRoutePath.CalculationsPath,
      },
      // { label: this.translateKey('tabs.drawings'), link: DetailRoutePath.DrawingsPath },
    ];
  }

  translateKey(key: string): Observable<string> {
    return this.translocoService.selectTranslate(key, {}, 'detail');
  }

  public ngOnInit(): void {
    this.referenceType$ = this.store.pipe(select(getReferenceType));
  }

  /**
   * Improves performance of ngFor.
   */
  public trackByFn(index: number): number {
    return index;
  }
}
