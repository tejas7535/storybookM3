import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { FilterNames } from '../filter-names.enum';
import { MaterialAutocompleteUtilsService } from '../material-autocomplete-utils.service';
import { NoResultsFoundPipe } from '../pipes/no-results-found.pipe';
import { MaterialNumberAutoCompleteInputComponent } from './material-number-autocomplete-input.component';

describe('MaterialNumberAutoCompleteInputComponent', () => {
  let spectator: Spectator<MaterialNumberAutoCompleteInputComponent>;
  let component: MaterialNumberAutoCompleteInputComponent;

  let materialUtils: MaterialAutocompleteUtilsService;

  const createComponent = createComponentFactory({
    component: MaterialNumberAutoCompleteInputComponent,
    declarations: [NoResultsFoundPipe],
    imports: [PushPipe, provideTranslocoTestingModule({ en: {} })],
    detectChanges: false,
    providers: [mockProvider(MaterialAutocompleteUtilsService)],
  });

  beforeEach(() => {
    jest.resetAllMocks();
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    materialUtils = spectator.inject(MaterialAutocompleteUtilsService);
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should set correct filter name', () => {
    expect(component.filterName).toEqual(FilterNames.MATERIAL_NUMBER);
  });

  describe('onPaste', () => {
    test('should set transformed and sliced number without dashes', () => {
      const materialNumber = '080024220000010';

      const event = {
        preventDefault: jest.fn(),
        clipboardData: {
          getData: (_data: string) => materialNumber,
        },
      };

      component.onPaste(event as unknown as ClipboardEvent);

      expect(component.formControl.value).toEqual('080024220-0000-10');
      expect(event.preventDefault).toHaveBeenCalled();
    });
    test('should set transformed and sliced number with dashes', () => {
      const materialNumber = '080024220-0000-10';

      const event = {
        preventDefault: jest.fn(),
        clipboardData: {
          getData: (_data: string) => materialNumber,
        },
      };

      component.onPaste(event as unknown as ClipboardEvent);

      expect(component.formControl.value).toEqual(materialNumber);
      expect(event.preventDefault).toHaveBeenCalled();
    });
  });

  describe('shouldEmitAutocomplete', () => {
    test('should call emitIsValidOnFormInput and the super method', () => {
      materialUtils.emitIsValidOnFormInput = jest.fn();

      const value = 'test';

      const result = component['shouldEmitAutocomplete'](value);

      expect(result).toBeTruthy();
      expect(materialUtils.emitIsValidOnFormInput).toHaveBeenCalledWith(
        value,
        component.isValid,
        component.formControl
      );
    });
  });
});
