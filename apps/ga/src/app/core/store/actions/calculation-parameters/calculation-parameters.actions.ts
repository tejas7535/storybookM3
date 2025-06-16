import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { CalculationParametersState } from '@ga/core/store/models';
import {
  DialogResponse,
  PreferredGreaseOption,
  Property,
} from '@ga/shared/models';
import { Grease } from '@ga/shared/services/greases/greases.service';

export const CalculationParametersActions = createActionGroup({
  source: 'Calculation Parameters',
  events: {
    'Patch Parameters': props<{ parameters: CalculationParametersState }>(),
    'Model Update Success': emptyProps(),

    'Get Properties': emptyProps(),
    'Get Properties Success': props<{ properties: Property[] }>(),
    'Get Properties Failure': emptyProps(),

    'Get Dialog': emptyProps(),
    'Get Dialog Success': props<{ dialogResponse: DialogResponse }>(),
    'Get Dialog End': emptyProps(),
    'Get Dialog Failure': emptyProps(),

    'Set Preferred Grease Selection': props<{
      selectedGrease: PreferredGreaseOption;
    }>(),
    'Reset Preferred Grease Selection': emptyProps(),

    'Set Automatic Lubrication': props<{ automaticLubrication: boolean }>(),

    'Load Competitors Greases': emptyProps(),
    'Load Competitors Greases Success': props<{ greases: Grease[] }>(),
    'Load Competitors Greases Failure': emptyProps(),

    'Load Schaeffler Greases': emptyProps(),
    'Load Schaeffler Greases Success': props<{ greases: Grease[] }>(),
    'Load Schaeffler Greases Failure': emptyProps(),
  },
});
