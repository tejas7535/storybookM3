import { IotParams } from '../../http/rest.service';
import { Interval } from '../reducers/shared/models';

/**
 * helper funtion for interval actions to reduce complexity above
 */
export function actionInterval(): (
  value: [any, Interval],
  index: number
) => IotParams {
  return ([action, interval]: [any, Interval]) => ({
    id: action.deviceId,
    ...interval,
  });
}
