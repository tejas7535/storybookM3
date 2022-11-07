import { Role } from './role.model';

/**
 * Strongly typed route
 * Extends the default type from ng router
 */
export interface RolesGroup {
  /**
   * Define title for roles group
   */
  title: string;
  /**
   * Insert a list of roles
   */
  roles: Role[];
  /**
   * Show only roles without rights
   */
  showOnlyRoles?: boolean;
}
