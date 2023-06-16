import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { InputComponent } from './input.component';

describe('InputComponent', () => {
  let component: InputComponent;
  let spectator: Spectator<InputComponent>;

  const createComponent = createComponentFactory({
    component: InputComponent,
    imports: [
      ReactiveFormsModule,
      MatFormFieldModule,
      MatInputModule,
      MatIconModule,
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
      },
    ],
  });

  beforeEach(() => {
    const control = new FormControl('');
    spectator = createComponent({
      props: { control },
    });
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should start subscribtion that patches negative values', () => {
      component.onlyPositive = true;

      component.control.patchValue(-5);

      expect(component.control.value).toBe(5);
    });
  });

  describe('ngOnDestroy', () => {
    it('should call the destroy methods', () => {
      const nextSpy = jest.spyOn(component.destroy$, 'next');
      const completeSpy = jest.spyOn(component.destroy$, 'complete');

      component.ngOnDestroy();

      expect(nextSpy).toHaveBeenCalledTimes(1);
      expect(completeSpy).toHaveBeenCalledTimes(1);
    });
  });
});
