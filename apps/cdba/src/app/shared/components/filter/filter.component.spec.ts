import { CommonModule } from '@angular/common';
import { fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockModule } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { FilterComponent } from './filter.component';

describe('FilterComponent', () => {
  let spectator: Spectator<FilterComponent>;
  let component: FilterComponent;

  const createComponent = createComponentFactory({
    component: FilterComponent,
    imports: [
      CommonModule,
      MockModule(MatIconModule),
      MockModule(MatButtonModule),
      MockModule(FormsModule),
      MockModule(MatInputModule),
      MockModule(MatFormFieldModule),
      provideTranslocoTestingModule({ en: {} }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initialization', () => {
    it('should have default values', () => {
      expect(component.value).toBe('');
      expect(component.debounceTime).toBe(300);
    });
  });

  describe('updateFilter', () => {
    it('should update value property', () => {
      component.updateFilter('new value');
      expect(component.value).toBe('new value');
    });

    it('should emit valueChange after debounce period', fakeAsync(() => {
      const valueChangeSpy = jest.spyOn(component.valueChange, 'emit');

      component.updateFilter('test value');
      expect(valueChangeSpy).not.toHaveBeenCalled();

      tick(component.debounceTime - 10);
      expect(valueChangeSpy).not.toHaveBeenCalled();

      tick(10);
      expect(valueChangeSpy).toHaveBeenCalledWith('test value');
    }));

    it('should handle multiple rapid updates correctly', fakeAsync(() => {
      const valueChangeSpy = jest.spyOn(component.valueChange, 'emit');

      component.updateFilter('value1');
      component.updateFilter('value2');
      component.updateFilter('value3');

      tick(component.debounceTime - 10);
      expect(valueChangeSpy).not.toHaveBeenCalled();

      tick(10);
      expect(valueChangeSpy).toHaveBeenCalledTimes(1);
      expect(valueChangeSpy).toHaveBeenCalledWith('value3');
    }));

    it('should emit the most recent value when debounce period ends', fakeAsync(() => {
      const valueChangeSpy = jest.spyOn(component.valueChange, 'emit');

      component.updateFilter('a');
      tick(100);

      component.updateFilter('ab');
      tick(100);

      component.updateFilter('abc');

      expect(valueChangeSpy).not.toHaveBeenCalled();
      tick(component.debounceTime);

      expect(valueChangeSpy).toHaveBeenCalledWith('abc');
      expect(valueChangeSpy).toHaveBeenCalledTimes(1);
    }));
  });

  describe('clearFilter', () => {
    it('should emit valueChange immediately', () => {
      const valueChangeSpy = jest.spyOn(component.valueChange, 'emit');

      component.value = 'test value';
      component.clearFilter();

      expect(component.value).toBe('');
      expect(valueChangeSpy).toHaveBeenCalledWith('');
      expect(valueChangeSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('clearButtonDisabled', () => {
    it('should return true when value is empty', () => {
      component.value = '';
      expect(component.clearButtonDisabled()).toBe(true);
    });

    it('should return false when value is not empty', () => {
      component.value = 'test value';
      expect(component.clearButtonDisabled()).toBe(false);
    });
  });
  describe('ngOnDestroy', () => {
    it('should call ngOnDestroy without errors', () => {
      expect(() => {
        component.ngOnDestroy();
      }).not.toThrow();
    });
  });
});
