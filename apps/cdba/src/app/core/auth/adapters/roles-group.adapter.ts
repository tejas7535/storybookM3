import { Injectable } from '@angular/core';

import { Role, RolesGroup } from '@schaeffler/roles-and-rights';

import { RoleDescription } from '../models/roles.models';

@Injectable({
  providedIn: 'root',
})
export class RolesGroupAdapter {
  public title: string;
  public roles: Role[];

  public adaptFromRoleDescriptions(
    title: string,
    roleDescriptions: RoleDescription[]
  ): RolesGroup {
    return {
      title: title || '',
      roles: roleDescriptions
        ? roleDescriptions.map((roleDescription) => ({
            title: roleDescription.id,
            rights: roleDescription.description,
          }))
        : [],
    };
  }
}
