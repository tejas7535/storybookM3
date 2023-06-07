import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[optionTemplate]',
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {},
  standalone: true,
})
export class OptionTemplateDirective {
  @Input('optionTemplate') name: string | undefined;
  @Input() label: string | undefined;

  constructor(public template: TemplateRef<any>) {}
}
