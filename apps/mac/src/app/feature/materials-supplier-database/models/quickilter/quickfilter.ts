import { MaterialClass, NavigationLevel } from '../../constants';

export interface QuickFilter {
  id?: number;
  materialClass?: MaterialClass;
  navigationLevel?: NavigationLevel;
  title: string;
  description?: string;
  filter: {
    [key: string]: any;
  };
  columns: string[];
  maintainerId?: string;
  maintainerName?: string;
  timestamp?: number;
  notificationEnabled?: boolean;
  type?: string;
}

export type NewQuickFilterRequest = Required<
  Pick<
    QuickFilter,
    | 'materialClass'
    | 'navigationLevel'
    | 'title'
    | 'description'
    | 'filter'
    | 'columns'
  >
>;

export enum QuickFilterType {
  LOCAL_FROM_CURRENT_VIEW,
  LOCAL_FROM_STANDARD,
  PUBLIC,
}
