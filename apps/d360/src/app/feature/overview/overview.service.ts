import { HttpClient, HttpParams } from '@angular/common/http';
import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Observable, switchMap, take } from 'rxjs';

import {
  BackendTableResponse,
  RequestParams,
} from '../../shared/components/table';
import { CurrencyService } from '../info/currency.service';

@Injectable({ providedIn: 'root' })
export class OverviewService {
  private readonly SALES_PLANNING_OVERVIEW_API: string =
    'api/sales-planning/overview';
  private readonly http: HttpClient = inject(HttpClient);
  private readonly currencyService: CurrencyService = inject(CurrencyService);
  private readonly destroyRef = inject(DestroyRef);

  public getRelevantPlanningKPIs(
    selectionFilters: {
      keyAccountNumber: string[];
      customerNumber: string[];
    },
    isAssignedToMe: boolean,
    params: RequestParams
  ): Observable<BackendTableResponse> {
    const { startRow, endRow, sortModel, columnFilters } = params;

    return this.currencyService.getCurrentCurrency().pipe(
      take(1),
      switchMap((currency: string) =>
        this.http.post<BackendTableResponse>(
          `${this.SALES_PLANNING_OVERVIEW_API}`,
          {
            startRow,
            endRow,
            sortModel,
            selectionFilters,
            columnFilters,
          },
          {
            params: new HttpParams()
              .set('isCustomerNumberAssignedToMe', isAssignedToMe)
              .set('currency', currency),
          }
        )
      ),
      takeUntilDestroyed(this.destroyRef)
    );
  }
}
