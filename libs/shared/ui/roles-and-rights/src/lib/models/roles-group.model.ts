import { Role } from './role.model';

/**
 * Strongly typed route
 * Extends the default type from ng router
 */
export interface RolesGroup {
  /**
   * Define title for roles group
   * Use a translation key or clear text
   */
  title?: string;
  /**
   * Insert a list of roles
   */
  roles?: Role[];
}
