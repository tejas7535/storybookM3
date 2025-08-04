import {
  CatalogServiceLoadCaseData,
  CatalogServiceOperatingConditions,
} from '@ea/core/services/catalog.service.interface';
import { DownstreamOperatingConditions } from '@ea/core/services/downstream-calculation.service.interface';
import { Greases } from '@ea/shared/constants/greases';

export interface CalculationParametersState {
  operationConditions: CalculationParametersOperationConditions;
  calculationTypes: CalculationParametersCalculationTypes;
  isInputInvalid: boolean;
}

export interface CalculationParametersEnergySource {
  type: 'fossil' | 'electric';
  fossil?: {
    fossilOrigin: DownstreamOperatingConditions['fossilEmissionFactor'];
  };
  electric?: {
    electricityRegion: DownstreamOperatingConditions['electricEmissionFactor'];
  };
}

export interface CalculationParametersOperationConditions {
  ambientTemperature: number;

  loadCaseData: LoadCaseData[];

  contamination: CatalogServiceOperatingConditions['IDL_CLEANESS_VALUE'];
  energySource: CalculationParametersEnergySource;
  lubrication: {
    lubricationSelection: 'grease' | 'oilBath' | 'oilMist' | 'recirculatingOil';
    grease: {
      selection: 'typeOfGrease' | 'isoVgClass' | 'viscosity';
      typeOfGrease: {
        typeOfGrease: (typeof Greases)[number]['value'];
      };
      isoVgClass: {
        isoVgClass: number;
      };
      viscosity: {
        ny40: number;
        ny100: number;
      };
      environmentalInfluence:
        | 'LB_LOW_AMBIENT_INFLUENCE'
        | 'LB_AVERAGE_AMBIENT_INFLUENCE'
        | 'LB_HIGH_AMBIENT_INFLUENCE';
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
      oilFlow: number;
      oilTemperatureDifference: number;
      externalHeatFlow: number;
    };
  };

  time: number;
  conditionOfRotation: 'innerring' | 'outerring';

  selectedLoadcase: number;
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

export interface LoadCaseData {
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
  operatingTemperature: number;
  operatingTime: number;
  loadCaseName: string;
  force: {
    fx: number;
    fy: number;
  };
  moment: {
    mx: number;
    my: number;
  };
}

export interface CalculationParametersCalculationTypeConfig {
  name: CalculationType;
  selected: boolean;
  disabled: boolean;
  label: string;
  svgIcon?: string;
  icon?: string;
}
