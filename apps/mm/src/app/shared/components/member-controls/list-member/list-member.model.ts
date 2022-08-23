import { BearinxListValue } from '@caeonline/dynamic-forms';

import { StringOption } from '@schaeffler/inputs';

export type ListMember = StringOption &
  BearinxListValue & {
    value: string;
    caption: string;
    imageUrl: string;
  };
