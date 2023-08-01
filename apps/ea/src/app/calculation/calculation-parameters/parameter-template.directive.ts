import { Directive, Input, TemplateRef } from '@angular/core';

import { CalculationParameterGroup } from '@ea/core/store/models';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[parameterTemplate]',
  standalone: true,
})
export class ParameterTemplateDirective {
  @Input('parameterTemplate') name:
    | CalculationParameterGroup
    | CalculationParameterGroup[]
    | undefined;

  constructor(public template: TemplateRef<any>) {}
}
