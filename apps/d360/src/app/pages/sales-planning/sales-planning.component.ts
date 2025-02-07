import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';

import { CustomerPlanningDetailsComponent } from './components/customer-planning-details/customer-planning-details.component';
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
    CustomerPlanningDetailsComponent,
  ],
  templateUrl: './sales-planning.component.html',
  styleUrl: './sales-planning.component.scss',
})
export class SalesPlanningComponent {
  protected readonly planningCurrency = signal<string | null>(null);
  protected readonly customerName = signal<string | null>(null);
  protected readonly customerNumber = signal<string | null>(null);
  protected readonly openFullscreen = signal<boolean>(false);
  protected readonly collapsedSection = signal<boolean>(false);

  protected onCustomerSelectionChange(event: CustomerSelectionChange) {
    this.customerName.set(event.customerName);
    this.customerNumber.set(event.customerNumber);
    this.planningCurrency.set(event.planningCurrency);
  }

  public toggleFullscreen() {
    this.openFullscreen.update((open) => !open);
  }

  public toggleSection() {
    this.collapsedSection.update((collapsed) => !collapsed);
  }
}
