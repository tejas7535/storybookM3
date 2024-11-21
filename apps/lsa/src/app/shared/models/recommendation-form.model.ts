import { FormControl, FormGroup } from '@angular/forms';

import {
  LubricantType,
  LubricationPoints,
  Optime,
  PowerSupply,
} from '../constants';
import { PipeLength } from '../constants/tube-length.enum';
import { Grease } from './grease.model';
import { LSAInterval } from './recommendation-form-value.model';

export interface RecommendationForm {
  lubricationPoints: FormGroup<LubricationPointsForm>;
  lubricant: FormGroup<LubricantForm>;
  application: FormGroup<ApplicationForm>;
}

export interface RecommendationModels {
  lubricationPoints: LubricationPointsForm;
  lubricant: LubricantForm;
  application: ApplicationForm;
}

export interface LubricationPointsForm {
  lubricationPoints: FormControl<LubricationPoints>;
  lubricationInterval: FormControl<string>;
  lubricationQty: FormControl<number>;
  pipeLength: FormControl<PipeLength>;
  optime: FormControl<Optime>;
}

export interface LubricantForm {
  lubricantType: FormControl<LubricantType>;
  grease: FormControl<Grease>;
}

export interface ApplicationForm {
  temperature: FormControl<LSAInterval>;
  battery: FormControl<PowerSupply>;
}
