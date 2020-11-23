import { MatButtonModule } from '@angular/material/button';

import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { DeleteCaseButtonComponent } from './delete-case-button.component';

describe('DeleteCaseButtonComponent', () => {
  let component: DeleteCaseButtonComponent;
  let spectator: Spectator<DeleteCaseButtonComponent>;

  const createComponent = createComponentFactory({
    component: DeleteCaseButtonComponent,
    imports: [MatButtonModule, provideTranslocoTestingModule({})],
    declarations: [DeleteCaseButtonComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
