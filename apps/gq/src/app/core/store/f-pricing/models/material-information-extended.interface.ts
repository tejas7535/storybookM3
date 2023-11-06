import { MaterialInformation } from '@gq/shared/models/f-pricing/material-information.interface';

import { PropertyDelta } from './property-delta.interface';

export interface MaterialInformationExtended extends MaterialInformation {
  countOfDelta: number;
  deltaValues: PropertyDelta[];
}
