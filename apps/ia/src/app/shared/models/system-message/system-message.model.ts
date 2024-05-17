import { BannerType } from '@schaeffler/banner';

import { ISystemMessage } from './i-system-message.model';

export class SystemMessage implements ISystemMessage {
  public constructor(
    public id: number,
    public message: string,
    public type: BannerType
  ) {}
}
