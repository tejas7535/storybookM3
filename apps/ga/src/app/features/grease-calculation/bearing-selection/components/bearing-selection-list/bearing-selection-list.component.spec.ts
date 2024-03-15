import { MatListModule } from '@angular/material/list';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { LetDirective } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockDirective, MockModule } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { selectBearing } from '@ga/core/store';

import { BearingSelectionListComponent } from './bearing-selection-list.component';

describe('BearingSelectionListComponent', () => {
  let component: BearingSelectionListComponent;
  let spectator: Spectator<BearingSelectionListComponent>;
  let store: MockStore;

  const createComponent = createComponentFactory({
    component: BearingSelectionListComponent,
    imports: [
      RouterTestingModule,
      provideTranslocoTestingModule({ en: {} }),
      MockDirective(LetDirective),
      MockModule(MatListModule),
    ],
    providers: [provideMockStore()],
    declarations: [BearingSelectionListComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    store = spectator.inject(MockStore);

    store.dispatch = jest.fn();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('selectBearing', () => {
    test('should trigger bearingSelection emit event with a bearing id', () => {
      const mockBearing = {
        id: 'mockId',
        title: 'mockTitle',
      };

      component.selectBearing(mockBearing);
      expect(store.dispatch).toHaveBeenCalledWith(
        selectBearing({ bearing: 'mockId' })
      );
    });
  });
});
