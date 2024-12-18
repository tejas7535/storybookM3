import { MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { CustomerInfoModalComponent } from './customer-info-modal.component';

const dialogRefSpy = {
  close: jest.fn(),
};

const mockDateWithMultipleCustomerInfo = {
  customerNumber: 'C123',
  customerName: 'Test Customer',
  customerInfo: [
    {
      globalCustomerNumber: 'C123',
      region: 'EMEA',
      salesOrg: 'S1',
      salesDescription: 'Sales Org 1',
      salesArea: 'Area 51',
      countryCode: 'DE',
      countryDescription: 'Germany',
      sector: 'Automotive',
      sectorDescription: 'Car Manufacturing',
      keyAccountNumber: 'KA001',
      keyAccountName: 'Key Account Name',
      subKeyAccountNumber: 'SKA001',
      subKeyAccountName: 'Sub Key Account Name',
      planningCurrency: 'EUR',
      accountOwner: 'John Doe',
      internalSales: 'Jane Roe',
      demandPlanner: 'Mark Moe',
      gkam: 'G KAM Person',
      kam: 'KAM Person',
    },
    {
      globalCustomerNumber: 'C456',
      region: 'NA',
      salesOrg: 'S2',
      salesDescription: 'Sales Org 2',
      salesArea: 'Area 52',
      countryCode: 'US',
      countryDescription: 'United States',
      sector: 'Tech',
      sectorDescription: 'Technology',
      keyAccountNumber: 'KA002',
      keyAccountName: 'Key Account Name 2',
      subKeyAccountNumber: 'SKA002',
      subKeyAccountName: 'Sub Key Account Name 2',
      planningCurrency: 'USD',
      accountOwner: 'Alice Doe',
      internalSales: 'Bob Roe',
      demandPlanner: 'Charlie Moe',
      gkam: 'G KAM Person 2',
      kam: 'KAM Person 2',
    },
  ],
};

const mockDataWithSingleCustomerInfo = {
  ...mockDateWithMultipleCustomerInfo,
  customerInfo: [mockDateWithMultipleCustomerInfo.customerInfo[0]],
};

describe('CustomerInfoModalComponent Multiple Customer Info', () => {
  let spectator: Spectator<CustomerInfoModalComponent>;

  const createComponent = createComponentFactory({
    component: CustomerInfoModalComponent,
    imports: [
      MatDialogContent,
      MatDialogActions,
      MatDialogTitle,
      MatButton,
      MatCard,
      MatPaginatorModule,
    ],
    providers: [
      { provide: MatDialogRef, useValue: dialogRefSpy },
      {
        provide: MAT_DIALOG_DATA,
        useValue: mockDateWithMultipleCustomerInfo,
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should display the title and include the customer number and name', () => {
    const titleEl = spectator.query('h2.text-headline-small');
    expect(titleEl).toHaveText('C123 - Test Customer');
  });

  it('should display customer attributes for the first page', () => {
    const textContent = spectator.query('mat-dialog-content')?.textContent;

    // globalCustomerNumber (single value)
    expect(textContent).toContain('globalCustomerNumber:');
    expect(textContent).toContain('C123');

    // region (single value)
    expect(textContent).toContain('region:');
    expect(textContent).toContain('EMEA');

    // salesOrg (combined: salesOrg + salesDescription)
    expect(textContent).toContain('salesOrg:');
    expect(textContent).toContain('S1 - Sales Org 1');

    // salesArea (single value)
    expect(textContent).toContain('salesArea:');
    expect(textContent).toContain('Area 51');

    // country (combined: countryCode + countryDescription)
    expect(textContent).toContain('country:');
    expect(textContent).toContain('DE - Germany');

    // sector (combined: sector + sectorDescription)
    expect(textContent).toContain('sector:');
    expect(textContent).toContain('Automotive - Car Manufacturing');

    // keyAccount (combined: keyAccountNumber + keyAccountName)
    expect(textContent).toContain('keyAccount:');
    expect(textContent).toContain('KA001 - Key Account Name');

    // subKeyAccount (combined: subKeyAccountNumber + subKeyAccountName)
    expect(textContent).toContain('subKeyAccount:');
    expect(textContent).toContain('SKA001 - Sub Key Account Name');

    // planningCurrency (single value)
    expect(textContent).toContain('planningCurrency:');
    expect(textContent).toContain('EUR');
  });

  it('should display owner attributes for the first page', () => {
    const textContent = spectator.query('mat-dialog-content')?.textContent;

    // Owner attributes on first page:
    expect(textContent).toContain('accountOwner:');
    expect(textContent).toContain('John Doe');

    expect(textContent).toContain('internalSales:');
    expect(textContent).toContain('Jane Roe');

    expect(textContent).toContain('demandPlanner:');
    expect(textContent).toContain('Mark Moe');

    expect(textContent).toContain('gkam:');
    expect(textContent).toContain('G KAM Person');

    expect(textContent).toContain('kam:');
    expect(textContent).toContain('KAM Person');
  });

  it('should show a paginator if multiple customerInfo entries are present', () => {
    const paginator = spectator.query('mat-paginator');
    expect(paginator).toBeTruthy();
  });

  it('should paginate to the second entry', () => {
    spectator.component.handlePageEvent({
      pageIndex: 1,
      pageSize: 1,
      length: 2,
    } as any);

    spectator.detectChanges();

    const content = spectator.query('mat-dialog-content')?.textContent;
    expect(content).toContain('C456');
    expect(content).toContain('S2 - Sales Org 2');
    expect(content).toContain('Alice Doe');
  });

  it('should close the dialog when the close button is clicked', () => {
    const closeButton = spectator.query('button[mat-button]');
    spectator.click(closeButton);
    expect(dialogRefSpy.close).toHaveBeenCalled();
  });
});

describe('CustomerInfoModalComponent Single Customer Info', () => {
  let spectator: Spectator<CustomerInfoModalComponent>;

  const createComponent = createComponentFactory({
    component: CustomerInfoModalComponent,
    imports: [
      MatDialogContent,
      MatDialogActions,
      MatDialogTitle,
      MatButton,
      MatCard,
      MatPaginatorModule,
    ],
    providers: [
      { provide: MatDialogRef, useValue: dialogRefSpy },
      {
        provide: MAT_DIALOG_DATA,
        useValue: mockDataWithSingleCustomerInfo,
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should not display paginator when only one customer info entry is present', () => {
    const paginator = spectator.query('mat-paginator');
    expect(paginator).toBeNull();
  });
});
