import { StringOption } from '@schaeffler/inputs';

export interface BaseMaterialStandardFormValue {
  id?: number;
  materialName: StringOption;
  standardDocument: StringOption;
}
