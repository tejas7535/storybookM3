import { fakeAsync, tick } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { Subject } from 'rxjs';

import { StaticHTMLService } from '@ea/core/services/static-html.service';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockModule } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { CalculationDisclaimerComponent } from './calculation-disclaimer.component';

describe('CalculationDisclaimerComponent', () => {
  let component: CalculationDisclaimerComponent;
  let spectator: Spectator<CalculationDisclaimerComponent>;
  let sanitizer: DomSanitizer;

  const dialogRefMock = {
    close: jest.fn(),
  };

  const staticHTMLServiceMock = {
    getHtmlContentByTranslationKey: jest.fn(),
  };

  const htmlContentSubject$ = new Subject<string>();

  staticHTMLServiceMock.getHtmlContentByTranslationKey.mockReturnValue(
    htmlContentSubject$.asObservable()
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
      {
        provide: MAT_DIALOG_DATA,
        useValue: { isDownstreamDisclaimer: true },
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    sanitizer = spectator.inject(DomSanitizer);
    htmlContentSubject$.next('Hello World');

    Element.prototype.scrollIntoView = jest.fn();
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

  it('should  scroll to downstream section if isDownstream is true', fakeAsync(() => {
    jest.spyOn(component, 'scrollToDownstreamSection');
    const sanitizedContent: SafeHtml = sanitizer.bypassSecurityTrustHtml(
      '<div id="downstreamSection">Content</div>'
    );
    htmlContentSubject$.next(sanitizedContent as string);

    spectator.detectChanges();

    tick();
    expect(Element.prototype.scrollIntoView).toBeCalledWith({
      behavior: 'smooth',
      block: 'start',
    });
  }));
});
