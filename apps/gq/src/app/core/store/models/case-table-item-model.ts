import { ValidationDescription } from './validation-description.enum';

export class CaseTableItem {
  materialNumber?: string;
  quantity?: number | string;
  info?: {
    valid: boolean;
    description: ValidationDescription[];
  };
}
