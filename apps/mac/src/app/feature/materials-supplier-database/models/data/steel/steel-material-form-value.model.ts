import { StringOption } from '@schaeffler/inputs';

import { BaseMaterialFormValue } from '@mac/msd/models';

export interface SteelMaterialFormValue extends BaseMaterialFormValue {
  referenceDoc: StringOption[];
  releaseDateYear: number;
  releaseDateMonth: number;
  blocked: boolean;
  castingMode: string;
  castingDiameter: StringOption;
  maxDimension: number;
  minDimension: number;
  steelMakingProcess: StringOption;
  rating: StringOption;
  ratingRemark: string;
  ratingChangeComment: string;
  materialNumber: string;
  manufacturer: boolean;

  selfCertified: boolean;
}
