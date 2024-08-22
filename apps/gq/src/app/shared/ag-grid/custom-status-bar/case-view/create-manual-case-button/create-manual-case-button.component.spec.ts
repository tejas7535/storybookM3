import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppRoutePath } from '@gq/app-route-path.enum';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { CreateManualCaseButtonComponent } from './create-manual-case-button.component';

describe('CreateManualCaseComponent', () => {
  let component: CreateManualCaseButtonComponent;
  let spectator: Spectator<CreateManualCaseButtonComponent>;

  const createComponent = createComponentFactory({
    component: CreateManualCaseButtonComponent,
    imports: [
      RouterModule.forRoot([]),
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('createManualCase', () => {
    test('should create manual case', () => {
      component['featureToggleConfigService'].isEnabled = jest
        .fn()
        .mockReturnValue(true);
      component['router'].navigate = jest.fn();
      component.createManualCase();
      expect(component['router'].navigate).toHaveBeenCalledWith([
        AppRoutePath.CreateManualCasePath,
      ]);
    });

    test('should open create manual case modal', () => {
      component['featureToggleConfigService'].isEnabled = jest
        .fn()
        .mockReturnValue(false);
      component['dialog'].open = jest.fn();
      component.createManualCase();
      expect(component['dialog'].open).toHaveBeenCalledWith(
        expect.any(Function),
        {
          width: '70%',
          height: '95%',
          panelClass: 'create-manual-case-modal',
        }
      );
    });
  });
});
