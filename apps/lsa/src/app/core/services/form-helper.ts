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
  pipeLength: Number(formValue.lubricationPoints.pipeLength),
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

export const objectCompare = <T extends object>(a: T, b: T): boolean => {
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) {
    return false;
  }

  return Object.entries(a).every(([kA, valA]) => {
    if (!Object.hasOwn(b, kA)) {
      return false;
    }

    const valB = b[kA as keyof typeof b];

    // eslint-disable-next-line unicorn/prefer-ternary
    if (
      typeof valA === 'object' &&
      typeof valB === 'object' &&
      valA !== null &&
      valB !== null
    ) {
      return objectCompare(valA, valB);
    } else {
      return valA === valB;
    }
  });
};
