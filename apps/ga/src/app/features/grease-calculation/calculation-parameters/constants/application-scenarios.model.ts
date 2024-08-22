import { DropdownOption } from '@ga/shared/models';

export enum ApplicationScenario {
  All = 'All',
  BallScrewDrive = 'BallScrewDrive',
  CleanRoomApplications = 'CleanRoomApplications',
  ConveyorBelts = 'ConveyorBelts',
  SmallElectricMotors = 'SmallElectricMotors',
  LargeElectricMotors = 'LargeElectricMotors',
  HighSpeedElectricMotors = 'HighSpeedElectricMotors',
  Fans = 'Fans',
  // GreasedGears = 'GreasedGears', -- Currently recommended grease not supported yet
  JawCrushers = 'JawCrushers',
  Pumps = 'Pumps',
  VibratingScreens = 'VibratingScreens',
  RailWheelsetBearings = 'RailWheelsetBearings',
  WindTurbineMainShaft = 'WindTurbineMainShaft',
}

// Important: Make sure the "ALL" option remains in the first spot
export const APPLICATION_SCENARIO_OPTIONS: DropdownOption[] = [
  { id: ApplicationScenario.All, text: 'parameters.applications.All' },
  {
    id: ApplicationScenario.BallScrewDrive,
    text: 'parameters.applications.BallScrewDrive',
  },
  {
    id: ApplicationScenario.CleanRoomApplications,
    text: 'parameters.applications.CleanRoomApplications',
  },
  {
    id: ApplicationScenario.ConveyorBelts,
    text: 'parameters.applications.ConveyorBelts',
  },
  {
    id: ApplicationScenario.SmallElectricMotors,
    text: 'parameters.applications.SmallElectricMotors',
  },
  {
    id: ApplicationScenario.LargeElectricMotors,
    text: 'parameters.applications.LargeElectricMotors',
  },
  {
    id: ApplicationScenario.HighSpeedElectricMotors,
    text: 'parameters.applications.HighSpeedElectricMotors',
  },
  { id: ApplicationScenario.Fans, text: 'parameters.applications.Fans' },
  /*
  {
    id: ApplicationScenario.GreasedGears,
    text: 'parameters.applications.GreasedGears',
  },*/
  {
    id: ApplicationScenario.JawCrushers,
    text: 'parameters.applications.JawCrushers',
  },
  { id: ApplicationScenario.Pumps, text: 'parameters.applications.Pumps' },
  {
    id: ApplicationScenario.VibratingScreens,
    text: 'parameters.applications.VibratingScreens',
  },
  {
    id: ApplicationScenario.RailWheelsetBearings,
    text: 'parameters.applications.RailWheelsetBearings',
  },
  {
    id: ApplicationScenario.WindTurbineMainShaft,
    text: 'parameters.applications.WindTurbineMainShaft',
  },
];
