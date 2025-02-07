import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { BomExportStatus } from '../model/feature/bom-export';
import { Interaction } from '../model/interaction.model';
import { InteractionType } from '../model/interaction-type.enum';
import { UserInteractionService } from './user-interaction.service';

describe('UserInteractionService', () => {
  let service: UserInteractionService;
  let spectator: SpectatorService<UserInteractionService>;
  let snackBar: MatSnackBar;
  let httpMock: HttpTestingController;

  const createSerive = createServiceFactory({
    service: UserInteractionService,
    imports: [MatSnackBarModule, provideTranslocoTestingModule({ en: {} })],
    providers: [
      provideHttpClient(),
      provideHttpClientTesting(),
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
      },
    ],
  });

  beforeEach(() => {
    spectator = createSerive();
    service = spectator.inject(UserInteractionService);
    snackBar = spectator.inject(MatSnackBar);
    httpMock = spectator.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('interact', () => {
    it('should open snackbar', () => {
      const spySnackBarOpen = jest.spyOn(snackBar, 'open');

      service.interact(InteractionType.HTTP_GENERAL_ERROR);

      expect(spySnackBarOpen).toHaveBeenCalled();
    });

    it('should not open error snackbar', () => {
      const spySnackbarOpen = jest.spyOn(snackBar, 'open');

      service.snackBarIsOpen = true;
      service.interact(InteractionType.HTTP_GENERAL_ERROR);

      expect(spySnackbarOpen).not.toHaveBeenCalled();
    });
  });

  describe('loadInitialBomExportStatus', () => {
    afterEach(() => {
      httpMock.verify();
    });

    it('should get initial bom status', () => {
      const mock = {} as BomExportStatus;

      service.loadInitialBomExportStatus().subscribe((response) => {
        expect(response).toEqual(mock);
      });

      const req = httpMock.expectOne('api/v1/bom/export/status');
      expect(req.request.method).toBe('GET');
      req.flush(mock);
    });
  });

  describe('determineInteractionByType', () => {
    it('should return HTTP_GENERAL_ERROR interaction', () => {
      const interaction = service['determineInteractionByType'](
        InteractionType.HTTP_GENERAL_ERROR
      );
      expect(interaction).toBe(Interaction.HTTP_GENERAL_ERROR);
    });

    it('should return HTTP_GENERAL_VALIDATION_ERROR interaction', () => {
      const interaction = service['determineInteractionByType'](
        InteractionType.HTTP_GENERAL_VALIDATION_ERROR
      );
      expect(interaction).toBe(Interaction.HTTP_GENERAL_VALIDATION_ERROR);
    });

    it('should return REQUEST_BOM_EXPORT_SUCCESS interaction', () => {
      const interaction = service['determineInteractionByType'](
        InteractionType.REQUEST_BOM_EXPORT_SUCCESS
      );
      expect(interaction).toBe(Interaction.REQUEST_BOM_EXPORT_SUCCESS);
    });

    it('should return REQUEST_BOM_EXPORT_FAILURE interaction', () => {
      const interaction = service['determineInteractionByType'](
        InteractionType.REQUEST_BOM_EXPORT_FAILURE
      );
      expect(interaction).toBe(Interaction.REQUEST_BOM_EXPORT_FAILURE);
    });

    it('should return TRACK_BOM_EXPORT_PROGRESS_COMPLETED interaction', () => {
      const interaction = service['determineInteractionByType'](
        InteractionType.TRACK_BOM_EXPORT_PROGRESS_COMPLETED
      );
      expect(interaction).toBe(Interaction.TRACK_BOM_EXPORT_PROGRESS_COMPLETED);
    });

    it('should return TRACK_BOM_EXPORT_PROGRESS_FAILURE interaction', () => {
      const interaction = service['determineInteractionByType'](
        InteractionType.TRACK_BOM_EXPORT_PROGRESS_FAILURE
      );
      expect(interaction).toBe(Interaction.TRACK_BOM_EXPORT_PROGRESS_FAILURE);
    });

    it('should return REQUEST_BOM_EXPORT_VALIDATION_ERROR interaction', () => {
      const interaction = service['determineInteractionByType'](
        InteractionType.REQUEST_BOM_EXPORT_VALIDATION_ERROR
      );
      expect(interaction).toBe(Interaction.REQUEST_BOM_EXPORT_VALIDATION_ERROR);
    });

    it('should throw an error for unhandled InteractionType', () => {
      expect(() =>
        service['determineInteractionByType'](undefined)
      ).toThrowError('Unhandled InteractionType');
    });
  });
});
