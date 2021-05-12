/* eslint-disable ngrx/prefer-effect-callback-in-block-statement */
import { Injectable } from '@angular/core';
import { Params, Router } from '@angular/router';

import { of } from 'rxjs';
import { catchError, filter, map, mergeMap } from 'rxjs/operators';

import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { select, Store } from '@ngrx/store';

import { AppRoutePath } from '@cdba/app-route-path.enum';
import { RouterStateUrl } from '@cdba/core/store';
import {
  BomIdentifier,
  BomItem,
  Calculation,
  ReferenceTypeIdentifier,
} from '@cdba/shared/models';

import { DetailService } from '../../../detail/service/detail.service';
import {
  loadBom,
  loadBomFailure,
  loadBomSuccess,
  loadCalculationHistory,
  loadCalculationHistoryFailure,
  loadCalculationHistorySuccess,
  loadCalculations,
  selectCalculation,
  selectCompareItems,
} from '../actions/compare.actions';
import {
  getBomIdentifierForSelectedCalculation,
  getSelectedReferenceTypeIdentifiers,
} from '../selectors/compare.selectors';

@Injectable()
export class CompareEffects {
  selectCompareItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROUTER_NAVIGATED),
      map((action: any) => action.payload.routerState),
      filter(
        (routerState: RouterStateUrl) =>
          routerState.url.indexOf(AppRoutePath.ComparePath) === 1
      ),
      map((routerState) =>
        CompareEffects.mapQueryParams(routerState.queryParams)
      ),
      filter(
        (
          value: [
            nodeId: string,
            referenceTypeIdentifier: ReferenceTypeIdentifier
          ][]
        ) => {
          if (value === undefined) {
            this.router.navigate(['not-found']);
          }

          return value !== undefined;
        }
      ),
      map(
        (
          items: [
            nodeId: string,
            referenceTypeIdentifier: ReferenceTypeIdentifier
          ][]
        ) => selectCompareItems({ items })
      )
    )
  );

  loadCalculations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCalculations),
      concatLatestFrom((_action) =>
        this.store.pipe(select(getSelectedReferenceTypeIdentifiers))
      ),
      map(([_action, identifiers]) => identifiers),
      mergeMap((identifiers) =>
        identifiers.map((identifier, index) =>
          loadCalculationHistory({
            index,
            materialNumber: identifier.materialNumber,
          })
        )
      )
    )
  );

  loadCalculationHistory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCalculationHistory),
      mergeMap((action: any) =>
        this.detailService.calculations(action.materialNumber).pipe(
          map((items: Calculation[]) =>
            loadCalculationHistorySuccess({ items, index: action.index })
          ),
          catchError((errorMessage) =>
            of(
              loadCalculationHistoryFailure({
                errorMessage,
                index: action.index,
              })
            )
          )
        )
      )
    )
  );

  loadBillOfMaterial$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadBom),
      map(
        (action) =>
          [action.index, action.bomIdentifier] as [number, BomIdentifier]
      ),
      mergeMap(([index, identifier]: [number, BomIdentifier]) =>
        this.detailService.getBom(identifier).pipe(
          map((items: BomItem[]) => loadBomSuccess({ items, index })),
          catchError((errorMessage) =>
            of(loadBomFailure({ errorMessage, index }))
          )
        )
      )
    )
  );

  triggerBomLoad$ = createEffect(() =>
    this.actions$.pipe(
      ofType(selectCalculation, loadCalculationHistorySuccess),
      map((action) => action.index),
      concatLatestFrom((index) =>
        this.store.pipe(select(getBomIdentifierForSelectedCalculation, index))
      ),
      filter(
        ([_index, bomIdentifier]: [number, BomIdentifier]) =>
          bomIdentifier !== undefined
      ),
      map(([index, bomIdentifier]: [number, BomIdentifier]) =>
        loadBom({ index, bomIdentifier })
      )
    )
  );

  triggerDataLoad$ = createEffect(() =>
    this.actions$.pipe(
      ofType(selectCompareItems),
      mergeMap(() => [loadCalculations()])
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly detailService: DetailService,
    private readonly store: Store,
    private readonly router: Router
  ) {}

  private static mapQueryParams(
    queryParams: Params
  ): [nodeId: string, referenceTypeIdentifier: ReferenceTypeIdentifier][] {
    const mappingTable: { [key: string]: string } = {
      material_number: 'materialNumber',
      plant: 'plant',
      identification_hash: 'identificationHash',
      node_id: 'nodeId',
    };

    let compareItems: {
      [index: string]: any;
    } = {};

    for (const [key, value] of Object.entries(queryParams)) {
      const { index, queryKey } = CompareEffects.splitQueryKey(key);

      compareItems = {
        ...compareItems,
        [index]: {
          ...compareItems[index],
          [`${mappingTable[queryKey]}`]: value,
        },
      };
    }

    const identifiersComplete =
      CompareEffects.checkValidityOfIdentifiers(compareItems);

    return identifiersComplete
      ? Object.values(compareItems).map(
          ({ nodeId, ...referenceTypeIdentifier }) => [
            nodeId,
            referenceTypeIdentifier,
          ]
        )
      : undefined;
  }

  private static splitQueryKey(queryKey: string): {
    index: string;
    queryKey: string;
  } {
    const splitted = queryKey.split('_item_');

    return { index: splitted[1], queryKey: splitted[0] };
  }

  private static checkValidityOfIdentifiers(identifiersMap: {
    [index: string]: ReferenceTypeIdentifier;
  }): boolean {
    const referenceTypeIdentifiers: ReferenceTypeIdentifier[] =
      Object.values(identifiersMap);

    if (referenceTypeIdentifiers.length !== 2) {
      return false;
    }

    for (const identifier of referenceTypeIdentifiers) {
      if (identifier.materialNumber && identifier.plant) {
        continue;
      }

      return false;
    }

    return true;
  }
}
