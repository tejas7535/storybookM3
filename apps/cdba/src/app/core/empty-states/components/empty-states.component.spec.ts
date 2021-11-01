import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';

import { SpyObject } from '@ngneat/spectator';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { EmptyStatesComponent } from './empty-states.component';

describe('EmptyStatesComponent', () => {
  let spectator: Spectator<EmptyStatesComponent>;
  let component: EmptyStatesComponent;
  let dialog: SpyObject<MatDialog>;

  const createComponent = createComponentFactory({
    component: EmptyStatesComponent,
    imports: [RouterTestingModule, MatDialogModule],
    providers: [
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
      },
    ],
    mocks: [MatDialog],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    dialog = spectator.inject(MatDialog);
  });

  test('should be created', () => {
    expect(component).toBeTruthy();
  });

  test('should open the dialog', () => {
    component['forbiddenEventService'].forbiddenPageActionButtonClicked$.next();

    expect(dialog.open).toHaveBeenCalled();
  });

  test('should unsubscribe from subscription', () => {
    component['forbiddenPageActionButtonSubscription'].unsubscribe = jest.fn();
    component.ngOnDestroy();

    expect(
      component['forbiddenPageActionButtonSubscription'].unsubscribe
    ).toHaveBeenCalled();
  });
});
