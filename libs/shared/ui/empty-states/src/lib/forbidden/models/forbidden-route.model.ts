import { Route } from '@angular/router';

import { ForbiddenRouteData } from './forbidden-route-data.model';

/**
 * Strongly typed route
 * Extends the default type from ng router
 */
export interface ForbiddenRoute extends Route {
  /**
   * Define route data, extends "route-data" from ng-router
   */
  data?: ForbiddenRouteData;
}
