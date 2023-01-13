import { PropertyChange } from './property-change';

export interface ChangeHistoryItem {
  modifiedBy: string;
  timestamp: Date;
  changes: PropertyChange[];
}
