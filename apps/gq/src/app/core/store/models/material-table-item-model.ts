import { ValidationDescription } from './validation-description.enum';

export class MaterialTableItem {
  materialNumber?: string;
  quantity?: number;
  info?: {
    valid: boolean;
    description: ValidationDescription[];
  };
}
