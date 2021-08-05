import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { SnackBarService } from '@schaeffler/snackbar';
import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { ShareButtonComponent } from './share-button.component';

describe('ShareButtonComponent', () => {
  let component: ShareButtonComponent;
  let spectator: Spectator<ShareButtonComponent>;
  const createComponent = createComponentFactory({
    component: ShareButtonComponent,
    imports: [
      MatIconModule,
      provideTranslocoTestingModule({ en: {} }),
      MatTooltipModule,
      MatSnackBarModule,
    ],
    providers: [
      {
        provide: SnackBarService,
        useValue: {
          showSuccessMessage: jest.fn(),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('shareUrl', () => {
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

      expect(
        component['snackbarService'].showSuccessMessage
      ).toHaveBeenCalledWith('translate it', 'translate it');
    });
  });
});
