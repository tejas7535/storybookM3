import { ObjectProperty } from '@caeonline/dynamic-forms';

export interface BxApiObjectModel {
  type: string;
  properties: ObjectProperty[];

  children: BxApiObjectModel[];

  subTypes?: string[];
  childList?: string;
}

export interface BxApiModel {
  rootObject: BxApiObjectModel;
}
