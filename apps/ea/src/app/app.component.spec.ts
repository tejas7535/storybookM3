import { CUSTOM_ELEMENTS_SCHEMA, SimpleChange } from '@angular/core';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { APP_STATE_MOCK } from '@ea/testing/mocks/store';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoModule } from '@ngneat/transloco';
import { PushModule } from '@ngrx/component';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';

import { AppComponent } from './app.component';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@ngneat/transloco'),
  translate: jest.fn((translateKey) => translateKey),
}));

describe('AppComponent', () => {
  let component: AppComponent;
  let spectator: Spectator<AppComponent>;
  let store: any;

  const createComponent = createComponentFactory({
    component: AppComponent,
    imports: [PushModule, RouterTestingModule, MatIconTestingModule],
    providers: [
      provideMockStore({
        initialState: { ...APP_STATE_MOCK },
      }),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    store = spectator.inject(Store);
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch store actions on changing inputs', () => {
    store.dispatch = jest.fn();

    component.ngOnChanges({
      bearingDesignation: {
        currentValue: 'abc',
        firstChange: true,
        previousValue: undefined,
      } as SimpleChange,
      standalone: {
        currentValue: 'true',
        firstChange: true,
        previousValue: undefined,
      } as SimpleChange,
    });

    expect(store.dispatch).toHaveBeenCalledTimes(2);
  });
});
