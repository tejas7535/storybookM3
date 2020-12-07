import { ValidationDescription } from './validation-description.enum';

export class MaterialTableItem {
  materialNumber?: string;
  quantity?: number | string;
  info?: {
    valid: boolean;
    description: ValidationDescription[];
  };
}
