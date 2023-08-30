import { DialogRef } from '@angular/cdk/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

import { of } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoTestingModule } from '@ngneat/transloco';
import { PushPipe } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { FeedbackDialogComponent } from '../shared/dialogs/feedback-dialog/feedback-dialog.component';
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
      TranslocoTestingModule,
      UserSettingsModule,
      MatDividerModule,
      MatDialogModule,
      MatIconModule,
      MatButtonModule,
    ],
    providers: [
      provideMockStore({ initialState: { feedback: { loading: false } } }),
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
    ],
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

  describe('ngOnDestroy', () => {
    test('should unsubscribe', () => {
      component.subscription = of({}).subscribe();
      component.subscription.unsubscribe = jest.fn();

      component.ngOnDestroy();

      expect(component.subscription.unsubscribe).toHaveBeenCalled();
    });
  });

  describe('openFeedbackDialog', () => {
    test('should open dialog with configuration', () => {
      component['dialog'].open = jest.fn().mockReturnValue({
        componentInstance: { onFeebackSubmitted: of({}) },
      } as DialogRef);
      component.isSubmitInProgress$ = of(true);
      component.subscription = of({}).subscribe();
      component.subscription.unsubscribe = jest.fn();
      const expectedConifg: MatDialogConfig = {
        maxWidth: component.DIALOG_MAX_WIDTH,
        disableClose: true,
        data: {
          loading: component.isSubmitInProgress$,
        },
      };

      component.openFeedbackDialog();

      expect(component['dialog'].open).toHaveBeenCalledWith(
        FeedbackDialogComponent,
        expectedConifg
      );
      expect(component.subscription).toBeDefined();
    });
  });
});
