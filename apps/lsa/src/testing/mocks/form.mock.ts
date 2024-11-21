import { FormControl, FormGroup } from '@angular/forms';

import {
  LubricantType,
  LubricationPoints,
  Optime,
  PowerSupply,
  RelubricationInterval,
} from '@lsa/shared/constants';
import { PipeLength } from '@lsa/shared/constants/tube-length.enum';
import {
  ApplicationForm,
  Grease,
  LSAInterval,
  LubricantForm,
  LubricationPointsForm,
  RecommendationForm,
} from '@lsa/shared/models';

export const mockLubricationPointsForm = new FormGroup<LubricationPointsForm>({
  lubricationPoints: new FormControl<LubricationPoints>(
    LubricationPoints.TwoToFour
  ),
  lubricationInterval: new FormControl<RelubricationInterval>(
    RelubricationInterval.Year
  ),
  lubricationQty: new FormControl<number>(60),
  pipeLength: new FormControl<PipeLength>(PipeLength.Direct),
  optime: new FormControl<Optime>(0),
});

export const mockLubricantForm = new FormGroup<LubricantForm>({
  lubricantType: new FormControl<LubricantType>(LubricantType.Arcanol),
  grease: new FormControl<Grease>({
    id: 'ARCANOL_MULTI2',
    title: 'Arcanol MULTI2',
  }),
});

export const mockApplicationForm = new FormGroup<ApplicationForm>({
  temperature: new FormControl<LSAInterval>({ min: 5, max: 15, title: '' }),
  battery: new FormControl<PowerSupply>(undefined),
});

export const recommendationForm = new FormGroup<RecommendationForm>({
  lubricationPoints: mockLubricationPointsForm,
  lubricant: mockLubricantForm,
  application: mockApplicationForm,
});
