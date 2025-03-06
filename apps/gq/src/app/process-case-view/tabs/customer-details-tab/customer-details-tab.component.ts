import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { Observable } from 'rxjs';

import { ActiveCaseFacade } from '@gq/core/store/active-case/active-case.facade';
import { RolesFacade } from '@gq/core/store/facades';
import { Customer } from '@gq/shared/models/customer';
import { getCurrentYear, getLastYear } from '@gq/shared/utils/misc.utils';

@Component({
  selector: 'gq-customer-details-tab',
  templateUrl: './customer-details-tab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class CustomerDetailsTabComponent {
  private readonly rolesFacade: RolesFacade = inject(RolesFacade);
  private readonly activeCaseFacade: ActiveCaseFacade =
    inject(ActiveCaseFacade);

  currentYear: number = getCurrentYear();
  lastYear: number = getLastYear();
  customer$: Observable<Customer> = this.activeCaseFacade.quotationCustomer$;
  userHasAccessToPricingDetails$ =
    this.rolesFacade.userHasRegionWorldOrGreaterChinaRole$;
}
