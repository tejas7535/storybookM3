import { Inject, Injectable } from '@angular/core';

import { ColumnState } from '@ag-grid-enterprise/all-modules';
import { LOCAL_STORAGE } from '@ng-web-apis/common';

import { QuotationDetail } from '../../models/quotation-detail';

@Injectable({
  providedIn: 'root',
})
export class AgGridStateService {
  constructor(@Inject(LOCAL_STORAGE) readonly localStorage: Storage) {}

  public getColumnState(key: string): ColumnState[] {
    return JSON.parse(this.localStorage.getItem(key));
  }

  public setColumnState(key: string, columnState: ColumnState[]): void {
    this.localStorage.setItem(key, JSON.stringify(columnState));
  }

  public getColumnData(quotationId: string): QuotationDetail[] {
    return JSON.parse(this.localStorage.getItem(`${quotationId}_items`));
  }

  public setColumnData(
    quotationId: string,
    columnData: QuotationDetail[]
  ): void {
    this.localStorage.setItem(
      `${quotationId}_items`,
      JSON.stringify(
        columnData.map((detail: QuotationDetail) => ({
          gqPositionId: detail.gqPositionId,
          quotationItemId: detail.quotationItemId,
        }))
      )
    );
  }
}
