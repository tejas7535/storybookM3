import { SectorGpsd } from '@gq/shared/models/sector-gpsd.interface';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const SectorGpsdActions = createActionGroup({
  source: 'Sector Gpsd',
  events: {
    'get all sector gpsds': props<{ customerId: string; salesOrg: string }>(),
    'get all sector gpsds success': props<{
      sectorGpsds: SectorGpsd[];
    }>(),
    'get all sector gpsds failure': props<{ errorMessage: string }>(),
    'reset all sector gpsds': emptyProps(),
  },
});
