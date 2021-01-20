import {
  HardnessConversionResponse,
  HardnessConversionResponseWithSide,
  InputSideTypes,
} from '../../app/feature/hardness-converter/services/hardness-converter-response.model';

export const HARDNESS_CONVERSION_MOCK: HardnessConversionResponse = {
  converted: 150,
};

export const hardnessConversionWithSideMock = (
  side: InputSideTypes
): HardnessConversionResponseWithSide => {
  return {
    ...HARDNESS_CONVERSION_MOCK,
    side,
  };
};
