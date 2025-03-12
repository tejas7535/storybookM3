import { MatDialog } from '@angular/material/dialog';

import { of } from 'rxjs';

import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import { createComponentFactory, mockProvider } from '@ngneat/spectator/jest';

import { CustomerInfo } from '../../../../feature/sales-planning/model';
import { SalesPlanningService } from '../../../../feature/sales-planning/sales-planning.service';
import { SingleAutocompleteOnTypeComponent } from '../../../../shared/components/inputs/autocomplete/single-autocomplete-on-type/single-autocomplete-on-type.component';
import { SelectableOptionsService } from '../../../../shared/services/selectable-options.service';
import { CustomerSelectionComponent } from './customer-selection.component';

describe('CustomerSelectionComponent', () => {
  const mockSalesPlanResponse = {
    invoiceSalesTwoYearsAgo: 1000,
    invoiceSalesPreviousYear: 2000,
    unconstrainedPlanThisYear: 3000,
    constrainedPlanThisYear: 4000,
    unconstrainedPlanNextYear: 5000,
    constrainedPlanNextYear: 6000,
    unconstrainedPlanTwoYearsFromNow: 7000,
    constrainedPlanTwoYearsFromNow: 8000,
    unconstrainedPlanThreeYearsFromNow: 8000,
    constrainedPlanThreeYearsFromNow: 9000,
    planningCurrency: 'EUR',
  };

  const mockCustomerInfo: CustomerInfo[] = [
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
  ];

  const mockTranslocoLocaleService = {
    localizeNumber: (value: number | null, _format: string) =>
      value == null ? null : value.toString(),
    getLocale: () => 'de',
  };

  const mockDialogRef = {
    close: jest.fn(),
  };

  const mockDialog = {
    open: jest.fn().mockReturnValue(mockDialogRef),
  };

  const createComponent = createComponentFactory({
    component: CustomerSelectionComponent,
    providers: [
      {
        provide: SalesPlanningService,
        useValue: {
          getCustomerSalesPlan: jest
            .fn()
            .mockReturnValue(of(mockSalesPlanResponse)),
          getCustomerInfo: jest.fn().mockReturnValue(of(mockCustomerInfo)),
        },
      },
      {
        provide: TranslocoLocaleService,
        useValue: mockTranslocoLocaleService,
      },
      { provide: MatDialog, useValue: mockDialog },
      mockProvider(SelectableOptionsService),
    ],
  });

  it('should create and display the title', () => {
    const spectator = createComponent();
    const title = spectator.query('h2.text-title-large');
    expect(title).toBeTruthy();
    expect(title?.textContent).toContain('sales_planning.title');
  });

  it('should have the autocomplete and info button disabled initially', () => {
    const spectator = createComponent();
    const autocomplete = spectator.query(SingleAutocompleteOnTypeComponent);
    expect(autocomplete).toBeTruthy();

    const infoButton = spectator.query('button[mat-icon-button]');
    expect(infoButton).toBeTruthy();
    expect(infoButton).toBeDisabled();
  });

  it('should load and display sales plan after selecting a customer', () => {
    const spectator = createComponent();
    const customerChangeEvent = {
      option: { id: 'C123', text: 'Test Customer' },
    };

    jest
      .spyOn(
        spectator.component['salesPlanningService'],
        'getCustomerSalesPlan'
      )
      .mockReturnValue(of(mockSalesPlanResponse) as any);

    const autocomplete = spectator.query(SingleAutocompleteOnTypeComponent);
    expect(autocomplete).toBeTruthy();

    spectator.component.handleCustomerChange(customerChangeEvent as any);
    spectator.detectChanges();

    expect(
      spectator.component['salesPlanningService'].getCustomerSalesPlan
    ).toHaveBeenCalledWith('C123');

    const currentYear = new Date().getFullYear();

    // The component sorts them by year, so we expect (currentYear-2), (currentYear-1), currentYear, (currentYear+1), (currentYear+2)
    // Check if these years and values appear in the DOM:
    const content = spectator.element.textContent;
    expect(content).toContain((currentYear - 2).toString());
    expect(content).toContain('2000');
    expect(content).toContain((currentYear - 1).toString());

    // Current year unconstrained/constrained
    expect(content).toContain(currentYear.toString());
    expect(content).toContain('3000');
    expect(content).toContain('4000');

    // Next year
    expect(content).toContain((currentYear + 1).toString());
    expect(content).toContain('5000');
    expect(content).toContain('6000');

    // Year after next
    expect(content).toContain((currentYear + 2).toString());
    expect(content).toContain('7000');
    expect(content).toContain('8000');

    // Year after next + 1
    expect(content).toContain((currentYear + 2).toString());
    expect(content).toContain('8000');
    expect(content).toContain('9000');

    expect(content).toContain('EUR');

    const infoButton = spectator.query('button[mat-icon-button]');
    expect(infoButton).not.toBeDisabled();
  });

  it('should fetch customer info and open modal when info button is clicked for the first time', () => {
    const spectator = createComponent();
    jest
      .spyOn(
        spectator.component['salesPlanningService'],
        'getCustomerSalesPlan'
      )
      .mockReturnValue(of(mockSalesPlanResponse) as any);
    jest
      .spyOn(spectator.component['salesPlanningService'], 'getCustomerInfo')
      .mockReturnValue(of(mockCustomerInfo) as any);
    const customerChangeEvent = {
      option: { id: 'C123', text: 'Test Customer' },
    };
    spectator.component.handleCustomerChange(customerChangeEvent as any);
    spectator.detectChanges();

    const infoButton = spectator.query('button[mat-icon-button]');
    expect(infoButton).not.toBeDisabled();

    spectator.click(infoButton);
    spectator.detectChanges();

    expect(
      spectator.component['salesPlanningService'].getCustomerInfo
    ).toHaveBeenCalledWith('C123', 'de');
    expect(mockDialog.open).toHaveBeenCalledWith(expect.any(Function), {
      data: {
        customerInfo: mockCustomerInfo,
        customerNumber: 'C123',
        customerName: 'Test Customer',
      },
      autoFocus: false,
      disableClose: true,
      panelClass: ['form-dialog'],
      minWidth: '50vw',
    });
  });
});
