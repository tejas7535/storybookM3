export type AuthRoles = string[];

export interface AuthConfig {
  basicRoles: AuthRoles;
  pricingRoles: AuthRoles;
  betaUserRole: string;
}
