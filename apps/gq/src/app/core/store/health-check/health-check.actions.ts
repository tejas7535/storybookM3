import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const HealthCheckActions = createActionGroup({
  source: 'Health Check',
  events: {
    'Ping Health Check': emptyProps(),
    'Ping Health Check Success': emptyProps(),
    'Ping Health Check Failure': props<{ error: Error }>(),
  },
});
