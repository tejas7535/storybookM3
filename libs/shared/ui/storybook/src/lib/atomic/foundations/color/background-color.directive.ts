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

// pallet should be in sync with $schaeffler-palette-m3 from schaeffler-colors.scss
const shadePlaceholder = '#ff3399';
const schaefflerPaletteM3: { [key: string]: string } = {
  'p-0': '#000000',
  'p-10': '#003513',
  'p-20': '#005425',
  'p-25': shadePlaceholder,
  'p-30': '#007033',
  'p-35': shadePlaceholder,
  'p-40': '#00893d',
  'p-50': '#73b281',
  'p-60': '#94bf99',
  'p-70': '#b2cfb3',
  'p-80': '#cddfcd',
  'p-90': '#e7efe6',
  'p-95': '#f3f7f3',
  'p-98': shadePlaceholder,
  'p-99': '#fcfdfc',
  'p-100': '#ffffff',

  's-0': '#000000',
  's-10': '#002919',
  's-20': '#003b29',
  's-25': shadePlaceholder,
  's-30': '#004d38',
  's-35': shadePlaceholder,
  's-40': '#005e46',
  's-50': '#14735e',
  's-60': '#4e8c7a',
  's-70': '#7ba697',
  's-80': '#a7c3b9',
  's-90': '#d2e0db',
  's-95': '#e8f0ed',
  's-98': shadePlaceholder,
  's-99': '#fcfdfc',
  's-100': '#ffffff',

  't-0': '#000000',
  't-10': '#002b30',
  't-20': '#154248',
  't-25': shadePlaceholder,
  't-30': '#2f585e',
  't-35': shadePlaceholder,
  't-40': '#476e75',
  't-50': '#62858b',
  't-60': '#7f9ca3',
  't-70': '#9eb4ba',
  't-80': '#bdcdd1',
  't-90': '#dde6e8',
  't-95': '#eef2f4',
  't-98': shadePlaceholder,
  't-99': '#fcfdfd',
  't-100': '#ffffff',

  'n-0': '#000000',
  'n-4': '#131313',
  'n-6': '#212121',
  'n-10': '#343434',
  'n-12': '#363636',
  'n-17': '#3f3f3f',
  'n-20': '#444444',
  'n-22': '#474747',
  'n-24': '#4b4b4b',
  'n-25': shadePlaceholder,
  'n-30': '#555555',
  'n-35': shadePlaceholder,
  'n-40': '#646464',
  'n-50': '#828282',
  'n-60': '#9d9d9d',
  'n-70': '#b8b8b8',
  'n-80': '#d0d0d0',
  'n-87': '#e1e1e1',
  'n-90': '#e8e8e8',
  'n-92': '#ededed',
  'n-94': '#f1f1f1',
  'n-95': '#f4f4f4',
  'n-96': '#f6f6f6',
  'n-98': '#fbfbfb',
  'n-99': '#fdfdfd',
  'n-100': '#ffffff',

  'nv-0': '#000000',
  'nv-10': '#343434',
  'nv-20': '#444444',
  'nv-25': shadePlaceholder,
  'nv-30': '#555555',
  'nv-35': shadePlaceholder,
  'nv-40': '#646464',
  'nv-50': '#828282',
  'nv-60': '#9d9d9d',
  'nv-70': '#b8b8b8',
  'nv-80': '#d0d0d0',
  'nv-90': '#e8e8e8',
  'nv-95': '#f4f4f4',
  'nv-98': shadePlaceholder,
  'nv-99': '#fdfdfd',
  'nv-100': '#ffffff',

  'e-0': '#000000',
  'e-10': '#500800',
  'e-20': '#7b0f01',
  'e-25': shadePlaceholder,
  'e-30': '#a30f0c',
  'e-35': shadePlaceholder,
  'e-40': '#cb0b15',
  'e-50': '#d3412e',
  'e-60': '#dd6b51',
  'e-70': '#e79278',
  'e-80': '#efb8a4',
  'e-90': '#f8dcd1',
  'e-95': '#fceee8',
  'e-98': shadePlaceholder,
  'e-99': '#fffcfb',
  'e-100': '#ffffff',
};

@Directive({
  selector: '[colorBackgroundText]',
})
export class BackgroundColorDirective implements AfterViewInit, OnChanges {
  @Input() isDarkModeEnabled: boolean = true;

  constructor(
    private readonly el: ElementRef,
    private readonly renderer: Renderer2
  ) {}

  ngAfterViewInit() {
    this.updateBackgroundColor();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.isDarkModeEnabled) {
      this.updateBackgroundColor();
    }
  }

  private updateBackgroundColor() {
    const bgColor = window.getComputedStyle(
      this.el.nativeElement.parentElement
    ).backgroundColor;

    const roleClass = this.el.nativeElement.parentElement.classList[0];
    const hexColor = toHex(bgColor);
    const paletteColor = this.getPaletteColor(
      hexColor,
      roleClass
    ).toUpperCase();

    const roleClassText = roleClass.replace('bg-', '');

    this.renderer.setProperty(
      this.el.nativeElement,
      'innerHTML',
      `${roleClassText}  ${paletteColor}:  ${hexColor} `
    );
  }

  private getPaletteColor(colorValue: string, roleClass: string): string {
    let result = '';

    let colorPrefix = '';

    switch (true) {
      case roleClass.includes('-primary'):
        colorPrefix = 'p-';
        break;
      case roleClass.includes('-secondary'):
        colorPrefix = 's-';
        break;
      case roleClass.includes('-tertiary'):
        colorPrefix = 't-';
        break;
      case roleClass.includes('-error'):
        colorPrefix = 'e-';
        break;
      case roleClass.includes('-surface'):
      case roleClass.includes('-scrim'):
      case roleClass.includes('-shadow'):
      case roleClass.includes('-container'):
        colorPrefix = 'n-';
        break;
      case roleClass.includes('-outline'):
        colorPrefix = 'nv-';
        break;
      default:
        colorPrefix = '';
        break;
    }

    for (const key in schaefflerPaletteM3) {
      if (
        key.includes(colorPrefix) &&
        schaefflerPaletteM3[key] === colorValue
      ) {
        result += `${key} `;
      }
    }

    return result;
  }
}
