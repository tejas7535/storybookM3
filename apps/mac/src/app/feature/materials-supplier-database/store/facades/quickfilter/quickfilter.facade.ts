import { Injectable } from '@angular/core';

import { filter, Observable, take } from 'rxjs';

import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import {
  MaterialClass,
  NavigationLevel,
} from '@mac/feature/materials-supplier-database/constants';
import { QuickFilter } from '@mac/feature/materials-supplier-database/models';
import {
  getLocalQuickFilters,
  getOwnQuickFilters,
  getQueriedQuickFilters,
  getSubscribedQuickFilters,
  isLoading,
} from '@mac/msd/store';
import * as QuickFilterActions from '@mac/msd/store/actions/quickfilter/quickfilter.actions';

@Injectable({
  providedIn: 'root',
})
export class QuickFilterFacade {
  localQuickFilters$ = this.store.select(getLocalQuickFilters);

  ownQuickFilters$ = this.store.select(getOwnQuickFilters); // local and published

  subscribedQuickFilters$ = this.store.select(getSubscribedQuickFilters);

  queriedQuickFilters$ = this.store.select(getQueriedQuickFilters);

  isLoading$ = this.store.select(isLoading);

  publishQuickFilterSucceeded$ = this.actions$.pipe(
    ofType(QuickFilterActions.publishQuickFilterSuccess)
  );

  quickFilterActivated$ = this.actions$.pipe(
    ofType(QuickFilterActions.activateQuickFilter)
  );

  constructor(
    private readonly store: Store,
    private readonly actions$: Actions
  ) {}

  setLocalQuickFilters(localFilters: QuickFilter[]): void {
    this.store.dispatch(
      QuickFilterActions.setLocalQuickFilters({ localFilters })
    );
  }

  createQuickFilter(quickFilter: QuickFilter): void {
    if (quickFilter.description) {
      this.store.dispatch(
        QuickFilterActions.publishQuickFilter({ quickFilter })
      );
    } else {
      this.store.dispatch(
        QuickFilterActions.addLocalQuickFilter({ localFilter: quickFilter })
      );
    }
  }

  updateQuickFilter(
    oldFilter: QuickFilter,
    newFilter: QuickFilter,
    hasEditorRole$: Observable<boolean>
  ): void {
    if (newFilter.id) {
      hasEditorRole$
        .pipe(
          take(1),
          filter((hasEditorRole: boolean) => hasEditorRole)
        )
        .subscribe(() =>
          this.store.dispatch(
            QuickFilterActions.updatePublicQuickFilter({
              quickFilter: newFilter,
            })
          )
        );
    } else {
      this.store.dispatch(
        QuickFilterActions.updateLocalQuickFilter({ oldFilter, newFilter })
      );
    }
  }

  deleteQuickFilter(quickFilter: QuickFilter): void {
    if (quickFilter.id) {
      this.store.dispatch(
        QuickFilterActions.deletePublishedQuickFilter({
          quickFilterId: quickFilter.id,
        })
      );
    } else {
      this.store.dispatch(
        QuickFilterActions.removeLocalQuickFilter({ localFilter: quickFilter })
      );
    }
  }

  fetchPublishedQuickFilters(
    materialClass: MaterialClass,
    navigationLevel: NavigationLevel
  ): void {
    this.store.dispatch(
      QuickFilterActions.fetchPublishedQuickFilters({
        materialClass,
        navigationLevel,
      })
    );
  }

  fetchSubscribedQuickFilters(
    materialClass: MaterialClass,
    navigationLevel: NavigationLevel
  ): void {
    this.store.dispatch(
      QuickFilterActions.fetchSubscribedQuickFilters({
        materialClass,
        navigationLevel,
      })
    );
  }

  subscribeQuickFilter(quickFilter: QuickFilter): void {
    this.store.dispatch(
      QuickFilterActions.subscribeQuickFilter({ quickFilter })
    );
  }

  unsubscribeQuickFilter(quickFilterId: number): void {
    this.store.dispatch(
      QuickFilterActions.unsubscribeQuickFilter({ quickFilterId })
    );
  }

  queryQuickFilters(
    materialClass: MaterialClass,
    navigationLevel: NavigationLevel,
    searchExpression: string
  ): void {
    this.store.dispatch(
      QuickFilterActions.queryQuickFilters({
        materialClass,
        navigationLevel,
        searchExpression,
      })
    );
  }

  resetQueriedQuickFilters(): void {
    this.store.dispatch(QuickFilterActions.resetQueriedQuickFilters());
  }

  activateQuickFilter(quickFilter: QuickFilter): void {
    this.store.dispatch(
      QuickFilterActions.activateQuickFilter({ quickFilter })
    );
  }
}
