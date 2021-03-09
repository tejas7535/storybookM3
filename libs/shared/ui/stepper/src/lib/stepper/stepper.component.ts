import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';

import { Step } from './stepper-step.model';

import type { ElementRef } from '@angular/core';
import type { FormGroup } from '@angular/forms';
import type { MatStepper } from '@angular/material/stepper';
@Component({
  selector: 'schaeffler-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
})
export class StepperComponent implements AfterViewInit {
  @ViewChild('stepper') stepper!: MatStepper;

  @ViewChild('formElem') formElem!: ElementRef;

  @Input() steps: Step[] = [];

  @Input() linear = false;

  @Input() formGroup!: FormGroup;

  @Input() showButtons = true;

  ngAfterViewInit(): void {
    this.markActiveSeparator();
  }

  public nextStep(): void {
    this.stepper.selectedIndex !== this.steps.length - 1 && this.stepper.next();
  }

  public previousStep(): void {
    this.stepper.selectedIndex > 0 && this.stepper.previous();
  }

  public trackByFn(index: number): number {
    return index;
  }

  private markActiveSeparator(): void {
    const separators: HTMLElement[] = [
      ...this.formElem.nativeElement.querySelectorAll(
        '.mat-stepper-horizontal-line'
      ),
    ];

    separators[0].classList.add('active');
    this.stepper.selectionChange.subscribe((event: StepperSelectionEvent) => {
      separators
        .find((separator) => separator.classList.contains('active'))
        ?.classList.remove('active');
      separators[
        Math.min(event.selectedIndex, this.steps.length - 2)
      ].classList.add('active');
    });
  }
}
