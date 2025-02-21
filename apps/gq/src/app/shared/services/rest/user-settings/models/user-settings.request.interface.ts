import { UserSetting } from './user-setting.interface';

export interface UserSettingsRequest {
  userId: string;
  userSettingsList: UserSetting[];
}
