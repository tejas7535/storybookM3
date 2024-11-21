import { waitForAsync } from '@angular/core/testing';

import { firstValueFrom } from 'rxjs';

import { ErrorResponse } from '@lsa/shared/models';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import {
  BASE_TRANSLATION_PATH,
  ErrorContainerComponent,
} from './error-container.component';

const KNOWN_ERROR: ErrorResponse = {
  name: 'compatability.pressure',
  message: 'test',
};

const UNKWNON_ERROR: ErrorResponse = {
  name: 'unkown',
  message: 'Hello World',
};

describe('ErrorContainerComponent', () => {
  let spectator: Spectator<ErrorContainerComponent>;

  let translocoSpy: jest.SpyInstance;
  const createComponent = createComponentFactory({
    component: ErrorContainerComponent,
    imports: [provideTranslocoTestingModule({ en: {} })],
  });

  beforeEach(() => {
    spectator = createComponent({});
    translocoSpy = jest.spyOn(spectator.component['transloco'], 'translate');
  });

  it('should create the component', () => {
    spectator = createComponent();
    expect(spectator.component).toBeTruthy();
  });

  it('should fall back to default error message for unkown errors', waitForAsync(async () => {
    translocoSpy.mockReturnValue(BASE_TRANSLATION_PATH);

    spectator.component['responseSubject'].next(UNKWNON_ERROR);

    const message = await firstValueFrom(spectator.component.errorMessage);
    expect(message.title).toEqual(`${BASE_TRANSLATION_PATH}`);
    expect(message.body).toEqual(`${BASE_TRANSLATION_PATH}`);
  }));

  it('should show a more specific error message when possible', waitForAsync(async () => {
    translocoSpy.mockReturnValue('Hello World');

    spectator.component['responseSubject'].next(KNOWN_ERROR);

    const message = await firstValueFrom(spectator.component.errorMessage);
    expect(message.title).toEqual(`Hello World`);
    expect(message.body).toEqual(`Hello World`);
  }));
});
