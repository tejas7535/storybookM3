import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { provideMockStore } from '@ngrx/store/testing';

import { BearingComponent } from './bearing.component';

describe('BearingComponent', () => {
  let component: BearingComponent;
  let spectator: Spectator<BearingComponent>;

  const createComponent = createComponentFactory({
    component: BearingComponent,
    imports: [RouterTestingModule, MatTabsModule, MatIconModule],
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
    declarations: [BearingComponent],
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
