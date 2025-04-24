import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { UserComponent } from './user.component';
import { UserSettingsModule } from './user-settings/user-settings.module';

describe('UserComponent', () => {
  let component: UserComponent;
  let store: MockStore;
  let spectator: Spectator<UserComponent>;

  const createComponent = createComponentFactory({
    component: UserComponent,
    detectChanges: false,
    imports: [
      PushPipe,
      UserSettingsModule,
      MatDividerModule,
      MatDialogModule,
      MatIconModule,
      MatButtonModule,
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [provideMockStore({})],
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
});
