import { Interval } from '../reducers/shared/models';

/**
 * helper funtion for interval actions to reduce complexity above
 */
export function actionInterval(): (
  value: [any, Interval],
  index: number
) => any {
  return ([action, interval]: [any, Interval]) => ({
    id: action.deviceId,
    start: interval.startDate,
    end: interval.endDate,
  });
}
