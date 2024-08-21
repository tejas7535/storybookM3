import { ApplicationScenario } from '../../calculation-parameters/constants/application-scenarios.model';

export type RecommendationMappingType<T extends { [key: string]: string }> = {
  [K in T[keyof T]]: (
    | string
    | {
        greaseName: string;
        minRequiredTemperature: number;
      }
  )[];
};

export const RecommendationMappings: RecommendationMappingType<
  typeof ApplicationScenario
> = {
  All: [],
  BallScrewDrive: ['Arcanol LOAD150'],
  CleanRoomApplications: ['Arcanol Clean M'],
  ConveyorBelts: ['Arcanol MULTITOP'],
  SmallElectricMotors: ['Arcanol MULTI2'],
  LargeElectricMotors: ['Arcanol MULTITOP'],
  HighSpeedElectricMotors: ['Arcanol SPEED 2,6'],
  Fans: ['Arcanol TEMP90'],
  // GreasedGears: ['Arcanol SEMIFLUID'], --- Recommended Grease not supported yet
  JawCrushers: ['Arcanol LOAD1000'],
  Pumps: ['Arcanol MULTITOP'],
  VibratingScreens: ['Arcanol MOTION 2'],
  RailWheelsetBearings: ['Arcanol LOAD220'],
  WindTurbineMainShaft: ['Arcanol LOAD400'],
};

export const OscillatingMotionRecommendation = [
  'Arcanol MOTION 2',
  'Arcanol VIB2',
];
