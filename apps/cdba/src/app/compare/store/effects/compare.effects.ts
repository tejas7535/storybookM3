/* eslint-disable ngrx/prefer-effect-callback-in-block-statement */
import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Params, Router } from '@angular/router';

import { of } from 'rxjs';
import { catchError, filter, map, mergeMap } from 'rxjs/operators';

import { AppRoutePath } from '@cdba/app-route-path.enum';
import { RoleFacade } from '@cdba/core/auth/role.facade';
import { RouterStateUrl } from '@cdba/core/store';
import { ReferenceTypeResult } from '@cdba/core/store/reducers/detail/models';
import { DetailService } from '@cdba/detail/service/detail.service';
import {
  BomIdentifier,
  BomItem,
  Calculation,
  ReferenceTypeIdentifier,
} from '@cdba/shared/models';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { Store } from '@ngrx/store';

import {
  loadAllProductDetails,
  loadBom,
  loadBomFailure,
  loadBomSuccess,
  loadCalculationHistory,
  loadCalculationHistoryFailure,
  loadCalculationHistorySuccess,
  loadCalculations,
  loadProductDetails,
  loadProductDetailsFailure,
  loadProductDetailsSuccess,
  selectCalculation,
  selectCompareItems,
} from '../actions/compare.actions';
import {
  getBomIdentifierForSelectedCalculation,
  getSelectedReferenceTypeIdentifiers,
} from '../selectors/compare.selectors';

@Injectable()
export class CompareEffects {
  public selectCompareItems$ = createEffect(() =>
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

  public loadAllProductDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadAllProductDetails),
      concatLatestFrom((_action) =>
        this.store.select(getSelectedReferenceTypeIdentifiers)
      ),
      map(([_action, identifiers]) => identifiers),
      mergeMap((identifiers) =>
        identifiers.map((referenceTypeIdentifier, index) =>
          loadProductDetails({
            referenceTypeIdentifier,
            index,
          })
        )
      )
    )
  );

  public loadProductDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadProductDetails),
      mergeMap((action) =>
        this.detailService.getDetails(action.referenceTypeIdentifier).pipe(
          map((item: ReferenceTypeResult) =>
            loadProductDetailsSuccess({
              item: item.referenceTypeDto,
              index: action.index,
            })
          ),
          catchError((error: HttpErrorResponse) =>
            of(
              loadProductDetailsFailure({
                errorMessage: error.error.detail || error.message,
                statusCode: error.status,
                index: action.index,
              })
            )
          )
        )
      )
    )
  );

  public loadCalculations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCalculations),
      concatLatestFrom(() =>
        this.store.select(getSelectedReferenceTypeIdentifiers)
      ),
      map(([_action, identifiers]) => identifiers),
      mergeMap((identifiers) =>
        identifiers.map((identifier, index) =>
          loadCalculationHistory({
            index,
            materialNumber: identifier.materialNumber,
            plant: identifier.plant,
          })
        )
      )
    )
  );

  public loadCalculationHistory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCalculationHistory),
      concatLatestFrom(() => this.roleFacade.hasAnyPricingRole$),
      mergeMap(([action, hasPricingRole]) => {
        return hasPricingRole
          ? this.detailService
              .getCalculations(action.materialNumber, action.plant)
              .pipe(
                map((items: Calculation[]) =>
                  loadCalculationHistorySuccess({
                    items,
                    plant: action.plant,
                    index: action.index,
                  })
                ),
                catchError((error: HttpErrorResponse) =>
                  of(
                    loadCalculationHistoryFailure({
                      errorMessage: error.error.detail || error.message,
                      statusCode: error.status,
                      index: action.index,
                    })
                  )
                )
              )
          : of(
              loadCalculationHistoryFailure({
                errorMessage: 'User has no valid cost roles.',
                statusCode: undefined,
                index: action.index,
              })
            );
      })
    )
  );

  public loadBillOfMaterial$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadBom),
      concatLatestFrom(() => this.roleFacade.hasAnyPricingRole$),
      mergeMap(([action, hasPricingRole]) => {
        return hasPricingRole
          ? this.detailService.getBom(action.bomIdentifier).pipe(
              map((items: BomItem[]) =>
                loadBomSuccess({ items, index: action.index })
              ),
              catchError((error: HttpErrorResponse) =>
                of(
                  loadBomFailure({
                    errorMessage: error.error.detail || error.message,
                    statusCode: error.status,
                    index: action.index,
                  })
                )
              )
            )
          : of(
              loadBomFailure({
                errorMessage: 'User has no valid cost roles.',
                statusCode: undefined,
                index: action.index,
              })
            );
      })
    )
  );

  public triggerBomLoad$ = createEffect(() =>
    this.actions$.pipe(
      ofType(selectCalculation, loadCalculationHistorySuccess),
      map((action) => action.index),
      concatLatestFrom((index) =>
        this.store.select(getBomIdentifierForSelectedCalculation, index)
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

  public triggerDataLoad$ = createEffect(() =>
    this.actions$.pipe(
      ofType(selectCompareItems),
      // eslint-disable-next-line ngrx/no-multiple-actions-in-effects
      mergeMap(() => [loadCalculations(), loadAllProductDetails()])
    )
  );

  public constructor(
    private readonly actions$: Actions,
    private readonly detailService: DetailService,
    private readonly store: Store,
    private readonly roleFacade: RoleFacade,
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
