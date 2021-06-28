import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Store } from '@ngrx/store';

import { AppRoutePath } from '@cdba/app-route-path.enum';
import {
  getReferenceTypes,
  getResultCount,
  getSelectedRefTypeNodeIds,
  selectReferenceTypes,
} from '@cdba/core/store';
import { ReferenceType } from '@cdba/shared/models';

@Component({
  selector: 'cdba-results',
  templateUrl: './results.component.html',
  styles: [
    `
      .content-area {
        height: calc(100% - theme('spacing.6'));
      }
    `,
  ],
})
export class ResultsComponent implements OnInit {
  referenceTypesData$: Observable<ReferenceType[]>;
  selectedReferenceTypeIds$: Observable<string[]>;
  resultCount$: Observable<number>;

  public constructor(
    private readonly store: Store,
    private readonly router: Router
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
  }

  selectReferenceTypes(nodeIds: string[]): void {
    this.store.dispatch(selectReferenceTypes({ nodeIds }));
  }
}
