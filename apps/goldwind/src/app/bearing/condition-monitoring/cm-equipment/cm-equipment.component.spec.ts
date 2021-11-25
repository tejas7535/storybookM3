import { MatCardModule } from '@angular/material/card';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { provideMockStore } from '@ngrx/store/testing';

import { BearingMetadata } from '../../../core/store/reducers/bearing/models';
import { CmEquipmentComponent } from './cm-equipment.component';
import { TAB_TYPE } from './tabtype.enum';

describe('ConditionMeasuringEquipmentComponent', () => {
  let component: CmEquipmentComponent;
  let spectator: Spectator<CmEquipmentComponent>;

  const createComponent = createComponentFactory({
    component: CmEquipmentComponent,
    imports: [
      MatCardModule,
      MatTabsModule,
      MatIconModule,
      MatIconTestingModule,
    ],
    providers: [
      provideMockStore({
        initialState: {
          bearing: {
            loading: false,
            result: undefined,
          },
        },
      }),
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
      },
    ],
    declarations: [CmEquipmentComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('trackByFn', () => {
    it('should return index', () => {
      const idx = 5;

      const result = component.trackByFn(idx, {});

      expect(result).toEqual(idx);
    });
  });

  describe('getBearingMeta', () => {
    it('should return the meta', () => {
      component.mainBearing = {
        description: 'Test Description',
      } as BearingMetadata;

      expect(component.getBearingMeta('description')).toEqual(
        'Test Description'
      );
    });
  });

  describe('handleSelectedTabChange', () => {
    it('should return the meta', () => {
      const event = { tab: { textLabel: TAB_TYPE.LOAD } } as MatTabChangeEvent;
      component.handleSelectedTabChange(event);
      expect(component.selectedTab).toEqual(TAB_TYPE.LOAD);
    });
    it('a picture should be visible', () => {
      expect(spectator.query('.equipment-image > img')).toBeVisible();
    });
  });
});
