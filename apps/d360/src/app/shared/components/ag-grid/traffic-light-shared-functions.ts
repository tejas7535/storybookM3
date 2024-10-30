import { translate } from '@jsverse/transloco';

export const trafficLightValues = ['GREEN', 'YELLOW', 'RED', 'GREY'] as const;

export type TrafficLight = (typeof trafficLightValues)[number];

export function trafficLightValueFormatter(params: any): string {
  return translate(`traffic_light.${params.value as TrafficLight}`, {});
}
