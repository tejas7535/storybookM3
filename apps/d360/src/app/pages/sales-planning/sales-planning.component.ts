import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';

import { CustomerPlanningDetailsComponent } from './components/customer-planning-details/customer-planning-details.component';
import { CustomerSalesPlanChartComponent } from './components/customer-sales-plan-chart/customer-sales-plan-chart.component';
import { CustomerSelectionComponent } from './components/customer-selection/customer-selection.component';

export interface Customer {
  customerNumber: string | null;
  customerName: string | null;
  planningCurrency: string | null;
}

@Component({
  selector: 'd360-sales-planning',
  imports: [
    CommonModule,
    CustomerSelectionComponent,
    CustomerSalesPlanChartComponent,
    CustomerPlanningDetailsComponent,
  ],
  templateUrl: './sales-planning.component.html',
  styleUrl: './sales-planning.component.scss',
})
export class SalesPlanningComponent {
  protected readonly customer = signal<Customer>({
    customerNumber: null,
    customerName: null,
    planningCurrency: null,
  });
  protected readonly tableInFullscreen = signal<boolean | null>(null);

  public toggleTableFullscreen(): void {
    this.tableInFullscreen.update((open) => !open);
  }
}
