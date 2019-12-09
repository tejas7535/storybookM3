import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[schaefflerDynamicComponent]'
})
export class DynamicComponentDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
