import { APP_STATE_MOCK } from '@ea/testing/mocks/store';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';
import { MockModule } from 'ng-mocks';

import { AppComponent } from './app.component';
import { CalculationParametersComponent } from './features/calculation-parameters/calculation-parameters';
import { FormFieldModule } from './shared/form-field';

describe('AppComponent', () => {
  let component: AppComponent;
  let spectator: Spectator<AppComponent>;

  const createComponent = createComponentFactory({
    component: AppComponent,
    imports: [
      PushModule,
      CalculationParametersComponent,

      MockModule(FormFieldModule),
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
