import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';

import {
  getRoles,
  hasAnyIdTokenRole,
  hasIdTokenRole,
} from '@schaeffler/azure-auth';

import {
  getHasDescriptiveRoles,
  getRoleDescriptions,
  getRoleDescriptionsLoaded,
} from '@cdba/core/store/selectors/roles/roles.selector';

import { authConfig } from '../config/auth.config';

@Injectable({
  providedIn: 'root',
})
export class RoleFacade {
  roles$ = this.store.pipe(getRoles);
  roleDescriptions$ = this.store.select(getRoleDescriptions);
  roleDescriptionsLoaded$ = this.store.select(getRoleDescriptionsLoaded);
  hasDescriptiveRoles$ = this.store.pipe(getHasDescriptiveRoles);
  hasBasicRole$ = this.store.pipe(hasAnyIdTokenRole(authConfig.basicRoles));
  hasAnyPricingRole$ = this.store.pipe(
    hasAnyIdTokenRole(authConfig.pricingRoles)
  );
  hasBetaUserRole$ = this.store.pipe(hasIdTokenRole(authConfig.betaUserRole));

  constructor(private readonly store: Store) {}
}
