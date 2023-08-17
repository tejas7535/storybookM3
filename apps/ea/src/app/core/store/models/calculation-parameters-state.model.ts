import {
  CatalogServiceLoadCaseData,
  CatalogServiceOperatingConditions,
} from '@ea/core/services/catalog.service.interface';
import { Greases } from '@ea/shared/constants/greases';

export interface CalculationParametersState {
  operationConditions: CalculationParametersOperationConditions;
  calculationTypes: CalculationParametersCalculationTypes;
  isInputInvalid: boolean;
}

export interface CalculationParametersOperationConditions {
  operatingTemperature: number;
  ambientTemperature: number;

  load: {
    axialLoad: number;
    radialLoad: number;
  };
  rotation: {
    typeOfMotion: CatalogServiceLoadCaseData['IDSLC_TYPE_OF_MOVEMENT'];
    rotationalSpeed: number;
    shiftFrequency: number;
    shiftAngle: number;
  };

  contamination: CatalogServiceOperatingConditions['IDL_CLEANESS_VALUE'];

  lubrication: {
    lubricationSelection: 'grease' | 'oilBath' | 'oilMist' | 'recirculatingOil';
    grease: {
      selection: 'typeOfGrease' | 'isoVgClass' | 'viscosity';
      typeOfGrease: {
        typeOfGrease: typeof Greases[number]['value'];
      };
      isoVgClass: {
        isoVgClass: number;
      };
      viscosity: {
        ny40: number;
        ny100: number;
      };
    };
    oilBath: {
      selection: 'isoVgClass' | 'viscosity';
      isoVgClass: {
        isoVgClass: number;
      };
      viscosity: {
        ny40: number;
        ny100: number;
      };
    };
    oilMist: {
      selection: 'isoVgClass' | 'viscosity';
      isoVgClass: {
        isoVgClass: number;
      };
      viscosity: {
        ny40: number;
        ny100: number;
      };
    };
    recirculatingOil: {
      selection: 'isoVgClass' | 'viscosity';
      isoVgClass: {
        isoVgClass: number;
      };
      viscosity: {
        ny40: number;
        ny100: number;
      };
    };
  };

  externalHeatFlow: number;

  conditionOfRotation: 'innerring' | 'outerring';
}

export type CalculationType =
  | 'frictionalPowerloss'
  | 'ratingLife'
  | 'lubrication'
  | 'emission'
  | 'overrollingFrequency';

export type CalculationParametersCalculationTypes = Record<
  CalculationType,
  { selected: boolean; visible: boolean; disabled: boolean }
>;

export interface CalculationParametersCalculationTypeConfig {
  name: CalculationType;
  selected: boolean;
  disabled: boolean;
  label: string;
  svgIcon?: string;
  icon?: string;
}
