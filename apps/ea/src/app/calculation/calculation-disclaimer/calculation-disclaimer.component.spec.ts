import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconTestingModule } from '@angular/material/icon/testing';

import { of } from 'rxjs';

import { StaticHTMLService } from '@ea/core/services/static-html.service';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockModule } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { CalculationDisclaimerComponent } from './calculation-disclaimer.component';

describe('CalculationDisclaimerComponent', () => {
  let component: CalculationDisclaimerComponent;
  let spectator: Spectator<CalculationDisclaimerComponent>;

  const dialogRefMock = {
    close: jest.fn(),
  };

  const staticHTMLServiceMock = {
    getHtmlContentByTranslationKey: jest.fn(),
  };

  staticHTMLServiceMock.getHtmlContentByTranslationKey.mockImplementation(() =>
    of('Hello World')
  );

  const createComponent = createComponentFactory({
    component: CalculationDisclaimerComponent,
    imports: [
      MockModule(MatButtonModule),
      MatIconTestingModule,
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      { provide: MatDialogRef, useValue: dialogRefMock },
      { provide: StaticHTMLService, useValue: staticHTMLServiceMock },
    ],
  });

  beforeEach(async () => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    spectator.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close the dialog', () => {
    component.closeDialog();
    expect(dialogRefMock.close).toHaveBeenCalled();
  });

  it('should render provided HTML', () => {
    expect(
      staticHTMLServiceMock.getHtmlContentByTranslationKey
    ).toHaveBeenCalled();
    expect(spectator.element.innerHTML).toContain('Hello World');
  });
});
