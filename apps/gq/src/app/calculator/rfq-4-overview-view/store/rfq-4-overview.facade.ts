import { Location } from '@angular/common';
import { inject, Signal } from '@angular/core';

import { CalculatorPaths } from '@gq/calculator/routing/calculator-routes';

import { CalculatorTab } from '../models/calculator-tab.enum';
import { CalculatorViewToggle } from '../models/calculator-view-toggle.interface';
import { Rfq4OverviewStore } from './rfq-4-overview.store';
export class Rfq4OverviewFacade {
  private readonly rfq4OverviewStore = inject(Rfq4OverviewStore);
  private readonly location: Location = inject(Location);

  // ##################################################################
  // #################### signals #####################################
  // ##################################################################
  rfq4CalculatorViews: Signal<CalculatorViewToggle[]> =
    this.rfq4OverviewStore.getViewToggles;
  rfq4CalculatorItemsForTab: Signal<string[]> =
    this.rfq4OverviewStore.getItemsForTab;

  // ##################################################################
  // #################### methods #####################################
  // ##################################################################
  setActiveTab(activeTab: CalculatorTab): void {
    this.rfq4OverviewStore.updateActiveTab(activeTab);
    this.location.go(
      `${CalculatorPaths.CalculatorOverviewPath}/${this.rfq4OverviewStore.items().activeTab}`
    );
  }
  loadItemsForView(viewId: number): void {
    this.rfq4OverviewStore.updateActiveTabByViewId(viewId);
    this.location.go(
      `${CalculatorPaths.CalculatorOverviewPath}/${this.rfq4OverviewStore.items().activeTab}`
    );
  }
}
