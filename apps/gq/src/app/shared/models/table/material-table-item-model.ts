import { ValidationDescription } from './validation-description.enum';

export class MaterialTableItem {
  id?: number;
  materialDescription?: string;
  materialNumber?: string;
  quantity?: number;
  info?: {
    valid: boolean;
    description: ValidationDescription[];
  };
}
