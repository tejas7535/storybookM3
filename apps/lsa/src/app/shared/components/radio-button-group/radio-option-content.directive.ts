import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[radioOptionContent]',
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {},
  standalone: true,
})
export class RadioOptionContentDirective {
  @Input('radioOptionContent') name: string | undefined;

  constructor(public template: TemplateRef<any>) {}
}
