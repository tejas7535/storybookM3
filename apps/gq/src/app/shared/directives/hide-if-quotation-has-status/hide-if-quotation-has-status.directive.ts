import {
  Directive,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

import { distinctUntilChanged, Subject, takeUntil } from 'rxjs';

import { getQuotationStatus } from '@gq/core/store/active-case/active-case.selectors';
import { Store } from '@ngrx/store';

import { QuotationStatus } from '../../models';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[hideIfQuotationHasStatus]',
  exportAs: 'hideIfQuotationHasStatus',
})
export class HideIfQuotationHasStatusDirective implements OnInit, OnDestroy {
  @Input() hideIfQuotationHasStatus: QuotationStatus[];

  unsubscribe$ = new Subject();

  constructor(
    private readonly templateRef: TemplateRef<any>,
    private readonly viewContainer: ViewContainerRef,
    private readonly store: Store
  ) {}

  ngOnInit(): void {
    this.store
      .select(getQuotationStatus)
      .pipe(takeUntil(this.unsubscribe$), distinctUntilChanged())
      .subscribe((status: QuotationStatus) => {
        if (this.hideIfQuotationHasStatus.includes(status)) {
          this.viewContainer.clear();
        } else {
          this.viewContainer.createEmbeddedView(this.templateRef);
        }
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(true);
    this.unsubscribe$.unsubscribe();
  }
}
