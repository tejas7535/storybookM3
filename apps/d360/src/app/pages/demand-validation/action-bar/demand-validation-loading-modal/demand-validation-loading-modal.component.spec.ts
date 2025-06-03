import { of, throwError } from 'rxjs';

import { Stub } from './../../../../shared/test/stub.class';
import { DemandValidationLoadingModalComponent } from './demand-validation-loading-modal.component';

describe('DemandValidationLoadingModalComponent', () => {
  let component: DemandValidationLoadingModalComponent;

  beforeEach(() => {
    component = Stub.get<DemandValidationLoadingModalComponent>({
      component: DemandValidationLoadingModalComponent,
      providers: [
        Stub.getMatDialogDataProvider({
          textWhileLoading: 'Loading...',
          onInit: jest.fn().mockReturnValue(of(null)),
          onClose: jest.fn(),
        }),
        Stub.getMatDialogProvider(),
      ],
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call onInit function when component initializes', () => {
    const mockOnInit = jest.fn().mockReturnValue(of(null));
    (component as any)['data'] = {
      onInit: mockOnInit,
    };

    component.ngOnInit();

    expect(mockOnInit).toHaveBeenCalled();
  });

  it('should close dialog on successful completion', () => {
    const mockDialogRef = jest.spyOn(component['dialogRef'], 'close');
    component.ngOnInit();

    expect(mockDialogRef).toHaveBeenCalled();
  });

  it('should call onClose callback on successful completion', () => {
    const mockOnClose = jest.fn();
    (component as any)['data'] = {
      onInit: jest.fn().mockReturnValue(of(null)),
      onClose: mockOnClose,
    };

    component.ngOnInit();

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should handle errors and show snackbar message', () => {
    const mockError = new Error('Test error');
    const mockOnInit = jest.fn().mockReturnValue(throwError(() => mockError));
    (component as any)['data'] = {
      onInit: mockOnInit,
    };
    const snackbarService = component['snackbarService'];
    jest.spyOn(snackbarService, 'openSnackBar');

    expect(() => component.ngOnInit()).not.toThrow();
    expect(snackbarService.openSnackBar).toHaveBeenCalled();
  });
});
