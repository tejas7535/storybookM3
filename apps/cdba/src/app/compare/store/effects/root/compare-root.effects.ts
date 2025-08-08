import { Injectable } from '@angular/core';
import { Params, Router } from '@angular/router';

import { filter, map } from 'rxjs';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { Store } from '@ngrx/store';

import { AppRoutePath } from '@cdba/app-route-path.enum';
import { CompareRoutePath } from '@cdba/compare/compare-route-path.enum';
import { getCompareState, RouterStateUrl } from '@cdba/core/store';
import { ReferenceTypeIdentifier } from '@cdba/shared/models';
import { ComparableItemIdentifier } from '@cdba/shared/models/comparison.model';

import { loadComparisonFeatureData } from '../../actions/root/compare-root.actions';
import { CompareState } from '../../reducers/compare.reducer';

@Injectable()
export class CompareRootEffects {
  handleRoute$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ROUTER_NAVIGATED),
      map((action: any) => action.payload.routerState),
      filter(
        (routerState: RouterStateUrl) =>
          routerState.url.indexOf(AppRoutePath.ComparePath) === 1
      ),
      concatLatestFrom(() => this.store.select(getCompareState)),
      map(
        ([routerState, compareState]: [RouterStateUrl, CompareState]): [
          RouterStateUrl,
          CompareState,
          ComparableItemIdentifier[],
        ] => [
          routerState,
          compareState,
          CompareRootEffects.mapQueryParams(routerState.queryParams),
        ]
      ),
      filter(
        ([routerState, compareState, comparableItems]: [
          RouterStateUrl,
          CompareState,
          ComparableItemIdentifier[],
        ]) => {
          if (comparableItems === undefined) {
            this.router.navigate(['not-found']);

            return false;
          }
          /* Empty Comparison feature State
          User accessed the URL via Share function or Comparison is running for the first time 
          */
          if (
            compareState[0] === undefined &&
            compareState[1] === undefined &&
            compareState?.comparison === undefined
          ) {
            return true;
          }

          /* Material number mismatch
           User reselected different reference type which should trigger loading new comparison
           */
          if (
            !comparableItems.some(
              (item) =>
                item.referenceTypeIdentifier.materialNumber ===
                compareState[0].referenceType.materialNumber
            ) ||
            !comparableItems.some(
              (item) =>
                item.referenceTypeIdentifier.materialNumber ===
                compareState[1].referenceType.materialNumber
            )
          ) {
            return true;
          }

          if (routerState.url.includes(CompareRoutePath.BomPath)) {
            return (
              compareState[0]?.billOfMaterial === undefined &&
              compareState[1]?.billOfMaterial === undefined
            );
          }

          if (routerState.url.includes(CompareRoutePath.DetailsPath)) {
            return (
              compareState[0]?.details === undefined &&
              compareState[1]?.details === undefined
            );
          }

          /* Check if valid BOMs were loaded */
          if (
            routerState.url.includes(CompareRoutePath.ComparisonSummaryPath)
          ) {
            const firstBomLoaded =
              !compareState[0].billOfMaterial.loading &&
              compareState[0].billOfMaterial.items.length > 0;

            const secondBomLoaded =
              !compareState[1].billOfMaterial.loading &&
              compareState[1].billOfMaterial.items.length > 0;

            return (
              !compareState?.comparison && firstBomLoaded && secondBomLoaded
            );
          }

          return true;
        }
      ),
      map(
        ([_routerState, _compareState, comparableItems]: [
          RouterStateUrl,
          CompareState,
          ComparableItemIdentifier[],
        ]) => loadComparisonFeatureData({ items: comparableItems })
      )
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly router: Router,
    private readonly store: Store
  ) {}

  static mapQueryParams(queryParams: Params): ComparableItemIdentifier[] {
    const comparableItems = [
      CompareRootEffects.extractItem(queryParams, 1),
      CompareRootEffects.extractItem(queryParams, 2),
    ];

    return CompareRootEffects.validateItems(comparableItems)
      ? comparableItems
      : undefined;
  }

  private static validateItems(items: ComparableItemIdentifier[]): boolean {
    if (items.includes(undefined)) {
      return false;
    }

    for (const item of items) {
      if (
        !item.referenceTypeIdentifier.materialNumber ||
        !item.referenceTypeIdentifier.plant
      ) {
        return false;
      }
    }

    return true;
  }

  private static extractItem(
    queryParams: Params,
    itemNumber: number
  ): ComparableItemIdentifier {
    const params = Object.entries(queryParams).filter(([key]) =>
      key.endsWith(`_${itemNumber}`)
    );

    if (params.length === 0) {
      return undefined;
    }

    const mappingTable: { [key: string]: string } = {
      selected_calculation_id: 'selectedCalculationId',
      material_number: 'materialNumber',
      plant: 'plant',
    };

    const referenceTypeIdentifier: ReferenceTypeIdentifier = {
      materialNumber: undefined,
      plant: undefined,
    };

    let selectedCalculationId: string | undefined;

    params.forEach(([key, value]) => {
      const mappedKey = mappingTable[key.split('_item_')[0]];
      if (mappedKey === 'materialNumber' || mappedKey === 'plant') {
        referenceTypeIdentifier[mappedKey] = value;
      } else if (mappedKey === 'selectedCalculationId') {
        selectedCalculationId = value;
      }
    });

    return { selectedCalculationId, referenceTypeIdentifier };
  }
}
