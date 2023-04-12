import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { InfoIconModule } from '@gq/shared/components/info-icon/info-icon.module';
import { PasteMaterialsService } from '@gq/shared/services/paste-materials/paste-materials.service';
import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { PasteButtonComponent } from './paste-button.component';
import { PasteButtonParams } from './paste-button-params.model';

describe('PasteButtonComponent', () => {
  let component: PasteButtonComponent;
  let spectator: Spectator<PasteButtonComponent>;
  let matSnackBar: MatSnackBar;
  const pasteMaterialsService = {
    onPasteStart: jest.fn(),
  } as unknown as PasteMaterialsService;

  const createComponent = createComponentFactory({
    component: PasteButtonComponent,
    imports: [
      InfoIconModule,
      MatIconModule,
      MatButtonModule,
      provideTranslocoTestingModule({ en: {} }),
      MatSnackBarModule,
    ],
    providers: [
      { provide: PasteMaterialsService, useValue: pasteMaterialsService },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    matSnackBar = spectator.inject(MatSnackBar);
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('agInit', () => {
    test('should set isCaseView', () => {
      const params = {
        isCaseView: true,
      } as PasteButtonParams;
      component.isCaseView = false;

      component.agInit(params);

      expect(component.isCaseView).toBeTruthy();
    });
  });

  describe('pasteFromClipboard', () => {
    test('should call paste from clipboard', () => {
      component['pasteMaterialsService'].onPasteStart = jest.fn();

      component.pasteFromClipboard();

      expect(
        component['pasteMaterialsService'].onPasteStart
      ).toHaveBeenCalledWith(component.isCaseView);
    });
  });

  describe('displaySnackBar', () => {
    test('show info message with action link', () => {
      matSnackBar.open = jest.fn();

      component.displaySnackBar();

      expect(matSnackBar.open).toHaveBeenCalledWith(
        'translate it',
        'translate it',
        { duration: 5000 }
      );
    });
  });
});
