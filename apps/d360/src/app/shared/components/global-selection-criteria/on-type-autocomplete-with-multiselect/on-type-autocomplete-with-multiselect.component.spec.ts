import { FormControl, FormGroup } from '@angular/forms';

import { of } from 'rxjs';

import { Stub } from '../../../test/stub.class';
import { OnTypeAutocompleteWithMultiselectComponent } from './on-type-autocomplete-with-multiselect.component';

describe('OnTypeAutocompleteWithMultiselectComponent', () => {
  let component: OnTypeAutocompleteWithMultiselectComponent;
  let dialogSpy: jest.SpyInstance;
  let dialogRefSpyObj: { afterClosed: jest.Mock };

  beforeEach(() => {
    component = Stub.getForEffect<OnTypeAutocompleteWithMultiselectComponent>({
      component: OnTypeAutocompleteWithMultiselectComponent,
      providers: [Stub.getMatDialogProvider()],
    });

    dialogRefSpyObj = { afterClosed: jest.fn().mockReturnValue(of(true)) };
    dialogSpy = jest
      .spyOn(component['dialog'], 'open')
      .mockReturnValue(dialogRefSpyObj as any);

    Stub.setInputs([
      { property: 'urlBegin', value: 'test' },
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
    it('should open dialog with correct parameters', () => {
      component.openModal();

      expect(dialogSpy).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          data: expect.objectContaining({
            control: component['control'](),
            form: component['form'](),
            autocompleteLabel: component['autocompleteLabel'](),
            getOptionLabel: component['getOptionLabel'](),
            getOptionLabelInTag: component['getOptionLabelInTag'](),
            optionsLoadingResults: component['optionsLoadingResult'](),
            selectableValuesByKeys: component['resolveFunction'](),
            entityName: component['entityName'](),
            entityNamePlural: component['entityNamePlural'](),
            urlBegin: component['urlBegin'](),
          }),
          maxWidth: '600px',
          autoFocus: false,
        })
      );
    });

    it('should handle dialog closed event', () => {
      const markForCheckSpy = jest.spyOn(
        component['changeDetectorRef'],
        'markForCheck'
      );

      component.openModal();

      expect(dialogRefSpyObj.afterClosed).toHaveBeenCalled();
      expect(markForCheckSpy).toHaveBeenCalled();
    });

    it('should subscribe to afterClosed observable', () => {
      const afterClosedSpy = jest.fn().mockReturnValue(of(true));
      jest.spyOn(component['dialog'], 'open').mockReturnValue({
        afterClosed: afterClosedSpy,
      } as any);

      component.openModal();

      expect(afterClosedSpy).toHaveBeenCalled();
    });
  });
});
