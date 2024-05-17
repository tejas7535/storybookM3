import { BannerType } from '@schaeffler/banner';

export interface ISystemMessage {
  id: number;
  message: string;
  type: BannerType;
}
