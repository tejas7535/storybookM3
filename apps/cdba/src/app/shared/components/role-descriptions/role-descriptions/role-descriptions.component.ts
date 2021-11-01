import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { TranslocoService } from '@ngneat/transloco';

import { RolesGroupAdapter } from '@cdba/core/auth/adapters/roles-group.adapter';
import { RoleFacade } from '@cdba/core/auth/role.facade';
import * as urls from '@cdba/shared/constants/urls';

import { RolesGroup } from '@schaeffler/roles-and-rights';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cdba-role-descriptions',
  templateUrl: './role-descriptions.component.html',
})
export class RoleDescriptionsComponent implements OnInit, OnDestroy {
  @Input() hintText: 'default' | 'missingRoles' = 'default';
  @Input() public showHeading?: boolean = true;

  public urlServiceNow = urls.URL_SERVICE_NOW;
  public urlProductLines = urls.URL_PRODUCT_LINES;
  public urlRoleAssignments = urls.URL_ROLE_ASSIGNMENTS;

  public rolesGroups: RolesGroup[] = [];
  private roleDescriptionsSubscription: Subscription;

  public constructor(
    private readonly roleFacade: RoleFacade,
    private readonly rolesGroupAdapter: RolesGroupAdapter,
    private readonly transloco: TranslocoService
  ) {}

  public ngOnInit(): void {
    this.roleDescriptionsSubscription =
      this.roleFacade.roleDescriptions$.subscribe((roleDescriptions) => {
        if (roleDescriptions && roleDescriptions.productLines) {
          this.rolesGroups.push(
            this.rolesGroupAdapter.adaptFromRoleDescriptions(
              this.transloco.translate('roles.descriptions.productLines'),
              roleDescriptions.productLines
            )
          );
        }
        if (roleDescriptions && roleDescriptions.subRegions) {
          this.rolesGroups.push(
            this.rolesGroupAdapter.adaptFromRoleDescriptions(
              this.transloco.translate('roles.descriptions.subRegions'),
              roleDescriptions.subRegions
            )
          );
        }
      });
  }

  ngOnDestroy(): void {
    if (this.roleDescriptionsSubscription) {
      this.roleDescriptionsSubscription.unsubscribe();
    }
  }
}
