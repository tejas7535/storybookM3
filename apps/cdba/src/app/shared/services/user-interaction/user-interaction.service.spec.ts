import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { Interaction } from './interaction-type.model';
import { UserInteractionService } from './user-interaction.service';

describe('UserInteractionService', () => {
  let service: UserInteractionService;
  let spectator: SpectatorService<UserInteractionService>;
  let snackBar: MatSnackBar;

  const createSerive = createServiceFactory({
    service: UserInteractionService,
    imports: [MatSnackBarModule, provideTranslocoTestingModule({ en: {} })],
    providers: [
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
      },
    ],
  });

  beforeEach(() => {
    spectator = createSerive();
    service = spectator.service;
    snackBar = spectator.inject(MatSnackBar);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('interact', () => {
    it('should open snackbar', () => {
      const spySnackBarOpen = jest.spyOn(snackBar, 'open');

      service.interact(Interaction.HTTP_GENERAL_ERROR);

      expect(spySnackBarOpen).toHaveBeenCalled();
    });

    it('should not open error snackbar', () => {
      const spySnackbarOpen = jest.spyOn(snackBar, 'open');

      service.snackBarIsOpen = true;
      service.interact(Interaction.HTTP_GENERAL_ERROR);

      expect(spySnackbarOpen).not.toHaveBeenCalled();
    });
  });
});
