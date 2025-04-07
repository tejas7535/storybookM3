import { MatDialogRef } from '@angular/material/dialog';

import { of } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { IMRService } from '../../../../../feature/internal-material-replacement/imr.service';
import { SnackbarService } from '../../../../../shared/utils/service/snackbar.service';
import { MessageType } from './../../../../../shared/models/message-type.enum';
import { Stub } from './../../../../../shared/test/stub.class';
import { InternalMaterialReplacementSingleDeleteModalComponent } from './internal-material-replacement-single-delete-modal.component';

describe('InternalMaterialReplacementSingleDeleteModalComponent', () => {
  let spectator: Spectator<InternalMaterialReplacementSingleDeleteModalComponent>;
  const createComponent = createComponentFactory({
    component: InternalMaterialReplacementSingleDeleteModalComponent,
    mocks: [IMRService, MatDialogRef, SnackbarService],
    providers: [Stub.getMatDialogDataProvider({ id: 1, name: 'Test' })],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  describe('deleteEntry', () => {
    it('should not call deleteIMRSubstitution if imrSubstitution is not defined', () => {
      spectator.component.imrSubstitution = null;
      const spy = jest.spyOn(
        spectator.inject(IMRService),
        'deleteIMRSubstitution'
      );
      spectator.component['deleteEntry']();
      expect(spy).not.toHaveBeenCalled();
    });

    it('should call deleteIMRSubstitution and handle success', () => {
      const mockResponse = {
        overallStatus: MessageType.Success,
        overallErrorMsg: null,
        response: [
          {
            replacementType: 'RELOCATION' as any,
            region: 'anyRegion',
            salesArea: null,
            salesOrg: null,
            customerNumber: null,
            predecessorMaterial: null,
            result: {
              messageType: MessageType.Success,
              messageClass: null,
              messageNumber: null,
              fallbackMessage: null,
              param1: null,
              param2: null,
              param3: null,
              param4: null,
            },
          },
        ],
      } as any;
      const imrService = spectator.inject(IMRService);
      const snackbarService = spectator.inject(SnackbarService);
      const dialogRef = spectator.inject(MatDialogRef);

      jest
        .spyOn(imrService, 'deleteIMRSubstitution')
        .mockReturnValue(of(mockResponse));
      jest.spyOn(snackbarService, 'openSnackBar');
      jest.spyOn(dialogRef, 'close');
      jest.spyOn(spectator.component as any, 'handleOnClose');

      spectator.component['deleteEntry']();

      expect(imrService.deleteIMRSubstitution).toHaveBeenCalledWith(
        spectator.component.imrSubstitution,
        false
      );
      expect(snackbarService.openSnackBar).toHaveBeenCalledWith(
        'generic.validation.save.success'
      );
      expect(spectator.component['handleOnClose']).toHaveBeenCalledWith(true);
      expect(dialogRef.close).toHaveBeenCalledWith(true);
    });

    it('should call deleteIMRSubstitution and handle error', () => {
      const mockResponse = {
        overallStatus: MessageType.Error,
        overallErrorMsg: 'This is an error',
        response: [],
      } as any;
      const imrService = spectator.inject(IMRService);
      const snackbarService = spectator.inject(SnackbarService);
      const dialogRef = spectator.inject(MatDialogRef);

      jest
        .spyOn(imrService, 'deleteIMRSubstitution')
        .mockReturnValue(of(mockResponse));
      jest.spyOn(snackbarService, 'openSnackBar');
      jest.spyOn(dialogRef, 'close');
      jest.spyOn(spectator.component as any, 'handleOnClose');

      spectator.component['deleteEntry']();

      expect(imrService.deleteIMRSubstitution).toHaveBeenCalledWith(
        spectator.component.imrSubstitution,
        false
      );
      expect(snackbarService.openSnackBar).toHaveBeenCalled();
      expect(spectator.component['handleOnClose']).toHaveBeenCalledWith(false);
      expect(dialogRef.close).toHaveBeenCalledWith(false);
    });
  });

  describe('handleOnClose', () => {
    it('should close the dialog with the provided value', () => {
      const dialogRef = spectator.inject(MatDialogRef);
      spectator.component['handleOnClose'](true);
      expect(dialogRef.close).toHaveBeenCalledWith(true);
    });
  });
});
