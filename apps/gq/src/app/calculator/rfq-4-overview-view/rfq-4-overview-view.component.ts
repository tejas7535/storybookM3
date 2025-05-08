import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { PushPipe } from '@ngrx/component';

import { SubheaderModule } from '@schaeffler/subheader';
import { SharedTranslocoModule } from '@schaeffler/transloco';
import { ViewToggle, ViewToggleModule } from '@schaeffler/view-toggle';

import { Rfq4OverviewModule } from './rfq-4-overview.module';
import { Rfq4OverviewFacade } from './store/rfq-4-overview.facade';

@Component({
  selector: 'gq-rfq-4-overview-view',
  templateUrl: './rfq-4-overview-view.component.html',
  imports: [
    CommonModule,
    SharedTranslocoModule,
    SubheaderModule,
    ViewToggleModule,
    Rfq4OverviewModule,
    PushPipe,
  ],

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Rfq4OverviewViewComponent {
  private readonly rfq4Facade: Rfq4OverviewFacade = inject(Rfq4OverviewFacade);

  readonly rfq4CalculatorViews = this.rfq4Facade.rfq4CalculatorViews;
  readonly rfq4CalculatorItems = this.rfq4Facade.rfq4CalculatorItemsForTab;

  onViewToggle(view: ViewToggle): void {
    this.rfq4Facade.loadItemsForView(view.id);
  }
}
