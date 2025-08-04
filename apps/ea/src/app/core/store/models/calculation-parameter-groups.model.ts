export type CalculationParameterGroup =
  | 'load'
  | 'lubrication'
  | 'contamination'
  | 'operatingTemperature'
  | 'ambientTemperature'
  | 'time'
  | 'energySource'
  | 'rotatingCondition'
  | 'externalHeatflow'
  | 'conditionOfRotation'
  | 'operatingTimeAndTemperature'
  | 'force' // slewing bearing types
  | 'moment'; // slewing bearing types
