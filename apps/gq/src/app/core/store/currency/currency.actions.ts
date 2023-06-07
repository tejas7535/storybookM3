import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const CurrencyActions = createActionGroup({
  source: 'Currency',
  events: {
    'Load available currencies': emptyProps(),
    'Load available currencies success': props<{ currencies: string[] }>(),
    'Load available currencies failure': props<{ error: Error }>(),
  },
});
