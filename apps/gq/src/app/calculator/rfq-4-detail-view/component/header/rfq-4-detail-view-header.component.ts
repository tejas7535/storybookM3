import { CommonModule } from '@angular/common';
import { Component, computed, inject, Signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { CustomerSubheaderContentComponent } from '@gq/shared/components/header/customer-subheader-content/customer-subheader-content.component';
import { TagType } from '@gq/shared/models';
import { BreadcrumbsService } from '@gq/shared/services/breadcrumbs/breadcrumbs.service';
import { DeepSignal } from '@ngrx/signals';

import { Breadcrumb } from '@schaeffler/breadcrumbs';
import { ShareButtonModule } from '@schaeffler/share-button';
import { SubheaderModule } from '@schaeffler/subheader';
import { TagComponent } from '@schaeffler/tag';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { RecalculateSqvStatus } from '../../models/recalculate-sqv-status.enum';
import { RfqDetailViewData } from '../../models/rfq-4-detail-view-data.interface';
import { Rfq4DetailViewStore } from '../../store/rfq-4-detail-view.store';

@Component({
  selector: 'gq-rfq-4-detail-view-header',
  imports: [
    CommonModule,
    SharedTranslocoModule,
    SubheaderModule,
    CustomerSubheaderContentComponent,
    TagComponent,
    MatButtonModule,
    ShareButtonModule,
    MatButtonModule,
  ],
  templateUrl: './rfq-4-detail-view-header.component.html',
})
export class Rfq4DetailViewHeaderComponent {
  private readonly breadcrumbsService = inject(BreadcrumbsService);
  private readonly store = inject(Rfq4DetailViewStore);

  rfq4DetailViewData: DeepSignal<RfqDetailViewData> =
    this.store.rfq4DetailViewData;

  recalculationStatus: Signal<RecalculateSqvStatus> =
    this.store.getRecalculationStatus;

  breadcrumbs: Signal<Breadcrumb[]> = computed(() =>
    this.breadcrumbsService.getRfqDetailViewBreadcrumbs(
      this.rfq4DetailViewData().rfq4ProcessData.rfqId.toString()
    )
  );
  tagType: Signal<TagType> = computed(() =>
    this.getTagType(this.recalculationStatus())
  );

  isConfirmDisabled: Signal<boolean> = computed(
    () =>
      this.store.isCalculationDataInvalid() ||
      this.recalculationStatus() !== RecalculateSqvStatus.IN_PROGRESS ||
      !this.store.isLoggedUserAssignedToRfq()
  );

  getTagType(status: RecalculateSqvStatus): TagType {
    switch (status) {
      case RecalculateSqvStatus.OPEN: {
        return TagType.NEUTRAL;
      }
      case RecalculateSqvStatus.IN_PROGRESS: {
        return TagType.INFO;
      }
      case RecalculateSqvStatus.REOPEN: {
        return TagType.WARNING;
      }
      case RecalculateSqvStatus.CONFIRMED: {
        return TagType.SUCCESS;
      }
      default: {
        return TagType.NEUTRAL;
      }
    }
  }

  onConfirm() {
    this.store.triggerConfirmRecalculation();
  }
}
