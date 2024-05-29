import { inject, Injectable } from '@angular/core';

import { catchError, map, mergeMap, of } from 'rxjs';

import { CustomerService } from '@gq/shared/services/rest/customer/customer.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { SectorGpsdActions } from './sector-gpsd.actions';
@Injectable()
export class SectorGpsdEffects {
  private readonly actions$: Actions = inject(Actions);
  private readonly customerService: CustomerService = inject(CustomerService);

  getAllSectorGpsdByCustomerAndSalesOrg$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SectorGpsdActions.getAllSectorGpsds),
      mergeMap((action) => {
        return this.customerService
          .getSectorGpsdsByCustomerAndSalesOrg(
            action.customerId,
            action.salesOrg
          )
          .pipe(
            map((sectorGpsds) =>
              SectorGpsdActions.getAllSectorGpsdsSuccess({ sectorGpsds })
            ),
            catchError((errorMessage) =>
              of(SectorGpsdActions.getAllSectorGpsdsFailure({ errorMessage }))
            )
          );
      })
    );
  });
}
