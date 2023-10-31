import { AfterViewInit, Directive, OnDestroy } from '@angular/core';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[pinDropDown]',
  exportAs: 'pinDropDown',
})
export class PinDropDownDirective implements AfterViewInit, OnDestroy {
  constructor(private readonly autocomplete: MatAutocompleteTrigger) {}

  ngAfterViewInit() {
    window.addEventListener('scroll', this.onContentScrolled, true);
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.onContentScrolled, true);
  }

  private readonly onContentScrolled = (): void => {
    if (!this.autocomplete) {
      return;
    }
    if (this.autocomplete.panelOpen) {
      this.autocomplete.updatePosition();
    }
  };
}
