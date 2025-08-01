import { CommonModule } from '@angular/common';
import { Component, computed, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { RecalculateSqvStatus } from '@gq/calculator/rfq-4-detail-view/models/recalculate-sqv-status.enum';
import { RolesFacade } from '@gq/core/store/facades';
import { KpiStatusCardComponent } from '@gq/shared/components/kpi-status-card/kpi-status-card.component';
import { LabelTextModule } from '@gq/shared/components/label-text/label-text.module';
import { ActiveDirectoryUser } from '@gq/shared/models';
import { SharedPipesModule } from '@gq/shared/pipes/shared-pipes.module';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import {
  CalculatorQuotationDetailData,
  CalculatorRfq4ProcessData,
} from '../../../models/rfq-4-detail-view-data.interface';
import { Rfq4DetailViewStore } from '../../../store/rfq-4-detail-view.store';

@Component({
  selector: 'gq-rfq-4-detail-view-position-information',
  imports: [
    CommonModule,
    SharedTranslocoModule,
    KpiStatusCardComponent,
    LabelTextModule,
    SharedPipesModule,
  ],
  templateUrl: './position-information.component.html',
})
export class PositionInformationComponent {
  private readonly store = inject(Rfq4DetailViewStore);
  private readonly rolesFacade = inject(RolesFacade);

  userId: Signal<string> = toSignal(this.rolesFacade.loggedInUserId$);
  positionInformation: Signal<CalculatorQuotationDetailData> =
    this.store.getQuotationDetailData;
  rfq4ProcessData: Signal<CalculatorRfq4ProcessData> =
    this.store.getRfq4ProcessData;
  productStructureUrl: Signal<string> = this.store.getProductStructureUrl;
  processAssignedToAdUser: Signal<ActiveDirectoryUser> =
    this.store.processAssignedToAdUser;
  isRfqCancelled: Signal<boolean> = computed(
    () =>
      this.rfq4ProcessData().calculatorRequestRecalculationStatus ===
      RecalculateSqvStatus.CANCELLED
  );
  showAssignButton: Signal<boolean> = computed(() => {
    if (this.userId() === this.rfq4ProcessData().assignedUserId) {
      return false;
    }

    return (
      this.rfq4ProcessData().calculatorRequestRecalculationStatus !==
        RecalculateSqvStatus.CONFIRMED && !this.isRfqCancelled()
    );
  });

  assignRfq(): void {
    this.store.assignRfq();
  }

  openLink() {
    window.open(this.productStructureUrl(), '_blank', 'noopener');
  }
}
