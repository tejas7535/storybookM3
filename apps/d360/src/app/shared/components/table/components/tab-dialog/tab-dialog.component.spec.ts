import { Stub } from '../../../../test/stub.class';
import { TabAction } from '../../enums';
import { TabDialogComponent } from './tab-dialog.component';

describe('TabDialogComponent', () => {
  let component: TabDialogComponent;

  beforeEach(() => {
    component = Stub.getForEffect<TabDialogComponent>({
      component: TabDialogComponent,
      providers: [
        Stub.getMatDialogDataProvider({
          title: 'Test Title',
          layoutId: { id: 1, text: 'Layout 1' },
          layouts: [
            { id: 1, text: 'Layout 1' },
            { id: 2, text: 'Layout 2' },
          ],
          action: TabAction.Edit,
        }),
        Stub.getMatDialogProvider(),
      ],
    });
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set the title value in the form if data.title is provided', () => {
      component['data'] = { title: 'Test Title' } as any;

      component.ngOnInit();

      expect(component['form'].get('title')?.value).toBe('Test Title');
    });

    it('should set the layoutId to the first layout if action is TabAction.Add', () => {
      const mockLayouts = [
        { id: 1, text: 'Layout 1' },
        { id: 2, text: 'Layout 2' },
      ];
      component['data'] = {
        layouts: mockLayouts,
        action: TabAction.Add,
      } as any;

      component.ngOnInit();

      expect(component['form'].get('layoutId')?.value).toEqual({
        id: 1,
        text: 'Layout 1',
      });
      expect(component['form'].get('layoutId')?.disabled).toBe(false);
    });

    it('should set the layoutId to the provided layoutId and disable the field if action is TabAction.Edit', () => {
      const mockLayouts = [
        { id: 1, text: 'Layout 1' },
        { id: 2, text: 'Layout 2' },
      ];
      component['data'] = {
        layouts: mockLayouts,
        layoutId: { id: 2, text: 'Layout 2' },
        action: TabAction.Edit,
      } as any;

      component.ngOnInit();

      expect(component['form'].get('layoutId')?.value).toEqual({
        id: 2,
        text: 'Layout 2',
      });
      expect(component['form'].get('layoutId')?.disabled).toBe(true);
    });

    it('should not throw an error if layouts are not provided', () => {
      component['data'] = { action: TabAction.Add };

      expect(() => component.ngOnInit()).not.toThrow();
    });
  });

  describe('onSave', () => {
    it('should close the dialog with form values if the form is valid', () => {
      const closeSpy = jest.spyOn(component.dialogRef, 'close');
      component['form'].get('title')?.setValue('Test Title');
      component['form'].get('layoutId')?.setValue({ id: 1, text: 'Layout 1' });

      component['onSave']();

      expect(closeSpy).toHaveBeenCalledWith({
        title: 'Test Title',
        layoutId: 1,
      });
    });

    it('should not close the dialog if the form is invalid', () => {
      const closeSpy = jest.spyOn(component.dialogRef, 'close');
      component['form'].get('title')?.setValue(null); // Invalid form

      component['onSave']();

      expect(closeSpy).not.toHaveBeenCalled();
    });

    it('should mark all form fields as touched if the form is invalid', () => {
      const markAllAsTouchedSpy = jest.spyOn(
        component['form'],
        'markAllAsTouched'
      );
      component['form'].get('title')?.setValue(null); // Invalid form

      component['onSave']();

      expect(markAllAsTouchedSpy).toHaveBeenCalled();
    });
  });
});
