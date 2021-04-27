import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import {
  provideTranslocoTestingModule,
  SharedTranslocoModule,
} from '@schaeffler/transloco';

import { CreateCaseButtonComponent } from './create-case-button.component';

describe('CreateCaseButtonComponent', () => {
  let component: CreateCaseButtonComponent;
  let spectator: Spectator<CreateCaseButtonComponent>;
  let mockStore: MockStore;

  const createComponent = createComponentFactory({
    component: CreateCaseButtonComponent,
    declarations: [CreateCaseButtonComponent],
    imports: [
      CommonModule,
      SharedTranslocoModule,
      MatButtonModule,
      ReactiveComponentModule,
      provideTranslocoTestingModule({ en: {} }),
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

  describe('createCase', () => {
    test('should dispatch create case action', () => {
      mockStore.dispatch = jest.fn();

      component.createCase();

      expect(mockStore.dispatch).toHaveBeenCalledTimes(1);
    });
  });
});
