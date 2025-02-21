import { UserSetting } from './user-setting.interface';

export interface UserSettingsResponse {
  result: {
    userId: string;
    userSettingsList: UserSetting[];
  };
}
