import {
  HardnessConversionResponse,
  HardnessConversionResponseWithSide,
  inputSideTypes,
} from '../../app/feature/hardness-converter/services/hardness-converter-response.model';

export const HARDNESS_CONVERSION_MOCK: HardnessConversionResponse = {
  converted: 150,
};

export const hardnessConversionWithSideMock = (
  side: inputSideTypes
): HardnessConversionResponseWithSide => {
  return {
    ...HARDNESS_CONVERSION_MOCK,
    side,
  };
};
