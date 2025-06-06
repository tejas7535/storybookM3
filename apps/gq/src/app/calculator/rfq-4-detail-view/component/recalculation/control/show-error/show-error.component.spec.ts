import { ValidationErrors } from '@angular/forms';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { ShowErrorComponent } from './show-error.component';

describe('ShowErrorComponent', () => {
  let component: ShowErrorComponent;
  let spectator: Spectator<ShowErrorComponent>;

  const createComponent = createComponentFactory({
    component: ShowErrorComponent,
    imports: [provideTranslocoTestingModule({ en: {} })],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        errors: { required: true } as ValidationErrors,
      },
    });
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
