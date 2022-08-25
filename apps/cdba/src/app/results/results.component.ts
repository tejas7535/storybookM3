import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Store } from '@ngrx/store';

import { Breadcrumb } from '@schaeffler/breadcrumbs';

import { AppRoutePath } from '@cdba/app-route-path.enum';
import {
  getReferenceTypes,
  getResultCount,
  getSelectedRefTypeNodeIds,
  selectReferenceTypes,
} from '@cdba/core/store';
import { ReferenceType } from '@cdba/shared/models';
import { BreadcrumbsService } from '@cdba/shared/services';

@Component({
  selector: 'cdba-results',
  templateUrl: './results.component.html',
})
export class ResultsComponent implements OnInit {
  referenceTypesData$: Observable<ReferenceType[]>;
  selectedReferenceTypeIds$: Observable<string[]>;
  resultCount$: Observable<number>;
  breadcrumbs$: Observable<Breadcrumb[]>;

  public constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly breadcrumbsService: BreadcrumbsService
  ) {}

  ngOnInit(): void {
    this.referenceTypesData$ = this.store.select(getReferenceTypes).pipe(
      tap((refTypes) => {
        if (refTypes === undefined) {
          this.router.navigateByUrl(AppRoutePath.SearchPath);
        }
      })
    );
    this.selectedReferenceTypeIds$ = this.store.select(
      getSelectedRefTypeNodeIds
    );
    this.resultCount$ = this.store.select(getResultCount);

    this.breadcrumbs$ = this.breadcrumbsService.breadcrumbs$;
  }

  selectReferenceTypes(nodeIds: string[]): void {
    this.store.dispatch(selectReferenceTypes({ nodeIds }));
  }
}
