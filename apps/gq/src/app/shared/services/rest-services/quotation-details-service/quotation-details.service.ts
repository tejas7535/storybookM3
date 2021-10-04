import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { DataService } from '@schaeffler/http';

import { ExtendedComparableLinkedTransaction } from '../../../../core/store/reducers/extended-comparable-linked-transactions/models/extended-comparable-linked-transaction';
import {
  AddQuotationDetailsRequest,
  UpdateQuotationDetail,
} from '../../../../core/store/reducers/process-case/models';
import { ComparableLinkedTransaction } from '../../../../core/store/reducers/transactions/models/comparable-linked-transaction.model';
import { Quotation } from '../../../models';
import { QuotationDetail } from '../../../models/quotation-detail';
import { MaterialAlternativeCost } from '../../../models/quotation-detail/material-alternative-cost.model';
import { MaterialSalesOrg } from '../../../models/quotation-detail/material-sales-org.model';

@Injectable({
  providedIn: 'root',
})
export class QuotationDetailsService {
  private readonly PATH_QUOTATION_DETAILS = 'quotation-details';
  private readonly PATH_QUOTATIONS = 'quotations';
  private readonly PATH_TRANSACTIONS = 'comparable-transactions';
  private readonly PATH_MATERIAL_ALTERNATIVE_COSTS =
    'material-alternative-costs';
  private readonly PATH_MATERIAL_STATUS = 'material-status';

  constructor(private readonly dataService: DataService) {}

  public addMaterial(
    tableData: AddQuotationDetailsRequest
  ): Observable<Quotation> {
    return this.dataService.post(this.PATH_QUOTATION_DETAILS, tableData);
  }

  public removeMaterial(qgPositionIds: string[]): Observable<Quotation> {
    return this.dataService.delete(this.PATH_QUOTATION_DETAILS, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: qgPositionIds,
    });
  }

  public updateMaterial(
    quotationDetails: UpdateQuotationDetail[]
  ): Observable<QuotationDetail[]> {
    return this.dataService.put(this.PATH_QUOTATION_DETAILS, quotationDetails);
  }

  public getTransactions(
    gqPositionId: string
  ): Observable<ComparableLinkedTransaction[]> {
    return this.dataService.getAll(
      `${this.PATH_QUOTATION_DETAILS}/${gqPositionId}/${this.PATH_TRANSACTIONS}`
    );
  }

  public getAllTransactions(
    quotationNumber: number
  ): Observable<ExtendedComparableLinkedTransaction[]> {
    return this.dataService.getAll(
      `${this.PATH_QUOTATIONS}/${quotationNumber}/${this.PATH_TRANSACTIONS}`
    );
  }

  getMaterialAlternativeCosts(
    gqPositionId: string
  ): Observable<MaterialAlternativeCost[]> {
    return this.dataService.getAll(
      `${this.PATH_QUOTATION_DETAILS}/${gqPositionId}/${this.PATH_MATERIAL_ALTERNATIVE_COSTS}`
    );
  }

  getMaterialStatus(gqPositionId: string): Observable<MaterialSalesOrg> {
    return this.dataService.getAll(
      `${this.PATH_QUOTATION_DETAILS}/${gqPositionId}/${this.PATH_MATERIAL_STATUS}`
    );
  }
}
