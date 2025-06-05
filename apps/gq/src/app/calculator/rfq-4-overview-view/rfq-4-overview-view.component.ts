import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Signal,
} from '@angular/core';
import { Router } from '@angular/router';

import { AppRoutePath } from '@gq/app-route-path.enum';
import { SharedDirectivesModule } from '@gq/shared/directives/shared-directives.module';
import { TRANSLOCO_SCOPE } from '@jsverse/transloco';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SubheaderModule } from '@schaeffler/subheader';
import { SharedTranslocoModule } from '@schaeffler/transloco';
import { ViewToggle, ViewToggleModule } from '@schaeffler/view-toggle';

import { RfqRequest } from '../service/models/get-rfq-requests-response.interface';
import { Rfq4RequestsTableComponent } from './components/rfq-4-requests-table/rfq-4-requests-table.component';
import { CalculatorTab } from './models/calculator-tab.enum';
import { CalculatorViewToggle } from './models/calculator-view-toggle.interface';
import { Rfq4OverviewStore } from './store/rfq-4-overview.store';

@Component({
  selector: 'gq-rfq-4-overview-view',
  templateUrl: './rfq-4-overview-view.component.html',
  imports: [
    CommonModule,
    LoadingSpinnerModule,
    SharedTranslocoModule,
    SubheaderModule,
    ViewToggleModule,
    Rfq4RequestsTableComponent,
    SharedDirectivesModule,
  ],
  providers: [
    Rfq4OverviewStore,
    { provide: TRANSLOCO_SCOPE, useValue: 'calculator', multi: true },
  ],

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Rfq4OverviewViewComponent {
  private readonly router: Router = inject(Router);
  private readonly rfq4OverviewStore = inject(Rfq4OverviewStore);

  readonly rfq4CalculatorViews: Signal<CalculatorViewToggle[]> =
    this.rfq4OverviewStore.getViewToggles;
  readonly rfq4CalculatorItems: Signal<RfqRequest[]> =
    this.rfq4OverviewStore.getItemsForTab;
  readonly itemsLoading: Signal<boolean> = this.rfq4OverviewStore.loading;
  readonly activeTab: Signal<CalculatorTab> =
    this.rfq4OverviewStore.items.activeTab;

  onViewToggle(view: ViewToggle): void {
    this.rfq4OverviewStore.updateActiveTabByViewId(view.id);
  }

  // TODO: can be removed when there is a valid UX solution
  navToCaseOverview(): void {
    this.router.navigate([AppRoutePath.CaseViewPath]);
  }
}
