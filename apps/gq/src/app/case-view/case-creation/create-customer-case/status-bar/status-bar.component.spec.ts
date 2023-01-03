import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { StatusBarComponent } from './status-bar.component';

describe('StatusBarComponent', () => {
  let component: StatusBarComponent;
  let spectator: Spectator<StatusBarComponent>;

  const createComponent = createComponentFactory({
    component: StatusBarComponent,
    imports: [MatIconModule, provideTranslocoTestingModule({ en: {} })],
    providers: [{ provide: MATERIAL_SANITY_CHECKS, useValue: false }],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('emitCreateCase', () => {
    test('should emit output createCase', () => {
      component.createCase.emit = jest.fn();

      component.emitCreateCase();

      expect(component.createCase.emit).toHaveBeenCalledTimes(1);
    });
  });
  describe('emitResetAll', () => {
    test('should emit output resetAll', () => {
      component.resetAll.emit = jest.fn();

      component.emitResetAll();

      expect(component.resetAll.emit).toHaveBeenCalledTimes(1);
    });
  });
  describe('emitCloseDialog', () => {
    test('should emit output closeDialog', () => {
      component.closeDialog.emit = jest.fn();

      component.emitCloseDialog();

      expect(component.closeDialog.emit).toHaveBeenCalledTimes(1);
    });
  });
});
