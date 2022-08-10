import { Route } from '@angular/router';

import { AvailabilityData } from './availability-data.model';

export interface MACRoute extends Route {
  data?: {
    requiredRoles?: string[];
    availabilityCheck?: AvailabilityData;
  };
}

export type MACRoutes = MACRoute[];
