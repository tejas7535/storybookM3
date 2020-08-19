import { Icon } from '@schaeffler/icons';

export interface SpeedDialFabItem {
  key: string;
  icon: Icon;
  color: string;
  label: boolean;
  title?: string;
}
