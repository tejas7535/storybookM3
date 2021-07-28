import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { getRoles, hasAnyIdTokenRole } from '@schaeffler/azure-auth';

import { authConfig } from './auth.config';

@Injectable({
  providedIn: 'root',
})
export class RoleFacade {
  roles$ = this.store.select(getRoles);
  hasBasicRole$ = this.store.select(hasAnyIdTokenRole(authConfig.basicRoles));
  hasAnyPricingRole$ = this.store.select(
    hasAnyIdTokenRole(authConfig.pricingRoles)
  );

  constructor(private readonly store: Store) {}
}
