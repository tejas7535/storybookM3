import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { provideMockStore } from '@ngrx/store/testing';

import { CmEquipmentComponent } from './cm-equipment.component';

describe('ConditionMeasuringEquipmentComponent', () => {
  let component: CmEquipmentComponent;
  let spectator: Spectator<CmEquipmentComponent>;

  const createComponent = createComponentFactory({
    component: CmEquipmentComponent,
    imports: [MatCardModule, MatTabsModule, MatIconModule],
    providers: [
      provideMockStore({
        initialState: {
          bearing: {
            loading: false,
            result: undefined,
          },
        },
      }),
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
    test('should return index', () => {
      const idx = 5;

      const result = component.trackByFn(idx, {});

      expect(result).toEqual(idx);
    });
  });
});
