import { of } from 'rxjs';

import { MessageType } from './../../../../../shared/models/message-type.enum';
import { Stub } from './../../../../../shared/test/stub.class';
import { InternalMaterialReplacementSingleDeleteModalComponent } from './internal-material-replacement-single-delete-modal.component';

describe('InternalMaterialReplacementSingleDeleteModalComponent', () => {
  let component: InternalMaterialReplacementSingleDeleteModalComponent;

  beforeEach(() => {
    component = Stub.get({
      component: InternalMaterialReplacementSingleDeleteModalComponent,
      providers: [Stub.getMatDialogDataProvider({ id: 1, name: 'Test' })],
    });
  });

  describe('deleteEntry', () => {
    it('should not call deleteIMRSubstitution if imrSubstitution is not defined', () => {
      component['imrSubstitution'] = null;
      const spy = jest.spyOn(component['imrService'], 'deleteIMRSubstitution');
      component['deleteEntry']();
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
      const imrService = component['imrService'];
      const snackbarService = component['snackbarService'];
      const dialogRef = component['dialogRef'];

      jest
        .spyOn(imrService, 'deleteIMRSubstitution')
        .mockReturnValue(of(mockResponse));
      jest.spyOn(snackbarService, 'openSnackBar');
      jest.spyOn(dialogRef, 'close');
      jest.spyOn(component as any, 'handleOnClose');

      component['deleteEntry']();

      expect(imrService.deleteIMRSubstitution).toHaveBeenCalledWith(
        component['imrSubstitution'],
        false
      );
      expect(snackbarService.openSnackBar).toHaveBeenCalledWith(
        'generic.validation.save.success'
      );
      expect(component['handleOnClose']).toHaveBeenCalledWith(true);
      expect(dialogRef.close).toHaveBeenCalledWith(true);
    });

    it('should call deleteIMRSubstitution and handle error', () => {
      const mockResponse = {
        overallStatus: MessageType.Error,
        overallErrorMsg: 'This is an error',
        response: [],
      } as any;
      const imrService = component['imrService'];
      const snackbarService = component['snackbarService'];
      const dialogRef = component['dialogRef'];

      jest
        .spyOn(imrService, 'deleteIMRSubstitution')
        .mockReturnValue(of(mockResponse));
      jest.spyOn(snackbarService, 'openSnackBar');
      jest.spyOn(dialogRef, 'close');
      jest.spyOn(component as any, 'handleOnClose');

      component['deleteEntry']();

      expect(imrService.deleteIMRSubstitution).toHaveBeenCalledWith(
        component['imrSubstitution'],
        false
      );
      expect(snackbarService.openSnackBar).toHaveBeenCalled();
      expect(component['handleOnClose']).toHaveBeenCalledWith(false);
      expect(dialogRef.close).toHaveBeenCalledWith(false);
    });
  });

  describe('handleOnClose', () => {
    it('should close the dialog with the provided value', () => {
      jest.spyOn(component['dialogRef'], 'close');
      component['handleOnClose'](true);
      expect(component['dialogRef'].close).toHaveBeenCalledWith(true);
    });
  });
});
