import {
  DoughnutConfig,
  DoughnutSeriesConfig,
} from '../../../shared/charts/models';
import { Color } from '../../../shared/models';

export function createDoughnutConfig(
  internalCount: number,
  externalCount: number,
  name: string
) {
  const labelInternal = 'internal';
  const labelExternal = 'external';

  return internalCount !== undefined && externalCount !== undefined
    ? new DoughnutConfig(name, [
        new DoughnutSeriesConfig(
          [{ value: internalCount }],
          labelInternal,
          Color.LIME
        ),
        new DoughnutSeriesConfig(
          [{ value: externalCount }],
          labelExternal,
          Color.LIGHT_BLUE
        ),
      ])
    : undefined;
}
