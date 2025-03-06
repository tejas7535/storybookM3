import {
  DestroyRef,
  Directive,
  inject,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { combineLatest, distinctUntilChanged } from 'rxjs';

import {
  getQuotationSapSyncStatus,
  getQuotationStatus,
} from '@gq/core/store/active-case/active-case.selectors';
import { Store } from '@ngrx/store';

import { QuotationStatus, SAP_SYNC_STATUS } from '../../models';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[hideIfQuotationNotActiveOrPending]',
  exportAs: 'hideIfQuotationNotActiveOrPending',
  standalone: false,
})
export class HideIfQuotationNotActiveOrPendingDirective implements OnInit {
  private readonly templateRef: TemplateRef<any> = inject(TemplateRef);
  private readonly viewContainer: ViewContainerRef = inject(ViewContainerRef);
  private readonly store: Store = inject(Store);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  ngOnInit(): void {
    combineLatest([
      this.store.select(getQuotationStatus),
      this.store.select(getQuotationSapSyncStatus),
    ])
      .pipe(takeUntilDestroyed(this.destroyRef), distinctUntilChanged())
      .subscribe(([status, syncStatus]: [QuotationStatus, SAP_SYNC_STATUS]) => {
        if (
          QuotationStatus.ACTIVE === status &&
          syncStatus !== SAP_SYNC_STATUS.SYNC_PENDING
        ) {
          this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
          this.viewContainer.clear();
        }
      });
  }
}
