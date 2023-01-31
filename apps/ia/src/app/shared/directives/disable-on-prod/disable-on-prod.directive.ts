import {
  Directive,
  isDevMode,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[disableOnProd]',
  exportAs: 'disableOnProd',
})
export class DisableOnProdDirective implements OnInit {
  constructor(
    private readonly templateRef: TemplateRef<any>,
    private readonly viewContainer: ViewContainerRef
  ) {}

  ngOnInit(): void {
    if (isDevMode()) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
