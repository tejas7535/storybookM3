import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { AfterViewInit, Directive, ElementRef } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';

@Directive({
  selector: '[schaefflerSeparatedSteps]',
})
export class SeparatedStepsDirective implements AfterViewInit {
  public el!: ElementRef;
  public constructor(
    el: ElementRef,
    public stepper: MatStepper
  ) {
    this.el = el;
  }

  public ngAfterViewInit(): void {
    this.markActiveSeparator();
  }

  private markActiveSeparator(): void {
    const separators: HTMLElement[] = [
      ...this.el.nativeElement.querySelectorAll('.mat-stepper-horizontal-line'),
    ];

    separators[0].classList.add('active');
    this.stepper.selectionChange.subscribe((event: StepperSelectionEvent) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      separators
        .find((separator) => separator.classList.contains('active'))!
        .classList.remove('active');
      separators[
        Math.min(event.selectedIndex, this.stepper.steps.length - 2)
      ].classList.add('active');
    });
  }
}
