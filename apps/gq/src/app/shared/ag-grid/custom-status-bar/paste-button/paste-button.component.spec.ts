import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { of } from 'rxjs';

import { CreateCaseFacade } from '@gq/core/store/create-case/create-case.facade';
import { InfoIconModule } from '@gq/shared/components/info-icon/info-icon.module';
import { PasteMaterialsService } from '@gq/shared/services/paste-materials/paste-materials.service';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { isCaseViewParams } from '../../models/is-case-view-params.model';
import { PasteButtonComponent } from './paste-button.component';

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
      mockProvider(CreateCaseFacade, {
        customerIdForCaseCreation$: of(),
      }),
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
      } as isCaseViewParams;
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
      ).toHaveBeenCalledWith(
        component.isCaseView,
        component.isNewCaseCreationView
      );
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
