import { UNSUPPORTED_BEARINGS_DREHVERBINDUNGEN } from './unsupported-bearings-drehverbindungen';
import { UNSUPPORTED_BEARINGS_GELENKLAGER } from './unsupported-bearings-gelenklager';
import { UNSUPPORTED_BEARINGS_VERBUNDGLEITLAGER } from './unsupported-bearings-verbundgleitlager';

/** List with unsupported bearings */
export const UNSUPPORTED_BEARINGS = [
  ...UNSUPPORTED_BEARINGS_DREHVERBINDUNGEN,
  ...UNSUPPORTED_BEARINGS_VERBUNDGLEITLAGER,
  ...UNSUPPORTED_BEARINGS_GELENKLAGER,
];
