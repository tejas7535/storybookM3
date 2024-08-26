import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import { TranslocoService } from '@jsverse/transloco';

import { RolesGroup } from '@schaeffler/roles-and-rights';

import { RolesGroupAdapter } from '@cdba/core/auth/adapters/roles-group.adapter';
import { CostRoles } from '@cdba/core/auth/auth.config';
import { RoleDescriptions } from '@cdba/core/auth/models/roles.models';
import { RoleFacade } from '@cdba/core/auth/role.facade';
import * as urls from '@cdba/shared/constants/urls';

@Component({
  selector: 'cdba-role-descriptions',
  templateUrl: './role-descriptions.component.html',
})
export class RoleDescriptionsComponent implements OnInit, OnDestroy {
  @Input() hintText: 'default' | 'missingRoles' = 'default';
  @Input() public showHeading?: boolean = true;

  public urlServiceNow = urls.URL_SERVICE_NOW;
  public urlRoleAssignments = urls.URL_ROLE_ASSIGNMENTS;

  public rolesGroups: RolesGroup[] = [];
  private roleDescriptionsSubscription: Subscription;
  private rolesSubscription: Subscription;

  public constructor(
    private readonly roleFacade: RoleFacade,
    private readonly rolesGroupAdapter: RolesGroupAdapter,
    private readonly transloco: TranslocoService
  ) {}

  public ngOnInit(): void {
    this.roleDescriptionsSubscription =
      this.roleFacade.roleDescriptions$.subscribe((roleDescriptions) =>
        this.assignDescriptiveRoles(roleDescriptions)
      );

    this.rolesSubscription = this.roleFacade.roles$.subscribe((roles) =>
      this.assignCostRoles(roles)
    );
  }

  public ngOnDestroy(): void {
    if (this.roleDescriptionsSubscription) {
      this.roleDescriptionsSubscription.unsubscribe();
    }

    if (this.rolesSubscription) {
      this.roleDescriptionsSubscription.unsubscribe();
    }
  }

  private assignDescriptiveRoles(roleDescriptions: RoleDescriptions): void {
    if (roleDescriptions && roleDescriptions.subRegions) {
      this.rolesGroups = [
        this.rolesGroupAdapter.adaptFromRoleDescriptions(
          this.transloco.translate('roles.descriptions.subRegions'),
          roleDescriptions.subRegions
        ),
        ...this.rolesGroups,
      ];
    }
    if (roleDescriptions && roleDescriptions.productLines) {
      this.rolesGroups = [
        this.rolesGroupAdapter.adaptFromRoleDescriptions(
          this.transloco.translate('roles.descriptions.productLines'),
          roleDescriptions.productLines
        ),
        ...this.rolesGroups,
      ];
    }
  }

  private assignCostRoles(roles: string[]): void {
    // wait for needed translations to be loaded
    this.transloco
      .selectTranslate('roles.costs.gpc')
      .pipe(take(1))
      .subscribe(() => {
        const gpcTitle = this.transloco.translate('roles.costs.gpc');
        const sqvTitle = this.transloco.translate('roles.costs.sqv');
        const hasCostRoleGpc = roles.includes(CostRoles.Gpc);
        const hasCostRoleSqv = roles.includes(CostRoles.Sqv);

        const costRolesGroup: RolesGroup = {
          title: this.transloco.translate('roles.costs.title'),
          roles: [
            {
              title: gpcTitle,
              rights: this.transloco.translate(
                `roles.costs.rights.${
                  hasCostRoleGpc ? 'available' : 'missing'
                }`,
                { costRoleType: gpcTitle }
              ),
              rightsMissing: !hasCostRoleGpc,
            },
            {
              title: sqvTitle,
              rights: this.transloco.translate(
                `roles.costs.rights.${
                  hasCostRoleSqv ? 'available' : 'missing'
                }`,
                { costRoleType: sqvTitle }
              ),
              rightsMissing: !hasCostRoleSqv,
            },
          ],
        };

        // don't add another Cost RoleGroup when it already exists
        const index = this.rolesGroups.findIndex(
          (rolesGroup) => rolesGroup.title === costRolesGroup.title
        );
        if (index > -1) {
          this.rolesGroups[index] = costRolesGroup;
        } else {
          this.rolesGroups = [...this.rolesGroups, costRolesGroup];
        }
      });
  }
}
