import { FormControl, FormGroup } from '@angular/forms';

import { LoadCaseData } from '@ea/core/store/models';

interface LoadCaseLoadModel {
  axialLoad: FormControl<LoadCaseData['load']['axialLoad']>;
  radialLoad: FormControl<LoadCaseData['load']['radialLoad']>;
}

interface LoadCaseForceModel {
  fx: FormControl<number>;
  fy: FormControl<number>;
}

interface LoadCaseMomentModel {
  mx: FormControl<number>;
  my: FormControl<number>;
}

interface LoadCaseRotationModel {
  typeOfMotion: FormControl<LoadCaseData['rotation']['typeOfMotion']>;
  rotationalSpeed: FormControl<LoadCaseData['rotation']['rotationalSpeed']>;
  shiftFrequency: FormControl<LoadCaseData['rotation']['shiftFrequency']>;
  shiftAngle: FormControl<LoadCaseData['rotation']['shiftAngle']>;
}

export interface LoadCaseDataFormGroupModel {
  load?: FormGroup<LoadCaseLoadModel>;
  force?: FormGroup<LoadCaseForceModel>;
  moment?: FormGroup<LoadCaseMomentModel>;
  rotation: FormGroup<LoadCaseRotationModel>;
  operatingTemperature?: FormControl<LoadCaseData['operatingTemperature']>;
  operatingTime: FormControl<LoadCaseData['operatingTime']>;
  loadCaseName: FormControl<LoadCaseData['loadCaseName']>;
}
