import { TemplateRef } from '@angular/core';

export interface Step {
  label: string;
  editable?: boolean;
  formGroupName: string;
  content: TemplateRef<any>;
}
