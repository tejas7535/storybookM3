import { MatDialogRef } from '@angular/material/dialog';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { GlobalSearchAdvancedModalComponent } from './global-search-advanced-modal.component';

describe('GlobalSearchAdvancedModalComponent', () => {
  let component: GlobalSearchAdvancedModalComponent;
  let spectator: SpectatorService<GlobalSearchAdvancedModalComponent>;

  const createService = createServiceFactory({
    service: GlobalSearchAdvancedModalComponent,
    providers: [
      {
        provide: MatDialogRef,
        useValue: {
          close: jest.fn(),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    component = spectator.inject(GlobalSearchAdvancedModalComponent);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('toggleOnlyUserCases', () => {
    it('should toggle onlyUserCases', () => {
      component.onlyUserCases = false;

      component.toggleOnlyUserCases();
      expect(component.onlyUserCases).toBe(true);

      component.toggleOnlyUserCases();
      expect(component.onlyUserCases).toBe(false);
    });
  });

  describe('closeDialog', () => {
    it('should close the dialog', () => {
      const spy = jest.spyOn(component['dialogRef'], 'close');

      component.closeDialog();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('clearInputField', () => {
    it('should clear the input field', () => {
      component.onlyUserCases = true;
      component.searchFormControl.patchValue('test');

      component.clearInputField();
      expect(component.onlyUserCases).toBe(false);
      expect(component.searchFormControl.value).toBe('');
    });
  });
});
