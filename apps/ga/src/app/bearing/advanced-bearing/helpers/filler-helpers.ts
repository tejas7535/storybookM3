import {
  ExtendedSearchParameters,
  FillDiameterParams,
} from '../../../shared/models';

export function fillDiameters(
  parameters: ExtendedSearchParameters
): ExtendedSearchParameters {
  const { minDi, maxDi, minDa, maxDa, minB, maxB } = parameters;
  let prefilledDimensions = parameters;

  prefilledDimensions = fillDiameterConditionally({
    parameters: prefilledDimensions,
    key: 'minDi',
    potentiallyEmpty: minDi,
    reference: maxDi,
  });
  prefilledDimensions = fillDiameterConditionally({
    parameters: prefilledDimensions,
    key: 'maxDi',
    potentiallyEmpty: maxDi,
    reference: minDi,
  });

  prefilledDimensions = fillDiameterConditionally({
    parameters: prefilledDimensions,
    key: 'minDa',
    potentiallyEmpty: minDa,
    reference: maxDa,
  });
  prefilledDimensions = fillDiameterConditionally({
    parameters: prefilledDimensions,
    key: 'maxDa',
    potentiallyEmpty: maxDa,
    reference: minDa,
  });

  prefilledDimensions = fillDiameterConditionally({
    parameters: prefilledDimensions,
    key: 'minB',
    potentiallyEmpty: minB,
    reference: maxB,
  });
  prefilledDimensions = fillDiameterConditionally({
    parameters: prefilledDimensions,
    key: 'maxB',
    potentiallyEmpty: maxB,
    reference: minB,
  });

  return prefilledDimensions;
}

export function fillDiameterConditionally({
  parameters,
  key,
  potentiallyEmpty,
  reference,
}: FillDiameterParams): ExtendedSearchParameters {
  let prefilledDimensions = parameters;

  if (
    (potentiallyEmpty === null || potentiallyEmpty === undefined) &&
    reference
  ) {
    prefilledDimensions = {
      ...prefilledDimensions,
      [key]: reference,
    };
  }

  return prefilledDimensions;
}
