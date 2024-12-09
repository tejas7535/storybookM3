import { CdkStep, CdkStepper, CdkStepperModule } from '@angular/cdk/stepper';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, OnDestroy } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';

import { combineLatest, Subject, takeUntil } from 'rxjs';

import { LsaFormService } from '../services/lsa-form.service';

@Component({
  selector: 'lsa-stepper',
  templateUrl: './lsa-stepper.component.html',
  styleUrls: ['./lsa-stepper.component.scss'],
  standalone: true,
  providers: [{ provide: CdkStepper, useExisting: LsaStepperComponent }],
  imports: [
    CommonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    CdkStepperModule,
    MatDividerModule,
  ],
})
export class LsaStepperComponent
  extends CdkStepper
  implements OnDestroy, AfterViewInit
{
  formService = inject(LsaFormService);
  form = this.formService.getRecommendationForm();

  destroy$$ = new Subject<void>();

  get isLastItem(): boolean {
    return this.selectedIndex === this.steps.length - 1;
  }

  get isFirstItem(): boolean {
    return this.selectedIndex === 0;
  }

  get isSecondLastItem(): boolean {
    return this.selectedIndex === this.steps.length - 2;
  }

  get nextItemLabel(): string {
    if (this.isLastItem) {
      return '';
    }

    return this.steps.get(this.selectedIndex + 1)?.label;
  }

  get previousItemLabel(): string {
    if (this.isFirstItem) {
      return '';
    }

    return this.steps.get(this.selectedIndex - 1)?.label;
  }

  ngAfterViewInit(): void {
    super.ngAfterViewInit();
    combineLatest([this.steps.changes, this.formService.stepCompletionStream$$])
      .pipe(takeUntil(this.destroy$$))
      .subscribe(([steps, index]) => {
        const step = steps.get(index);
        if (!step) {
          return;
        }
        (step as CdkStep).completed = true;
      });
    combineLatest([this.steps.changes, this.formService.resetStepState$$])
      .pipe(takeUntil(this.destroy$$))
      .subscribe(() => {
        this.selectStepByIndex(0);
        this.steps.forEach((step) => step.reset());
      });
  }

  ngOnDestroy(): void {
    this.destroy$$.next();
  }
  selectStepByIndex(index: number): void {
    this.selectedIndex = index;
  }
}
