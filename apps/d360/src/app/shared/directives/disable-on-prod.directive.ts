import {
  Directive,
  ElementRef,
  inject,
  OnInit,
  Renderer2,
} from '@angular/core';

import { Environment } from '../../../environments/environment.model';
import { ENV } from '../../../environments/environments.provider';
import { EnvironmentEnum } from '../models/environment-enum';

/**
 * Directive to disable HTML elements in production environment.
 *
 */
@Directive({
  selector: '[d360DisableOnProd]',
})
export class DisableOnProdDirective implements OnInit {
  /**
   * The ElementRef instance.
   *
   * @private
   * @type {ElementRef}
   * @memberof DisableOnProdDirective
   */
  private readonly elementRef: ElementRef = inject(ElementRef);

  /**
   * The Renderer2 instance.
   *
   * @private
   * @type {Renderer2}
   * @memberof DisableOnProdDirective
   */
  private readonly renderer: Renderer2 = inject(Renderer2);

  /**
   * The Environment instance.
   *
   * @private
   * @type {Environment}
   * @memberof DisableOnProdDirective
   */
  private readonly environment: Environment = inject(ENV);

  ngOnInit(): void {
    if (
      this.environment.production ||
      this.environment.environment === EnvironmentEnum.prod
    ) {
      this.renderer.setStyle(this.elementRef.nativeElement, 'display', 'none');
    }
  }
}
