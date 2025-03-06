import { Directive, HostBinding, Input } from '@angular/core';

/* eslint-disable @angular-eslint/directive-selector */
@Directive({
  selector: 'img[default]',
  host: {
    '(load)': 'load()',
    '(error)': 'setFallback()',
    '[src]': 'src',
  },
})
export class ImageFallbackDirective {
  @Input() default: string;
  @Input() src: string;

  @HostBinding('class') className: string;

  setFallback() {
    this.src = this.default;
  }

  load() {
    this.className = 'image-loaded';
  }
}
