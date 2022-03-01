import { ReactiveFormsModule } from '@angular/forms';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';

import { of } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';

import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { SearchAutocompleteModule } from '@schaeffler/search-autocomplete';

import { BEARING } from '../../shared/constants/tracking-names';
import { BEARING_SEARCH_RESULT_MOCK } from './../../../testing/mocks/rest.service.mock';
import { RestService } from './../../core/services/rest/rest.service';
import { BearingSearchComponent } from './bearing-search.component';

describe('BearingSearchComponent', () => {
  let component: BearingSearchComponent;
  let spectator: Spectator<BearingSearchComponent>;

  const createComponent = createComponentFactory({
    component: BearingSearchComponent,
    imports: [
      ReactiveFormsModule,
      ReactiveComponentModule,
      SearchAutocompleteModule,
    ],
    providers: [
      {
        provide: RestService,
        useValue: {
          getBearingSearch: jest.fn(() => of(BEARING_SEARCH_RESULT_MOCK)),
        },
      },
      {
        provide: ApplicationInsightsService,
        useValue: {
          logEvent: jest.fn(),
        },
      },
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
      },
    ],
    declarations: [BearingSearchComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#ngOnInit', () => {
    it('should set value if selectedBearing is set', () => {
      component.myControl.setValue = jest.fn();
      component.selectedBearing = { id: 'id', title: 'bearing' };

      component.ngOnInit();

      expect(component.myControl.setValue).toHaveBeenCalledWith({
        id: 'id',
        title: 'bearing',
      });
    });
  });

  describe('#getBearings', () => {
    it('should call getBearings at restService', () => {
      const mockSearchQuery = 'irgendNQuatsch';

      component.getBearings(mockSearchQuery).subscribe((response) => {
        expect(response).toEqual([{ title: 'entryTitle', id: 'entryId' }]);
        expect(component['restService'].getBearingSearch).toHaveBeenCalledWith(
          mockSearchQuery
        );
      });
    });
  });

  describe('#handleSelection', () => {
    it('should emit the bearing and track Bearing select event', () => {
      const mockSelectionId = 'mockAutoCompleteId';
      const mockBearingName = 'mockBearingName';

      component.myControl.setValue({
        title: mockBearingName,
        id: mockSelectionId,
      });

      const spy = jest.spyOn(component.bearing, 'emit');
      const trackBearingSelectionSpy = jest.spyOn(
        component,
        'trackBearingSelection'
      );

      component.handleSelection(mockSelectionId);

      expect(spy).toHaveBeenCalledWith('mockAutoCompleteId');
      expect(trackBearingSelectionSpy).toHaveBeenCalledWith(
        mockBearingName,
        mockSelectionId
      );
    });
  });

  describe('#trackBearingSelection', () => {
    it('should call the logEvent method', () => {
      const mockSelectionId = 'mockAutoCompleteId';
      const mockBearingName = 'mockBearingName';

      const trackingSpy = jest.spyOn(
        component['applicationInsightsService'],
        'logEvent'
      );

      component.trackBearingSelection(mockBearingName, mockSelectionId);

      expect(trackingSpy).toHaveBeenCalledWith(BEARING, {
        name: mockBearingName,
        id: mockSelectionId,
      });
    });
  });
});
