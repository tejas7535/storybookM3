/* eslint-disable ngrx/prefer-effect-callback-in-block-statement */
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Params, Router } from '@angular/router';

import { of } from 'rxjs';
import { catchError, filter, map, mergeMap } from 'rxjs/operators';

import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { Store } from '@ngrx/store';

import { AppRoutePath } from '@cdba/app-route-path.enum';
import { RouterStateUrl } from '@cdba/core/store';
import { ProductDetailService } from '@cdba/detail/service/detail.service';
import { ReferenceTypeIdentifier } from '@cdba/shared/models';

import {
  loadAllProductDetails,
  loadProductDetails,
  loadProductDetailsFailure,
  loadProductDetailsSuccess,
  selectCompareItems,
} from '../actions';
import { getSelectedReferenceTypeIdentifiers } from '../selectors';

@Injectable()
export class ProductDetailsEffects {
  public selectCompareItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROUTER_NAVIGATED),
      map((action: any) => action.payload.routerState),
      filter(
        (routerState: RouterStateUrl) =>
          routerState.url.indexOf(AppRoutePath.ComparePath) === 1
      ),
      map((routerState) =>
        ProductDetailsEffects.mapQueryParams(routerState.queryParams)
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
        this.productDetailService
          .getDetails(action.referenceTypeIdentifier)
          .pipe(
            map((item) =>
              loadProductDetailsSuccess({
                item,
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

  public triggerDataLoad$ = createEffect(() =>
    this.actions$.pipe(
      ofType(selectCompareItems),
      map(() => loadAllProductDetails())
    )
  );

  public constructor(
    private readonly actions$: Actions,
    private readonly productDetailService: ProductDetailService,
    private readonly store: Store,
    private readonly router: Router
  ) {}

  private static mapQueryParams(
    queryParams: Params
  ): [nodeId: string, referenceTypeIdentifier: ReferenceTypeIdentifier][] {
    const mappingTable: { [key: string]: string } = {
      material_number: 'materialNumber',
      plant: 'plant',
      node_id: 'nodeId',
    };

    let compareItems: {
      [index: string]: any;
    } = {};

    for (const [key, value] of Object.entries(queryParams)) {
      const { index, queryKey } = ProductDetailsEffects.splitQueryKey(key);

      compareItems = {
        ...compareItems,
        [index]: {
          ...compareItems[index],
          [`${mappingTable[queryKey]}`]: value,
        },
      };
    }

    const identifiersComplete =
      ProductDetailsEffects.checkValidityOfIdentifiers(compareItems);

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
