import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { provideRouter, RouterOutlet } from '@angular/router';

import {
  createComponentFactory,
  Spectator,
  SpyObject,
} from '@ngneat/spectator/jest';
import { MockDirective } from 'ng-mocks';

import { EmptyStatesComponent } from './empty-states.component';

describe('EmptyStatesComponent', () => {
  let spectator: Spectator<EmptyStatesComponent>;
  let component: EmptyStatesComponent;
  let dialog: SpyObject<MatDialog>;

  const createComponent = createComponentFactory({
    component: EmptyStatesComponent,
    imports: [MatDialogModule, MockDirective(RouterOutlet)],
    providers: [provideRouter([])],
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
