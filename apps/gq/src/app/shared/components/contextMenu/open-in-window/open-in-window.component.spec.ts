import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

import { createComponentFactory, Spectator } from '@ngneat/spectator';

import * as contextFunctions from './../functions/context-menu-functions';
import { OpenInWindowComponent } from './open-in-window.component';

describe('OpenInWindowComponent', () => {
  let component: OpenInWindowComponent;
  let spectator: Spectator<OpenInWindowComponent>;

  const createComponent = createComponentFactory({
    component: OpenInWindowComponent,
    imports: [CommonModule, MatButtonModule],
    declarations: [OpenInWindowComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should call function', () => {
    const functionSpy = jest.spyOn(contextFunctions, 'openInNewWindowByUrl');
    component.url = '123';
    component.openInWindow();
    expect(functionSpy).toHaveBeenCalled();
  });
});
