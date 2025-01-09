import { of } from 'rxjs';

import { CalculationSelectionFacade } from '@mm/core/store/facades/calculation-selection/calculation-selection.facade';
import { BEARING } from '@mm/shared/constants/tracking-names';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';

import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { StringOption } from '@schaeffler/inputs';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { BearingSearchComponent } from './bearing-search.component';

describe('BearingSearchComponent', () => {
  let spectator: Spectator<BearingSearchComponent>;
  let component: BearingSearchComponent;
  let calculationSelectionFacade: CalculationSelectionFacade;
  let applicationInsightsService: ApplicationInsightsService;

  const createComponent = createComponentFactory({
    component: BearingSearchComponent,
    imports: [PushPipe, provideTranslocoTestingModule({ en: {} })],
    providers: [
      {
        provide: ApplicationInsightsService,
        useValue: {
          logEvent: jest.fn(),
        },
      },
      {
        provide: CalculationSelectionFacade,
        useValue: {
          bearingResultList$: of([
            { id: '1', title: 'Bearing 1' },
            { id: '2', title: 'Bearing 2' },
          ]),
          resetBearingSelection: jest.fn(),
          searchBearing: jest.fn(),
        },
      },
    ],
    mocks: [ApplicationInsightsService],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    calculationSelectionFacade = spectator.inject(CalculationSelectionFacade);
    applicationInsightsService = spectator.inject(ApplicationInsightsService);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize bearingResultList$ correctly', () => {
    component.bearingResultList$.subscribe((result) => {
      expect(result).toEqual([
        { id: '1', title: 'Bearing 1' },
        { id: '2', title: 'Bearing 2' },
      ]);
    });
  });

  it('should call searchBearing when getBearings is called with valid query', () => {
    const searchQuery = 'bearing';
    component.getBearings(searchQuery);
    expect(calculationSelectionFacade.searchBearing).toHaveBeenCalledWith(
      searchQuery
    );
  });

  it('should call resetBearingSelection when getBearings is called with invalid query', () => {
    const searchQuery = 'b';
    component.getBearings(searchQuery);
    expect(calculationSelectionFacade.resetBearingSelection).toHaveBeenCalled();
  });

  it('should emit bearing id when onOptionSelected is called', () => {
    const selection: StringOption = { id: '1', title: 'Bearing 1' };
    jest.spyOn(component.bearing, 'emit');

    component.onOptionSelected(selection);

    expect(component.bearing.emit).toHaveBeenCalledWith('1');
  });

  it('should log event when trackBearingSelection is called', () => {
    const bearing = 'Bearing 1';
    const selectionId = '1';

    component.trackBearingSelection(bearing, selectionId);

    expect(applicationInsightsService.logEvent).toHaveBeenCalledWith(BEARING, {
      name: bearing,
      id: selectionId,
    });
  });
});
