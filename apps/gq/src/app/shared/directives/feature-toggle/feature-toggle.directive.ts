import {
  Directive,
  Input,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

import { FeatureToggleConfigService } from '../../services/feature-toggle/feature-toggle-config.service';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[featureToggle]',
  exportAs: 'featureToggle',
})
export class FeatureToggleDirective implements OnInit {
  @Input() featureToggle: string;
  constructor(
    private readonly configService: FeatureToggleConfigService,
    private readonly templateRef: TemplateRef<any>,
    private readonly viewContainer: ViewContainerRef
  ) {}

  ngOnInit(): void {
    if (this.configService.isEnabled(this.featureToggle)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
