import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import {
  provideTranslocoTestingModule,
  SharedTranslocoModule,
} from '@schaeffler/transloco';

import { clearRowData } from '../../../core/store';
import { ResetAllButtonComponent } from './reset-all-button.component';

describe('ResetAllButtonComponent', () => {
  let component: ResetAllButtonComponent;
  let spectator: Spectator<ResetAllButtonComponent>;
  let mockStore: MockStore;

  const createComponent = createComponentFactory({
    component: ResetAllButtonComponent,
    declarations: [ResetAllButtonComponent],
    imports: [
      CommonModule,
      SharedTranslocoModule,
      MatButtonModule,
      MatIconModule,
      ReactiveComponentModule,
      provideTranslocoTestingModule({}),
    ],
    providers: [provideMockStore({})],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    mockStore = spectator.inject(MockStore);
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('resetAll', () => {
    test('should dispatch action', () => {
      mockStore.dispatch = jest.fn();
      component.resetAll();
      expect(mockStore.dispatch).toHaveBeenCalledWith(clearRowData());
    });
  });
});
