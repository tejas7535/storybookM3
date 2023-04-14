import { MatIconTestingModule } from '@angular/material/icon/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { APP_STATE_MOCK } from '@ea/testing/mocks/store';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoModule } from '@ngneat/transloco';
import { PushModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';
import { MockModule } from 'ng-mocks';

import { AppComponent } from './app.component';
import { FormFieldModule } from './shared/form-field';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@ngneat/transloco'),
  translate: jest.fn((translateKey) => translateKey),
}));

describe('AppComponent', () => {
  let component: AppComponent;
  let spectator: Spectator<AppComponent>;

  const createComponent = createComponentFactory({
    component: AppComponent,
    imports: [
      PushModule,
      RouterTestingModule,
      MockModule(FormFieldModule),
      MatIconTestingModule,
    ],
    providers: [
      provideMockStore({
        initialState: { ...APP_STATE_MOCK },
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });
});
