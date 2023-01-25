import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

import { createComponentFactory, Spectator } from '@ngneat/spectator';

import * as contextFunctions from './../functions/context-menu-functions';
import { OpenInTabComponent } from './open-in-tab.component';

describe('OpenInTabComponent', () => {
  let component: OpenInTabComponent;
  let spectator: Spectator<OpenInTabComponent>;

  const createComponent = createComponentFactory({
    component: OpenInTabComponent,
    imports: [CommonModule, MatButtonModule],
    declarations: [OpenInTabComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should call function', () => {
    const functionSpy = jest.spyOn(contextFunctions, 'openInNewTabByUrl');
    component.url = '123';
    component.openInTab();
    expect(functionSpy).toHaveBeenCalled();
  });
});
