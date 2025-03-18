import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  OnChanges,
  Renderer2,
  SimpleChanges,
} from '@angular/core';
import { toHex } from './color-helpers';

@Directive({
  selector: '[colorBorder]',
})
export class BorderColorDirective implements AfterViewInit, OnChanges {
  @Input() isDarkModeEnabled: boolean = true;

  constructor(
    private readonly el: ElementRef,
    private readonly renderer: Renderer2
  ) {}

  ngAfterViewInit() {
    this.updateBorderColor();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.isDarkModeEnabled) {
      this.updateBorderColor();
    }
  }

  private updateBorderColor() {
    const element = this.el.nativeElement;
    const borderColor = (
      window.getComputedStyle(element) as CSSStyleDeclaration
    ).getPropertyValue('border-color');

    const roleClass = element.classList[0];
    const hexColor = toHex(borderColor);

    this.renderer.setProperty(
      element,
      'innerHTML',
      `${roleClass} :  ${hexColor} `
    );
  }
}
