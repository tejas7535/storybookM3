import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';

import { CustomerSalesPlanChartComponent } from './components/customer-sales-plan-chart/customer-sales-plan-chart.component';
import { CustomerSelectionComponent } from './components/customer-selection/customer-selection.component';

export interface CustomerSelectionChange {
  customerNumber: string;
  customerName: string;
  planningCurrency: string;
}

@Component({
  selector: 'd360-sales-planning',
  standalone: true,
  imports: [
    CommonModule,
    CustomerSelectionComponent,
    CustomerSalesPlanChartComponent,
  ],
  templateUrl: './sales-planning.component.html',
  styleUrl: './sales-planning.component.scss',
})
export class SalesPlanningComponent {
  protected readonly planningCurrency = signal<string | null>(null);
  protected readonly customerName = signal<string | null>(null);
  protected readonly customerNumber = signal<string | null>(null);

  protected onCustomerSelectionChange(event: CustomerSelectionChange) {
    this.customerName.set(event.customerName);
    this.customerNumber.set(event.customerNumber);
    this.planningCurrency.set(event.planningCurrency);
  }
}
