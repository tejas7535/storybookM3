import { HttpClient } from '@angular/common/http';

import { of } from 'rxjs';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';

import { GlobalSelectionHelperService } from '../../feature/global-selection/global-selection.service';
import { GlobalSelectionStateService } from '../../shared/components/global-selection-criteria/global-selection-state.service';
import { SelectableOptionsService } from '../../shared/services/selectable-options.service';
import { DemandValidationComponent } from './demand-validation.component';

jest.mock('@jsverse/transloco', () => ({
  translate: jest.fn((key, _) => `${key} mocked`),
}));

describe('DemandValidationComponent', () => {
  let component: DemandValidationComponent;
  let spectator: Spectator<DemandValidationComponent>;

  const createComponent = createComponentFactory({
    component: DemandValidationComponent,
    providers: [
      mockProvider(HttpClient, { get: () => of({}) }),
      mockProvider(SelectableOptionsService, {
        get: () => of({}),
        loading$: of(false),
      }),
      mockProvider(GlobalSelectionStateService),
      {
        provide: GlobalSelectionHelperService,
        useValue: {
          getGlobalSelection: jest.fn(),
          getCustomersData: jest.fn().mockReturnValue(of([])),
        },
      },
    ],
  });

  beforeEach(async () => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
