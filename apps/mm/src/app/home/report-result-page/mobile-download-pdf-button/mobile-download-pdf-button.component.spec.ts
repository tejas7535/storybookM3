import { provideRouter } from '@angular/router';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { MobileDownloadPdfButtonComponent } from './mobile-download-pdf-button.component';

describe('MobileDownloadPdfButtonComponent', () => {
  let spectator: Spectator<MobileDownloadPdfButtonComponent>;
  let component: MobileDownloadPdfButtonComponent;

  const createComponent = createComponentFactory({
    component: MobileDownloadPdfButtonComponent,
    imports: [provideTranslocoTestingModule({ en: {} })],
    providers: [provideRouter([])],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('when isPdfGenerating is false', () => {
    beforeEach(() => {
      spectator.setInput('isPdfGenerating', false);
      spectator.detectChanges();
    });

    it('should enable the download button', () => {
      const button = spectator.query('button');
      expect(button).not.toBeDisabled();
    });

    it('should not display the spinner', () => {
      const spinner = spectator.query('mat-spinner');
      expect(spinner).not.toExist();
    });
  });

  describe('when isPdfGenerating is true', () => {
    beforeEach(() => {
      spectator.setInput('isPdfGenerating', true);
      spectator.detectChanges();
    });

    it('should disable the download button', () => {
      const button = spectator.query('button');
      expect(button).toBeDisabled();
    });

    it('should display the spinner', () => {
      const spinner = spectator.query('mat-spinner');
      expect(spinner).toExist();
    });
  });

  describe('when the download button is clicked', () => {
    it('should emit the downloadPdfClicked event', () => {
      const downloadClickSpy = jest.spyOn(component.downloadPdfClicked, 'emit');
      component.onDownloadPdfClicked();

      expect(downloadClickSpy).toHaveBeenCalled();
    });

    it('should call onDownloadPdfClicked when the button is clicked', () => {
      const onClickSpy = jest.spyOn(component, 'onDownloadPdfClicked');
      spectator.setInput('isPdfGenerating', false);
      spectator.detectChanges();

      spectator.click('button');

      expect(onClickSpy).toHaveBeenCalled();
    });
  });
});
