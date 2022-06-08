import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { of } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { SpyObject } from '@ngneat/spectator/jest/lib/mock.js';
import { ReactiveComponentModule } from '@ngrx/component';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { InfoIconModule } from '../../shared/components/info-icon/info-icon.module';
import { EditCaseModalComponent } from '../../shared/components/modal/edit-case-modal/edit-case-modal.component';
import { SharedPipesModule } from '../../shared/pipes/shared-pipes.module';
import { HeaderContentComponent } from './header-content.component';

describe('HeaderContentComponent', () => {
  let component: HeaderContentComponent;
  let spectator: Spectator<HeaderContentComponent>;
  let matDialogSpyObject: SpyObject<MatDialog>;

  const createComponent = createComponentFactory({
    component: HeaderContentComponent,
    imports: [
      MatIconModule,
      InfoIconModule,
      SharedPipesModule,
      ReactiveComponentModule,
      MatDialogModule,
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [{ provide: MATERIAL_SANITY_CHECKS, useValue: false }],
    mocks: [MatDialog],
  });

  beforeEach(() => {
    spectator = createComponent();
    matDialogSpyObject = spectator.inject(MatDialog);
    matDialogSpyObject.open.andReturn({
      afterClosed: jest.fn(() => of(true)),
    });
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('case editing modal', () => {
    beforeEach(() => {
      component.updateCaseName.emit = jest.fn();
    });
    test('should pass caseName to Modal', () => {
      component.caseName = 'case-name';

      component.openCaseEditingModal();

      expect(matDialogSpyObject.open).toHaveBeenCalledWith(
        EditCaseModalComponent,
        {
          width: '480px',
          data: {
            caseName: 'case-name',
          },
        }
      );
    });

    test('should emit output', () => {
      matDialogSpyObject.open.andReturn({
        afterClosed: jest.fn(() => of({ caseName: 'test' })),
      });

      component.openCaseEditingModal();

      expect(component.updateCaseName.emit).toHaveBeenCalledTimes(1);
      expect(component.updateCaseName.emit).toHaveBeenCalledWith('test');
    });

    test('should not emit output', () => {
      matDialogSpyObject.open.andReturn({
        afterClosed: jest.fn(() => of()),
      });

      component.openCaseEditingModal();

      expect(component.updateCaseName.emit).toHaveBeenCalledTimes(0);
    });
  });
});
