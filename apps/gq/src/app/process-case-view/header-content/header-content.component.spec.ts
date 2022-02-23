import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { ReactiveComponentModule } from '@ngrx/component';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { InfoIconModule } from '../../shared/info-icon/info-icon.module';
import { SharedPipesModule } from '../../shared/pipes/shared-pipes.module';
import { HeaderContentComponent } from './header-content.component';

describe('HeaderContentComponent', () => {
  let component: HeaderContentComponent;
  let spectator: Spectator<HeaderContentComponent>;

  const createComponent = createComponentFactory({
    component: HeaderContentComponent,
    imports: [
      MatIconModule,
      InfoIconModule,
      SharedPipesModule,
      ReactiveComponentModule,
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [{ provide: MATERIAL_SANITY_CHECKS, useValue: false }],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('OnInit', () => {
    test('subscription should be added', () => {
      component['subscription'].add = jest.fn();

      component.ngOnInit();

      expect(component['subscription'].add).toHaveBeenCalledTimes(1);
    });
    test('should set caseNameInput and saveCaseNameEnabled', () => {
      component.caseNameInput = undefined;
      component.saveCaseNameEnabled = false;

      component.ngOnInit();

      component.caseNameFormControl.setValue('test');

      expect(component.caseNameInput).toEqual('test');
      expect(component.saveCaseNameEnabled).toBeTruthy();
    });
    test('should set caseNameInput and saveCaseNameEnabled to false', () => {
      component.caseNameInput = undefined;
      component.saveCaseNameEnabled = true;

      component.ngOnInit();

      component.caseNameFormControl.setValue(' ');

      expect(component.caseNameInput).toEqual('');
      expect(component.saveCaseNameEnabled).toBeFalsy();
    });
    test('should set caseNameInput to caseName and saveCaseNameEnabled to false', () => {
      component.caseName = 'test';
      component.saveCaseNameEnabled = true;

      component.ngOnInit();

      component.caseNameFormControl.setValue(component.caseName);

      expect(component.caseNameInput).toEqual(component.caseName);
      expect(component.saveCaseNameEnabled).toBeFalsy();
    });
  });
  describe('ngOnDestroy', () => {
    test('should unsubscribe subscription', () => {
      component['subscription'].unsubscribe = jest.fn();

      component.ngOnDestroy();

      expect(component['subscription'].unsubscribe).toHaveBeenCalledTimes(1);
    });
  });
  describe('toggleCaseNameEditing', () => {
    test('should toggle editCaseNameMode and emit output', () => {
      component.displayTitle.emit = jest.fn();

      component.toggleCaseNameEditing(true);

      expect(component.editCaseNameMode).toBeTruthy();
      expect(component.displayTitle.emit).toHaveBeenCalledTimes(1);
      expect(component.displayTitle.emit).toHaveBeenCalledWith(false);
    });
  });

  describe('saveCaseName', () => {
    beforeEach(() => {
      component.updateCaseName.emit = jest.fn();
      component.toggleCaseNameEditing = jest.fn();
      component.caseNameInput = 'test';
    });
    test('should emit output', () => {
      component.saveCaseNameEnabled = true;
      component.saveCaseName();

      expect(component.updateCaseName.emit).toHaveBeenCalledTimes(1);
      expect(component.updateCaseName.emit).toHaveBeenCalledWith('test');
      expect(component.toggleCaseNameEditing).toHaveBeenCalledTimes(1);
      expect(component.toggleCaseNameEditing).toHaveBeenCalledWith(false);
    });

    test('should not emit output', () => {
      component.saveCaseName();

      expect(component.updateCaseName.emit).toHaveBeenCalledTimes(0);
      expect(component.toggleCaseNameEditing).toHaveBeenCalledTimes(0);
    });
  });
});
