/**
 * This maps our role names to roles from Azure AD
 */
const RoleMapping = {
  salesUser: ['SD-D360_SALES_DIR', 'SD-D360_SALES_IND'],
  salesManagement: ['SD-D360_SALES_MGMT_DIR', 'SD-D360_SALES_MGMT_IND'],
  demandPlanning: ['SD-D360_DM_DPLANNER'],
  readOnly: ['SD-D360_RO'],
  readOnlyRestricted: ['SD-D360_RO_RESTRICTED'],
  superUser: ['SD-D360_ADMIN'],
  masterPlannerReadOnly: ['SD-D360_RO_MP'],
  supplyChainManagementReadOnly: ['SD-D360_RO_SCM'],
};

export type Role = keyof typeof RoleMapping;

export function checkRoles(
  givenRoles: string[],
  allowedRoles: readonly Role[]
): boolean {
  // use roles without territory information and without business area information
  const givenRolesWithoutTerritory = givenRoles.map(
    (role) => role.split('=')[0]
  );
  const allowedRoleNames = new Set(
    allowedRoles.flatMap((role) => RoleMapping[role])
  );

  return givenRolesWithoutTerritory.some((role) => allowedRoleNames.has(role));
}

export const demandValidationChangeAllowedRoles: Role[] = [
  'salesUser',
  'demandPlanning',
  'superUser',
];

export const apPortfolioAllowedRoles: Role[] = [
  'salesManagement',
  'demandPlanning',
  'readOnly',
  'superUser',
];

export const internalMaterialReplacementAllowedRoles: Role[] = [
  'demandPlanning',
  'superUser',
];

export const workflowManagementAllowedRoles: Role[] = [
  'demandPlanning',
  'superUser',
];

export const salesPlanningAllowedRoles: Role[] = [
  'salesUser',
  'salesManagement',
  'readOnly',
  'readOnlyRestricted',
  'demandPlanning',
  'superUser',
];
