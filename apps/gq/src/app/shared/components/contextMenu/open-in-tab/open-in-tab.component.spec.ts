import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import * as contextFunctions from './../functions/context-menu-functions';
import { OpenInTabComponent } from './open-in-tab.component';

describe('OpenInTabComponent', () => {
  let component: OpenInTabComponent;
  let spectator: Spectator<OpenInTabComponent>;

  const createComponent = createComponentFactory({
    component: OpenInTabComponent,
    imports: [
      CommonModule,
      MatButtonModule,
      provideTranslocoTestingModule({ en: {} }),
    ],
    declarations: [OpenInTabComponent],
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

    const functionSpy = jest.spyOn(contextFunctions, 'openInNewTabByUrl');

    component.url = '123';
    component.openInTab();
    expect(functionSpy).toHaveBeenCalled();
  });

  test('should not call the funktion', () => {
    const functionSpy = jest.spyOn(contextFunctions, 'openInNewTabByUrl');

    component.url = '';
    component.openInTab();
    expect(functionSpy).not.toHaveBeenCalled();
  });
});
