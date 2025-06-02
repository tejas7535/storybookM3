import { FormControl, FormGroup } from '@angular/forms';

import { of } from 'rxjs';

import { Stub } from '../../../test/stub.class';
import { PreLoadedAutocompleteWithMultiselectComponent } from './pre-loaded-autocomplete-with-multiselect.component';

describe('PreLoadedAutocompleteWithMultiselectComponent', () => {
  let component: PreLoadedAutocompleteWithMultiselectComponent;

  beforeEach(() => {
    component =
      Stub.getForEffect<PreLoadedAutocompleteWithMultiselectComponent>({
        component: PreLoadedAutocompleteWithMultiselectComponent,
        providers: [Stub.getMatDialogProvider()],
      });

    Stub.setInputs([
      { property: 'resolveFunction', value: jest.fn() },
      { property: 'control', value: new FormControl() },
      { property: 'form', value: new FormGroup({}) },
      { property: 'autocompleteLabel', value: 'test' },
      { property: 'getOptionLabel', value: jest.fn() },
      { property: 'getOptionLabelInTag', value: jest.fn() },
      {
        property: 'optionsLoadingResult',
        value: {
          options: [],
          loading: false,
          loadingError: null,
        },
      },
      { property: 'entityName', value: 'test' },
      { property: 'entityNamePlural', value: 'tests' },
    ]);

    Stub.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('openModal', () => {
    let dialogSpy: jest.SpyInstance;
    let dialogRefSpyObj: { afterClosed: jest.Mock };

    beforeEach(() => {
      dialogRefSpyObj = { afterClosed: jest.fn().mockReturnValue(of(true)) };
      dialogSpy = jest
        .spyOn(component['dialog'], 'open')
        .mockReturnValue(dialogRefSpyObj as any);
      jest.spyOn(component.changeDetectorRef, 'markForCheck');
    });

    it('should open dialog with correct parameters', () => {
      component.openModal();

      expect(dialogSpy).toHaveBeenCalledWith(expect.any(Function), {
        data: {
          control: component.control(),
          form: component.form(),
          searchControl: component['searchFormControl'],
          autocompleteLabel: component.autocompleteLabel(),
          getOptionLabel: component.getOptionLabel(),
          getOptionLabelInTag: component.getOptionLabelInTag(),
          optionsLoadingResults: component.optionsLoadingResult(),
          selectableValuesByKeys: expect.any(Function),
          entityName: component.entityName(),
          entityNamePlural: component.entityNamePlural(),
        },
        maxWidth: '600px',
        autoFocus: false,
      });
    });

    it('should mark for check after dialog is closed', () => {
      component.openModal();

      expect(component.changeDetectorRef.markForCheck).toHaveBeenCalled();
    });

    it('should call resolveFunction when selectableValuesByKeys is called', () => {
      const mockValues = ['value1', 'value2'];
      const resolveFunctionSpy = jest.fn();
      Stub.setInputs([
        { property: 'resolveFunction', value: resolveFunctionSpy },
      ]);

      component.openModal();

      // Get the selectableValuesByKeys function from the dialog open call
      const selectableValuesByKeys =
        dialogSpy.mock.calls[0][1].data.selectableValuesByKeys;
      selectableValuesByKeys(mockValues);

      expect(resolveFunctionSpy).toHaveBeenCalledWith(
        mockValues,
        component.optionsLoadingResult().options
      );
    });
  });
});
