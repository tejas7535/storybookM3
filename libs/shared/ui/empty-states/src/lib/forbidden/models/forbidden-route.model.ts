import { Route } from '@angular/router';

import { ForbiddenRouteData } from './forbidden-route-data.model';

/**
 * Strongly typed route
 * Extends the default type from ng router
 */
export interface ForbiddenRoute extends Route {
  /**
   * Define action for secondary button
   */
  data?: ForbiddenRouteData;
}
