import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { ActiveCaseFacade } from '@gq/core/store/active-case/active-case.facade';
import { ActiveCaseModule } from '@gq/core/store/active-case/active-case.module';
import { OverlayComponent } from '@gq/f-pricing/pricing-assistant-modal/overlay/overlay.component';
import { LetDirective } from '@ngrx/component';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { RfqItemsTableComponent } from './rfq-items-table/rfq-items-table.component';

@Component({
  selector: 'gq-rfq-items-tab',
  imports: [
    CommonModule,
    SharedTranslocoModule,
    LoadingSpinnerModule,
    MatCardModule,
    OverlayComponent,
    RfqItemsTableComponent,
    LetDirective,
    ActiveCaseModule,
  ],

  templateUrl: './rfq-items-tab.component.html',
})
export class RfqItemsTabComponent {
  private readonly activeCaseFacade: ActiveCaseFacade =
    inject(ActiveCaseFacade);

  dataLoading$ = this.activeCaseFacade.quotationLoading$;
}
