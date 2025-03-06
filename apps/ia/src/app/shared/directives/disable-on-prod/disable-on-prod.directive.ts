import {
  Directive,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

import { isFeatureEnabled } from '../../guards/is-feature-enabled';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[disableOnProd]',
  exportAs: 'disableOnProd',
  standalone: false,
})
export class DisableOnProdDirective implements OnInit {
  constructor(
    private readonly templateRef: TemplateRef<any>,
    private readonly viewContainer: ViewContainerRef
  ) {}

  ngOnInit(): void {
    if (isFeatureEnabled()) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
