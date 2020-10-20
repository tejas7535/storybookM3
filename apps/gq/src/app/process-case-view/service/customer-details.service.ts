import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DataService } from '../../core/http/data.service';
import { Customer } from '../../core/store/models';

@Injectable({
  providedIn: 'root',
})
export class CustomerDetailsService {
  private readonly CUSTOMER_DETAILS = 'customers';

  constructor(private readonly dataService: DataService) {}

  public getCustomer(customerNumber: string): Observable<Customer> {
    return this.dataService
      .getAll<any>(`${this.CUSTOMER_DETAILS}/${customerNumber}`)
      .pipe(map((res: any) => res));
  }
}
