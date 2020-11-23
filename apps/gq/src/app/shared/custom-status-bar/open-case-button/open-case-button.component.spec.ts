import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { OpenCaseButtonComponent } from './open-case-button.component';

describe('OpenCaseButtonComponent', () => {
  let component: OpenCaseButtonComponent;
  let spectator: Spectator<OpenCaseButtonComponent>;

  const createComponent = createComponentFactory({
    component: OpenCaseButtonComponent,
    imports: [
      MatButtonModule,
      MatIconModule,
      provideTranslocoTestingModule({}),
    ],
    declarations: [OpenCaseButtonComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
