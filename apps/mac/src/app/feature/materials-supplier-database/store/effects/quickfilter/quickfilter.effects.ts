import { Injectable } from '@angular/core';

import { catchError, map, of, switchMap } from 'rxjs';

import { translate } from '@ngneat/transloco';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { QuickFilter } from '@mac/feature/materials-supplier-database/models';
import { MsdQuickFilterService } from '@mac/msd/services';
import * as DataActions from '@mac/msd/store/actions/data/data.actions';
import * as QuickFilterActions from '@mac/msd/store/actions/quickfilter/quickfilter.actions';

@Injectable()
export class QuickFilterEffects {
  publishQuickFilter$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(QuickFilterActions.publishQuickFilter),
      switchMap(({ quickFilter }) =>
        this.msdQuickFilterService
          .createNewQuickFilter({
            materialClass: quickFilter.materialClass,
            navigationLevel: quickFilter.navigationLevel,
            title: quickFilter.title,
            description: quickFilter.description,
            filter: quickFilter.filter,
            columns: quickFilter.columns,
          })
          .pipe(
            map((publishedQuickFilter: QuickFilter) =>
              QuickFilterActions.publishQuickFilterSuccess({
                publishedQuickFilter,
              })
            ),
            catchError(() =>
              of(
                DataActions.errorSnackBar({
                  message: translate(
                    'materialsSupplierDatabase.mainTable.quickfilter.management.error.publish'
                  ),
                }),
                QuickFilterActions.publishQuickFilterFailure()
              )
            )
          )
      )
    );
  });

  updatePublicQuickFilter$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(QuickFilterActions.updatePublicQuickFilter),
      switchMap(({ quickFilter }) =>
        this.msdQuickFilterService.updateQuickFilter(quickFilter).pipe(
          map((updatedQuickFilter: QuickFilter) =>
            QuickFilterActions.updatePublicQuickFilterSuccess({
              updatedQuickFilter,
            })
          ),
          catchError(() =>
            of(
              DataActions.errorSnackBar({
                message: translate(
                  'materialsSupplierDatabase.mainTable.quickfilter.management.error.update'
                ),
              }),
              QuickFilterActions.updatePublicQuickFilterFailure()
            )
          )
        )
      )
    );
  });

  fetchPublishedQuickFilters$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(QuickFilterActions.fetchPublishedQuickFilters),
      switchMap(({ materialClass, navigationLevel }) =>
        this.msdQuickFilterService
          .getPublishedQuickFilters(materialClass, navigationLevel)
          .pipe(
            map((publishedFilters: QuickFilter[]) =>
              QuickFilterActions.fetchPublishedQuickFiltersSuccess({
                publishedFilters,
              })
            ),
            catchError(() =>
              of(QuickFilterActions.fetchPublishedQuickFiltersFailure())
            )
          )
      )
    );
  });

  fetchSubscribedQuickFilters$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(QuickFilterActions.fetchSubscribedQuickFilters),
      switchMap(({ materialClass, navigationLevel }) =>
        this.msdQuickFilterService
          .getSubscribedQuickFilters(materialClass, navigationLevel)
          .pipe(
            map((subscribedFilters: QuickFilter[]) =>
              QuickFilterActions.fetchSubscribedQuickFiltersSuccess({
                subscribedFilters,
              })
            ),
            catchError(() =>
              of(QuickFilterActions.fetchSubscribedQuickFiltersFailure())
            )
          )
      )
    );
  });

  deletePublishedQuickFilter$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(QuickFilterActions.deletePublishedQuickFilter),
      switchMap(({ quickFilterId }) =>
        this.msdQuickFilterService.deleteQuickFilter(quickFilterId).pipe(
          map(() =>
            QuickFilterActions.deletePublishedQuickFilterSuccess({
              quickFilterId,
            })
          ),
          catchError(() =>
            of(
              DataActions.errorSnackBar({
                message: translate(
                  'materialsSupplierDatabase.mainTable.quickfilter.management.error.delete'
                ),
              }),
              QuickFilterActions.deletePublishedQuickFilterFailure()
            )
          )
        )
      )
    );
  });

  subscribeQuickFilter$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(QuickFilterActions.subscribeQuickFilter),
      switchMap(({ quickFilter }) =>
        this.msdQuickFilterService.subscribeQuickFilter(quickFilter.id).pipe(
          map(() =>
            QuickFilterActions.subscribeQuickFilterSuccess({
              subscribedQuickFilter: quickFilter,
            })
          ),
          catchError(() =>
            of(
              DataActions.errorSnackBar({
                message: translate(
                  'materialsSupplierDatabase.mainTable.quickfilter.management.error.subscribe'
                ),
              }),
              QuickFilterActions.subscribeQuickFilterFailure()
            )
          )
        )
      )
    );
  });

  unsubscribeQuickFilter$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(QuickFilterActions.unsubscribeQuickFilter),
      switchMap(({ quickFilterId }) =>
        this.msdQuickFilterService.unsubscribeQuickFilter(quickFilterId).pipe(
          map(() =>
            QuickFilterActions.unsubscribeQuickFilterSuccess({
              quickFilterId,
            })
          ),
          catchError(() =>
            of(
              DataActions.errorSnackBar({
                message: translate(
                  'materialsSupplierDatabase.mainTable.quickfilter.management.error.unsubscribe'
                ),
              }),
              QuickFilterActions.unsubscribeQuickFilterFailure()
            )
          )
        )
      )
    );
  });

  enableQuickFilterNotification$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(QuickFilterActions.enableQuickFilterNotification),
      switchMap(({ quickFilterId, isSubscribedQuickFilter }) =>
        this.msdQuickFilterService
          .enableQuickFilterNotification(quickFilterId)
          .pipe(
            map(() =>
              QuickFilterActions.enableQuickFilterNotificationSuccess({
                quickFilterId,
                isSubscribedQuickFilter,
              })
            ),
            catchError(() =>
              of(
                DataActions.errorSnackBar({
                  message: translate(
                    'materialsSupplierDatabase.mainTable.quickfilter.management.error.enableNotification'
                  ),
                }),
                QuickFilterActions.enableQuickFilterNotificationFailure()
              )
            )
          )
      )
    );
  });

  disableQuickFilterNotification$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(QuickFilterActions.disableQuickFilterNotification),
      switchMap(({ quickFilterId, isSubscribedQuickFilter }) =>
        this.msdQuickFilterService
          .disableQuickFilterNotification(quickFilterId)
          .pipe(
            map(() =>
              QuickFilterActions.disableQuickFilterNotificationSuccess({
                quickFilterId,
                isSubscribedQuickFilter,
              })
            ),
            catchError(() =>
              of(
                DataActions.errorSnackBar({
                  message: translate(
                    'materialsSupplierDatabase.mainTable.quickfilter.management.error.disableNotification'
                  ),
                }),
                QuickFilterActions.disableQuickFilterNotificationFailure()
              )
            )
          )
      )
    );
  });

  queryQuickFilters$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(QuickFilterActions.queryQuickFilters),
      switchMap(({ materialClass, navigationLevel, searchExpression }) =>
        this.msdQuickFilterService
          .queryQuickFilters(
            materialClass,
            navigationLevel,
            10,
            searchExpression
          )
          .pipe(
            map((queriedFilters: QuickFilter[]) =>
              QuickFilterActions.queryQuickFiltersSuccess({
                queriedFilters,
              })
            ),
            catchError(() => of(QuickFilterActions.queryQuickFiltersFailure()))
          )
      )
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly msdQuickFilterService: MsdQuickFilterService
  ) {}
}
