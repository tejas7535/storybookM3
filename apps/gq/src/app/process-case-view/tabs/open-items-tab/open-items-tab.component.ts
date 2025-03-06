import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { ActiveCaseFacade } from '@gq/core/store/active-case/active-case.facade';
import { OverlayComponent } from '@gq/f-pricing/pricing-assistant-modal/overlay/overlay.component';
import { LetDirective } from '@ngrx/component';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { OpenItemsTableComponent } from './open-items-table/open-items-table.component';

@Component({
  selector: 'gq-open-items-tab',
  imports: [
    CommonModule,
    SharedTranslocoModule,
    LoadingSpinnerModule,
    MatCardModule,
    OverlayComponent,
    OpenItemsTableComponent,
    LetDirective,
  ],

  templateUrl: './open-items-tab.component.html',
})
export class OpenItemsTabComponent {
  private readonly activeCaseFacade: ActiveCaseFacade =
    inject(ActiveCaseFacade);

  dataLoading$ = this.activeCaseFacade.quotationLoading$;
}
