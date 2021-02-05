import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DataService } from '@schaeffler/http';

import { Customer, QuotationIdentifier } from '../../core/store/models';

@Injectable({
  providedIn: 'root',
})
export class CustomerDetailsService {
  private readonly CUSTOMER_DETAILS = 'customers';

  constructor(private readonly dataService: DataService) {}

  public getCustomer(
    quotationIdentifier: QuotationIdentifier
  ): Observable<Customer> {
    const { customerNumber, salesOrg } = quotationIdentifier;

    return this.dataService
      .getAll<any>(`${this.CUSTOMER_DETAILS}/${customerNumber}/${salesOrg}`)
      .pipe(map((res: any) => res));
  }
}
