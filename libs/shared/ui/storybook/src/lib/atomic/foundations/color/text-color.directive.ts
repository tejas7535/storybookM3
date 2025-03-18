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
  selector: '[colorText]',
})
export class TextColorDirective implements AfterViewInit, OnChanges {
  @Input() isDarkModeEnabled: boolean = true;

  constructor(
    private readonly el: ElementRef,
    private readonly renderer: Renderer2
  ) {}

  ngAfterViewInit() {
    this.updateTextColor();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.isDarkModeEnabled) {
      this.updateTextColor();
    }
  }

  private updateTextColor() {
    const element = this.el.nativeElement;
    const textColor = window.getComputedStyle(element).color;

    const roleClass = element.classList[0];
    const hexColor = toHex(textColor);

    this.renderer.setProperty(
      element,
      'innerHTML',
      `${roleClass} :  ${hexColor} `
    );
  }
}
