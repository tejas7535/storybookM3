import { Injectable } from '@angular/core';

import {
  getHasDescriptiveRoles,
  getRoleDescriptions,
  getRoleDescriptionsLoaded,
} from '@cdba/core/store/selectors/roles/roles.selector';
import { Store } from '@ngrx/store';

import {
  getIsLoggedIn,
  getRoles,
  hasAnyIdTokenRole,
} from '@schaeffler/azure-auth';

import { authConfig } from './auth.config';

@Injectable({
  providedIn: 'root',
})
export class RoleFacade {
  isLoggedIn$ = this.store.select(getIsLoggedIn);
  roles$ = this.store.select(getRoles);
  roleDescriptions$ = this.store.select(getRoleDescriptions);
  roleDescriptionsLoaded$ = this.store.select(getRoleDescriptionsLoaded);
  hasDescriptiveRoles$ = this.store.select(getHasDescriptiveRoles);
  hasBasicRole$ = this.store.select(hasAnyIdTokenRole(authConfig.basicRoles));
  hasAnyPricingRole$ = this.store.select(
    hasAnyIdTokenRole(authConfig.pricingRoles)
  );

  constructor(private readonly store: Store) {}
}
