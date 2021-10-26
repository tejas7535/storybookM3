import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { ShareButtonComponent } from './share-button.component';

describe('ShareButtonComponent', () => {
  let component: ShareButtonComponent;
  let spectator: Spectator<ShareButtonComponent>;
  let snackBar: MatSnackBar;
  const createComponent = createComponentFactory({
    component: ShareButtonComponent,
    imports: [
      MatIconModule,
      provideTranslocoTestingModule({ en: {} }),
      MatTooltipModule,
      MatSnackBarModule,
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    snackBar = spectator.inject(MatSnackBar);
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('shareUrl', () => {
    beforeEach(() => {
      snackBar.open = jest.fn();
    });
    test('should copy url to clipboard', () => {
      delete window.location;
      const mockLocation = new URL(
        'https://www.example.com/'
      ) as unknown as Location;
      window.location = mockLocation;

      component['clipboard'].copy = jest.fn();

      component.shareUrl();

      expect(component['clipboard'].copy).toHaveBeenCalledWith(
        'https://www.example.com/'
      );
    });

    test('should show toast message', () => {
      component.shareUrl();

      expect(component['snackBar'].open).toHaveBeenCalledWith(
        'translate it',
        'translate it'
      );
    });
  });
});
