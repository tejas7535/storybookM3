import { LubricantType, Medium } from '@lsa/shared/constants';
import {
  RecommendationFormValue,
  RecommendationRequest,
} from '@lsa/shared/models';

export const transformFormValue = (
  formValue: RecommendationFormValue
): RecommendationRequest => ({
  lubricationPoints: formValue.lubricationPoints.lubricationPoints,
  lubricationInterval: formValue.lubricationPoints.lubricationInterval,
  lubricationQty: formValue.lubricationPoints.lubricationQty,
  pipeLength: formValue.lubricationPoints.pipeLength?.max,
  optime: formValue.lubricationPoints.optime,
  medium:
    formValue.lubricant.lubricantType === LubricantType.Oil
      ? Medium.Oil
      : Medium.Grease,
  greaseId:
    formValue.lubricant.lubricantType === LubricantType.Arcanol
      ? formValue.lubricant.grease.id
      : undefined,
  minTemp: formValue.application.temperature.min,
  maxTemp: formValue.application.temperature.max,
  battery: formValue.application.battery,
});
