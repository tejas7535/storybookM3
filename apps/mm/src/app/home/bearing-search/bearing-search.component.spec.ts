import { ReactiveFormsModule } from '@angular/forms';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';

import { of } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';

import { SearchAutocompleteModule } from '@schaeffler/search-autocomplete';

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
    it('should emit the bearing', () => {
      const mockSelectionId = 'mockAutoCompleteId';
      const spy = jest.spyOn(component.bearing, 'emit');

      component.handleSelection(mockSelectionId);

      expect(spy).toHaveBeenCalledWith('mockAutoCompleteId');
    });
  });
});
