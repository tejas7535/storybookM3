import {
  Directive,
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
  selector: '[hideIfQuotationNotActive]',
  exportAs: 'hideIfQuotationNotActive',
})
export class HideIfQuotationNotActiveDirective implements OnInit, OnDestroy {
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
        if (QuotationStatus.ACTIVE === status) {
          this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
          this.viewContainer.clear();
        }
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(true);
    this.unsubscribe$.unsubscribe();
  }
}
