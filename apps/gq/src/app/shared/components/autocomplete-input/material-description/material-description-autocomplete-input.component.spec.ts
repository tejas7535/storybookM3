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
import { MaterialDescriptionAutoCompleteInputComponent } from './material-description-autocomplete-input.component';

describe('MaterialDescriptionAutoCompleteInputComponent', () => {
  let spectator: Spectator<MaterialDescriptionAutoCompleteInputComponent>;
  let component: MaterialDescriptionAutoCompleteInputComponent;

  let materialUtils: MaterialAutocompleteUtilsService;

  const createComponent = createComponentFactory({
    component: MaterialDescriptionAutoCompleteInputComponent,
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
    expect(component.filterName).toEqual(FilterNames.MATERIAL_DESCRIPTION);
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
