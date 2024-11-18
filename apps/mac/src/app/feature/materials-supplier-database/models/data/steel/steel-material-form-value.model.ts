import { Moment } from 'moment';

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
  minRecyclingRate: number;
  maxRecyclingRate: number;

  co2Upstream: number;
  co2Core: number;
  co2ClassificationNew: StringOption;
  co2ClassificationNewSecondary: StringOption;
  co2Standard: StringOption;
  co2Comment: string;
  productCategoryRule: StringOption;
  reportValidUntil: Moment | number;
  dataQualityRating: number;
  primaryDataShare: number;
  co2UploadFile: File;
  co2UploadFileId: number;
  co2UploadFileFilename: string;

  selfCertified: boolean;
}
