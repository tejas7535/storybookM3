import { MatDialog } from '@angular/material/dialog';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { ReleaseButtonComponent } from './release-button.component';

describe('ReleaseButtonComponent', () => {
  let component: ReleaseButtonComponent;
  let spectator: Spectator<ReleaseButtonComponent>;

  const createComponent = createComponentFactory({
    component: ReleaseButtonComponent,
    imports: [provideTranslocoTestingModule({})],
    providers: [{ provide: MatDialog, useValue: {} }],
    detectChanges: false,
  });

  beforeEach(async () => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  test('openDialog', () => {
    const open = jest.fn();
    component['dialog'].open = open;

    component.openDialog();

    expect(open).toHaveBeenCalledTimes(1);
  });
});
