import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[optionTemplate]',
  host: {},
})
export class OptionTemplateDirective {
  @Input('optionTemplate') name: string | undefined;
  @Input() label: string | undefined;
  @Input() className?: string | string[] | Record<string, boolean>;
  @Input() disabled?: boolean;
  @Input() tooltip?: string;

  constructor(public template: TemplateRef<any>) {}
}
