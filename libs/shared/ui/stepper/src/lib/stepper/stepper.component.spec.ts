import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { Step } from './stepper-step.model';
import { StepperComponent } from './stepper.component';

@Component({
  template: `
    <ng-template #step1
      ><input type="text" [formControl]="formGroup.get('step1').get('input1')"
    /></ng-template>
    <ng-template #step2
      ><input type="text" [formControl]="formGroup.get('step2').get('input2')"
    /></ng-template>
    <ng-template #step3
      ><input type="text" [formControl]="formGroup.get('step3').get('input3')"
    /></ng-template>
    <schaeffler-stepper
      #stepper
      [formGroup]="formGroup"
      [steps]="steps"
    ></schaeffler-stepper>
  `,
})
class WrapperComponent {
  @ViewChild(StepperComponent, { static: true })
  stepperComponentRef!: StepperComponent;
  @ViewChild('step1', { static: true }) step1Ref!: TemplateRef<any>;
  @ViewChild('step2', { static: true }) step2Ref!: TemplateRef<any>;
  @ViewChild('step3', { static: true }) step3Ref!: TemplateRef<any>;
  public formGroup = new FormGroup({
    step1: new FormGroup({
      input1: new FormControl(),
    }),
    step2: new FormGroup({
      input2: new FormControl(),
    }),
    step3: new FormGroup({
      input3: new FormControl(),
    }),
  });
  public get steps(): Step[] {
    return [
      {
        label: 'step 2',
        content: this.step1Ref,
        editable: true,
        formGroupName: 'step2',
      },
      {
        label: 'step 2',
        content: this.step2Ref,
        editable: true,
        formGroupName: 'step2',
      },
      {
        label: 'step 3',
        content: this.step3Ref,
        editable: true,
        formGroupName: 'step3',
      },
    ];
  }
}

describe('StepperComponent', () => {
  let component: StepperComponent;
  let fixture: ComponentFixture<WrapperComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          NoopAnimationsModule,
          ReactiveFormsModule,
          MatStepperModule,
          MatButtonModule,
        ],
        declarations: [WrapperComponent, StepperComponent],
      }).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(WrapperComponent);
    const wrapperComponent = fixture.debugElement.componentInstance;
    component = wrapperComponent.stepperComponentRef;
    fixture.detectChanges();
  });

  it(
    'should create',
    waitForAsync(() => {
      expect(component).toBeTruthy();
    })
  );

  describe('markActiveSeparators', () => {
    it('should mark the active separator', () => {
      component.ngAfterViewInit();
      const separators: HTMLElement[] = Array.from(
        document.querySelectorAll('.mat-stepper-horizontal-line')
      );
      expect(separators[0].classList.contains('active')).toBeTruthy();
    });

    it(
      'should mark the active separator',
      waitForAsync(() => {
        component.stepper.selectionChange.subscribe(() => {
          fixture.detectChanges();
          const separators: HTMLElement[] = Array.from(
            document.querySelectorAll('.mat-stepper-horizontal-line')
          );
          expect(separators[0].classList.contains('active')).toBeFalsy();
          expect(separators[1].classList.contains('active')).toBeTruthy();
        });
        component.stepper.next();
      })
    );
  });

  it('should select next step when nextStep is called', () => {
    const currentStep = component.stepper.selectedIndex;
    component.nextStep();
    expect(component.stepper.selectedIndex).toEqual(currentStep + 1);
  });

  it('should select previous step when previousStep is called', () => {
    component.stepper.next();
    const currentStep = component.stepper.selectedIndex;
    component.previousStep();
    expect(component.stepper.selectedIndex).toEqual(currentStep - 1);
  });

  it('should return index', () => {
    const result = component.trackByFn(3);
    expect(result).toEqual(3);
  });
});
