import { getEnv } from '../../../environments/environments.provider';
import { EnvironmentEnum } from '../models';

export const isFeatureEnabled = () =>
  getEnv().environment !== EnvironmentEnum.prod;
