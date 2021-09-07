import { ValidationDescription } from './validation-description.enum';

export class MaterialTableItem {
  materialDescription?: string;
  materialNumber?: string;
  quantity?: number;
  info?: {
    valid: boolean;
    description: ValidationDescription[];
  };
}
