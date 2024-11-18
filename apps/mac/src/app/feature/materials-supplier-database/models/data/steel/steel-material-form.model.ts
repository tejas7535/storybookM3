import { FormControl } from '@angular/forms';

import { StringOption } from '@schaeffler/inputs';

import { BaseMaterialForm } from '@mac/msd/models';

export interface SteelMaterialForm extends BaseMaterialForm {
  referenceDoc: FormControl<StringOption[]>;
  releaseDateYear: FormControl<number>;
  releaseDateMonth: FormControl<number>;
  blocked: FormControl<boolean>;
  castingMode: FormControl<string>;
  castingDiameter: FormControl<StringOption>;
  maxDimension: FormControl<number>;
  minDimension: FormControl<number>;
  steelMakingProcess: FormControl<StringOption>;
  rating: FormControl<StringOption>;
  ratingRemark: FormControl<string>;
  ratingChangeComment: FormControl<string>;
  materialNumber: FormControl<string>;
  manufacturer: FormControl<boolean>;
  minRecyclingRate: FormControl<number>;
  maxRecyclingRate: FormControl<number>;

  co2Upstream: FormControl<number>;
  co2Core: FormControl<number>;
  co2ClassificationNew: FormControl<StringOption>;
  co2ClassificationNewSecondary: FormControl<StringOption>;
  co2Standard: FormControl<StringOption>;
  productCategoryRule: FormControl<StringOption>;
  dataQualityRating: FormControl<number>;
  primaryDataShare: FormControl<number>;
  reportValidUntil: FormControl<string | number>;
  co2UploadFile: FormControl<File>;
  co2UploadFileId: FormControl<number>;
  co2UploadFileFilename: FormControl<string>;
  co2Comment: FormControl<string>;

  selfCertified: FormControl<boolean>;
}
