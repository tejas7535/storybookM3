import { ReactiveFormsModule } from '@angular/forms';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';

import { of } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushModule } from '@ngrx/component';

import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

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
      PushModule,
      provideTranslocoTestingModule({ en: {} }),
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
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#getBearings', () => {
    it('should call getBearings at restService', () => {
      const mockSearchQuery = 'irgendNQuatsch';

      component.getBearings(mockSearchQuery);

      component.options$.subscribe((value) =>
        expect(value).toEqual([{ title: 'entryTitle', id: 'entryId' }])
      );

      expect(component['restService'].getBearingSearch).toHaveBeenCalledWith(
        mockSearchQuery
      );
    });
  });

  describe('#onOptionSelected', () => {
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

      component.onOptionSelected({
        id: mockSelectionId,
        title: mockBearingName,
      });

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
