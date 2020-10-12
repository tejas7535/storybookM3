import { Component } from '@angular/core';

@Component({
  selector: 'gq-customer-details',
  templateUrl: './customer-details.component.html',
})
export class CustomerDetailsComponent {
  public costumerDetails = [
    {
      title: 'customer',
      value: 'ABB OY',
    },

    {
      title: 'customerId',
      value: '26605',
    },
    {
      title: 'keyAccount',
      value: 'ABB',
    },
    {
      title: 'keyAccountId',
      value: '70',
    },
    {
      title: 'subKeyAccount',
      value: 'ABB Motors & Generators',
    },
    {
      title: 'subKeyAccountId',
      value: '100737',
    },
    {
      title: 'region',
      value: 'EU',
    },
    {
      title: 'subRegion',
      value: 'Western Europe',
    },
    {
      title: 'country',
      value: 'Finland',
    },
    {
      title: 'sectorManagement',
      value: 'PT',
    },
    {
      title: 'subSector',
      value: 'Finnland',
    },
    {
      title: 'subSectorOne',
      value: 'PT',
    },
  ];

  public trackByFn(index: number): number {
    return index;
  }
}
