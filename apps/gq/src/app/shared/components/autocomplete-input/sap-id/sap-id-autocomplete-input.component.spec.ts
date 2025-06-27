import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { FilterNames } from '../filter-names.enum';
import { NoResultsFoundPipe } from '../pipes/no-results-found.pipe';
import { SapIdAutoCompleteInputComponent } from './sap-id-autocomplete-input.component';

describe('SapIdAutoCompleteInputComponent', () => {
  let spectator: Spectator<SapIdAutoCompleteInputComponent>;
  let component: SapIdAutoCompleteInputComponent;

  const createComponent = createComponentFactory({
    component: SapIdAutoCompleteInputComponent,
    declarations: [NoResultsFoundPipe],
    imports: [PushPipe, provideTranslocoTestingModule({ en: {} })],
    detectChanges: false,
  });

  beforeEach(() => {
    jest.resetAllMocks();
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should set correct filter name', () => {
    expect(component.filterName).toEqual(FilterNames.SAP_QUOTATION);
  });
});
