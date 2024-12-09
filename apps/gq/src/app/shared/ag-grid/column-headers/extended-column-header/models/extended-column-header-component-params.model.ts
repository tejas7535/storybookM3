import { UserRoles } from '@gq/shared/constants';
import { IHeaderParams } from 'ag-grid-community';

export type ExtendedColumnHeaderComponentParams = IHeaderParams & {
  tooltipText: string;
  editableColumn: boolean;
  editingRole?: UserRoles;
  regionalRestrictions?: RegionalRestrictionRoles;
  isPercentageInputValue?: boolean;
};

export interface RegionalRestrictionRoles {
  regionRole: UserRoles;
  editingRoles: UserRoles[];
}
