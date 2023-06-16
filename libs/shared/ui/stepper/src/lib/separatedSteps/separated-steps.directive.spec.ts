import { ChangeDetectorRef, ElementRef } from '@angular/core';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';

import {
  createDirectiveFactory,
  SpectatorDirective,
} from '@ngneat/spectator/jest';

import { SeparatedStepsDirective } from './separated-steps.directive';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
class MockElementRef {}

describe('Separated steps Directive', () => {
  // let fixture: ComponentFixture<TestingComponent>;
  let spectator: SpectatorDirective<SeparatedStepsDirective>;
  const createDirective = createDirectiveFactory({
    directive: SeparatedStepsDirective,
    imports: [MatStepperModule],
    providers: [
      MatStepper,
      ChangeDetectorRef,
      { provide: ElementRef, useClass: MockElementRef },
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
      },
    ],
  });

  beforeEach(() => {
    spectator = createDirective(`
    <mat-horizontal-stepper schaefflerSeparatedSteps>
      <mat-step></mat-step>
      <mat-step></mat-step>
      <mat-step></mat-step>
      <mat-step></mat-step>
    </mat-horizontal-stepper>`);
  });

  it('should get the instance', () => {
    const instance = spectator.directive;
    expect(instance).toBeDefined();
  });

  it('should mark the active separator after view init', () => {
    spectator.directive.ngAfterViewInit();
    const separators = spectator.queryAll('.mat-stepper-horizontal-line');
    expect(separators[0].classList.contains('active')).toBeTruthy();
  });

  it('should mark the active separator on stepper', () => {
    spectator.directive.ngAfterViewInit();
    spectator.directive.stepper.selectionChange.subscribe(() => {
      spectator.detectChanges();
      const separators = spectator.queryAll('.mat-stepper-horizontal-line');
      expect(separators[0].classList).not.toContain('active');
      expect(separators[1].classList).toContain('active');
    });
    spectator.directive.stepper.next();
  });
});
