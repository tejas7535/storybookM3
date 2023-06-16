import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import * as contextFunctions from './../functions/context-menu-functions';
import { OpenInWindowComponent } from './open-in-window.component';

describe('OpenInWindowComponent', () => {
  let component: OpenInWindowComponent;
  let spectator: Spectator<OpenInWindowComponent>;

  const createComponent = createComponentFactory({
    component: OpenInWindowComponent,
    imports: [
      CommonModule,
      MatButtonModule,
      provideTranslocoTestingModule({ en: {} }),
    ],
    declarations: [OpenInWindowComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    jest.resetAllMocks();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should call function', () => {
    Object.assign(window, {
      open: jest.fn().mockImplementation(() => Promise.resolve()),
    });
    const functionSpy = jest.spyOn(contextFunctions, 'openInNewWindowByUrl');
    component.url = '123';
    component.openInWindow();
    expect(functionSpy).toHaveBeenCalled();
  });
  test('should not call function', () => {
    const functionSpy = jest.spyOn(contextFunctions, 'openInNewWindowByUrl');

    component.url = '';
    component.openInWindow();
    expect(functionSpy).not.toHaveBeenCalled();
  });
});
