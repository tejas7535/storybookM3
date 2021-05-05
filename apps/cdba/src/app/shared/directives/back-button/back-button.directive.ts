import { Location } from '@angular/common';
import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[cdbaBackButton]',
})
export class BackButtonDirective {
  constructor(private readonly location: Location) {}

  @HostListener('click')
  navigateBack(): void {
    this.location.back();
  }
}
