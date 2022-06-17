import { Property } from '@ga/shared/models';

export const PROPERTIES_MOCK: Property[] = [
  {
    name: 'IDCO_IDENTIFICATION',
    value: '1ea5c8b9-a564-4341-b4df-b0eb54a1f01d',
  },
  { name: 'IDCO_DESIGNATION', value: '6005' },
  { name: 'IDL_CONSTRUCTIONTYPE', value: 'LB_RADIAL_RILLENKUGELLAGER' },
  { name: 'IDL_SERIE', value: 'LB_60' },
  { name: 'IDSU_DA', value: 47 },
  { name: 'IDSU_DI', value: 25 },
  { name: 'IDSU_B', value: 12 },
  { name: 'IDL_RADIAL_INSTALLATION_CODE', value: 'IC_FIXED' },
  { name: 'IDL_AXIAL_POSITIVE_INSTALLATION_CODE', value: 'IC_FIXED' },
  { name: 'IDL_AXIAL_NEGATIVE_INSTALLATION_CODE', value: 'IC_FIXED' },
  { name: 'IDCO_RADIAL_LOAD', value: 0, dimension1: 0 },
  { name: 'IDCO_AXIAL_LOAD', value: 0, dimension1: 0 },
  { name: 'IDL_RELATIVE_SPEED_WITHOUT_SIGN', value: 0, dimension1: 0 },
  { name: 'IDL_AXIAL_LOAD_RELATED_FRICTION', value: 0, dimension1: 0 },
  { name: 'IDL_LOAD_RELATED_FRICTION', value: 0, dimension1: 0 },
  { name: 'IDLC_TYPE_OF_MOVEMENT', value: 'LB_ROTATING' },
  { name: 'IDLC_OSCILLATION_ANGLE', value: 360.000_000_000_000_8 },
  { name: 'IDLC_MOVEMENT_FREQUENCY', value: 0 },
  { name: 'IDSLC_TEMPERATURE', value: 20 },
  { name: 'IDSCO_OILTEMP', value: 70, dimension1: 0 },
  { name: 'IDSCO_INFLUENCE_OF_AMBIENT', value: 'LB_AVERAGE_AMBIENT_INFLUENCE' },
];
