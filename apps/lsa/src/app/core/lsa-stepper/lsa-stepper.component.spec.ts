import { CdkStepperModule } from '@angular/cdk/stepper';
import { Component } from '@angular/core';

@Component({
  template: `
    <lsa-stepper>
      <cdk-step [label]="'test1'"></cdk-step>
      <cdk-step [label]="'test2'"></cdk-step>
    </lsa-stepper>
  `,
  standalone: false,
})
class TestComponent {}

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { ReplaySubject } from 'rxjs';

import { LsaFormService } from '../services/lsa-form.service';
import { LsaStepperComponent } from './lsa-stepper.component';

describe('LsaStepperComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CdkStepperModule, LsaStepperComponent],
      providers: [
        {
          provide: LsaFormService,
          useValue: {
            getRecommendationForm: jest.fn(
              () =>
                ({
                  getRawValue: jest.fn(),
                }) as unknown as FormGroup
            ),
            stepCompletionStream$$: new ReplaySubject<number>(),
          },
        },
      ],
      declarations: [TestComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should instantiate test component', () => {
    expect(component).toBeDefined();
    const stepper = fixture.debugElement.query(
      By.directive(LsaStepperComponent)
    );

    stepper.componentInstance.selectStepByIndex(1);
  });

  describe('when stepper is initialized', () => {
    let stepper: LsaStepperComponent;

    beforeEach(() => {
      stepper = fixture.debugElement.query(
        By.directive(LsaStepperComponent)
      ).componentInstance;
      fixture.detectChanges();
    });

    describe('when first step is selected', () => {
      beforeEach(() => {
        stepper.selectStepByIndex(0);
        fixture.detectChanges();
      });

      it('should have a nextItemLabel', () => {
        expect(stepper.nextItemLabel).toBe('test2');
      });

      it('should indicate that item is first', () => {
        expect(stepper.isFirstItem).toBe(true);
      });

      it('should indicate that item is second last', () => {
        expect(stepper.isSecondLastItem).toBe(true);
      });

      it('should not have a previousItemLabel', () => {
        expect(stepper.previousItemLabel).toBe('');
      });
    });

    describe('when last step is selected', () => {
      beforeEach(() => {
        stepper.selectStepByIndex(1);
        fixture.detectChanges();
      });

      it('should have a previousItemLabel', () => {
        expect(stepper.previousItemLabel).toBe('test1');
      });

      it('should indicate that item is last', () => {
        expect(stepper.isLastItem).toBe(true);
      });

      it('should not have a nextItemLabel', () => {
        expect(stepper.nextItemLabel).toBe('');
      });
    });
  });
});
