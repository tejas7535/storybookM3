import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DataService } from '../../core/http/data.service';
import { CustomerDetails } from '../../core/store/models';

@Injectable({
  providedIn: 'root',
})
export class CustomerDetailsService {
  private readonly CUSTOMER_DETAILS = 'customer-details';

  constructor(private readonly dataService: DataService) {}

  public customerDetails(customerNumber: string): Observable<CustomerDetails> {
    return this.dataService
      .getAll<any>(`${this.CUSTOMER_DETAILS}/${customerNumber}`)
      .pipe(map((res: any) => res.item));
  }
}
