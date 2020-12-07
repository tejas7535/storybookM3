import { CommonModule } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { ReactiveComponentModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { SharedTranslocoModule } from '@schaeffler/transloco';

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
    ],
    providers: [provideMockStore({})],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    mockStore = TestBed.inject(MockStore);
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
