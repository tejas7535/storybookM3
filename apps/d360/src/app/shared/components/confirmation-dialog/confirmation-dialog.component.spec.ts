import { Stub } from '../../test/stub.class';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';

describe('ConfirmationDialogComponent', () => {
  let component: ConfirmationDialogComponent;
  let dataMock: {
    description: string;
    title?: string;
    hint?: string;
    buttonNo?: string;
    buttonYes?: string;
  };

  beforeEach(() => {
    dataMock = {
      description: 'Test Description',
      title: 'Test Title',
      hint: 'Test Hint',
      buttonNo: 'No',
      buttonYes: 'Yes',
    };

    component = Stub.get<ConfirmationDialogComponent>({
      component: ConfirmationDialogComponent,
      providers: [
        Stub.getMatDialogProvider(),
        Stub.getMatDialogDataProvider(dataMock),
      ],
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should inject data correctly', () => {
    expect(component.data).toEqual(dataMock);
  });

  describe('onClick', () => {
    it('should close the dialog with true', () => {
      jest.spyOn(component.dialogRef, 'close');
      component['onClick'](true);
      expect(component.dialogRef.close).toHaveBeenCalledWith(true);
    });

    it('should close the dialog with false', () => {
      jest.spyOn(component.dialogRef, 'close');
      component['onClick'](false);
      expect(component.dialogRef.close).toHaveBeenCalledWith(false);
    });
  });
});
