import { of } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { GlobalSelectionHelperService } from '../../feature/global-selection/global-selection.service';
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
