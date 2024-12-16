import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Subscription } from 'rxjs';

import { TranslocoService } from '@jsverse/transloco';
import { Store } from '@ngrx/store';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { isBomExportFeatureRunning } from '@cdba/core/store';
import { getSelectedRefTypeNodeIds } from '@cdba/core/store/selectors/search/search.selector';
import {
  BOM_EXPORT_MAX_COUNT,
  BOM_EXPORT_MIN_COUNT,
} from '@cdba/shared/constants/table';

@Component({
  selector: 'cdba-bom-export-button',
  templateUrl: './bom-export-button.component.html',
  standalone: true,
  imports: [MatButtonModule, MatTooltipModule, SharedTranslocoModule],
})
export class BomExportButtonComponent implements OnInit, OnDestroy {
  @Output()
  bomExportEvent = new EventEmitter<string[]>();

  selectedNodeIds: string[] = [];
  tooltip: string;
  disabled: boolean;

  selectedNodeIds$ = this.store.select(getSelectedRefTypeNodeIds);
  isExportRunning$ = this.store.select(isBomExportFeatureRunning);

  private isExportRunningSubscription: Subscription;
  private selectedNodeIdsSubscription = new Subscription();

  public constructor(
    private readonly store: Store,
    private readonly transloco: TranslocoService
  ) {}

  ngOnInit(): void {
    this.selectedNodeIdsSubscription = this.selectedNodeIds$.subscribe(
      (selectedNodeIds) => (this.selectedNodeIds = selectedNodeIds)
    );

    this.isExportRunningSubscription = this.isExportRunning$.subscribe(
      (isExportRunning) => {
        this.disabled = isExportRunning;
        this.tooltip = isExportRunning
          ? this.transloco.translate('search.bomExport.tooltips.running')
          : this.transloco.translate('search.bomExport.tooltips.default', {
              bomExportMinCount: BOM_EXPORT_MIN_COUNT,
              bomExportMaxCount: BOM_EXPORT_MAX_COUNT,
            });
      }
    );
  }

  ngOnDestroy(): void {
    this.selectedNodeIdsSubscription.unsubscribe();
    this.isExportRunningSubscription.unsubscribe();
  }

  onRequestBomExport(): void {
    this.bomExportEvent.emit(this.selectedNodeIds);
  }

  isDisabled(): boolean {
    return this.selectedNodeIds
      ? this.selectedNodeIds?.length < BOM_EXPORT_MIN_COUNT ||
          this.selectedNodeIds?.length > BOM_EXPORT_MAX_COUNT ||
          this.disabled
      : true;
  }
}
