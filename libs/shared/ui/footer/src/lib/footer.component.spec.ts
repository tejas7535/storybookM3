import { Component, DebugElement } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { FooterComponent } from './footer.component';
import { FooterLink } from './footer-link.model';

@Component({
  template: `<schaeffler-footer><div>Hello World</div></schaeffler-footer>`,
})
class TestHostComponent {}

describe('FooterComponent', () => {
  let spectator: Spectator<FooterComponent>;
  let component: FooterComponent;
  let compiled: HTMLElement;

  const createComponent = createComponentFactory({
    component: FooterComponent,
    declarations: [TestHostComponent],
    imports: [RouterTestingModule],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    compiled = spectator.debugElement.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('template test', () => {
    it('should display a footer', () => {
      spectator.detectChanges();
      expect(compiled.querySelector('footer')).toBeTruthy();
    });

    it('should have a div for the version within the footer', () => {
      component.appVersion = '1.0.0';
      spectator.detectChanges();
      expect(spectator.debugElement.query(By.css('#version'))).toBeTruthy();
    });

    it('should have no div for the version within the footer', () => {
      spectator.detectChanges();
      expect(spectator.debugElement.query(By.css('#version'))).toBeFalsy();
    });

    it('should have ONE separator between ONE footerLink and version', () => {
      component.appVersion = '1.0.0';
      component.footerLinks = [
        new FooterLink('awesome.dev', 'Eya im here', true),
      ];
      spectator.detectChanges();

      const footerLinkSeparators = spectator.debugElement
        .queryAll(By.css('span.separator'))
        .filter((element) => element.nativeElement.innerHTML === '|');

      expect(footerLinkSeparators.length).toEqual(1);
    });

    it('should have TWO separators between TWO footerLinks and version', () => {
      component.appVersion = '1.0.0';
      component.footerLinks = [
        new FooterLink('awesome.dev', 'Eya im here', true),
        new FooterLink('Im-hungry.food', 'Get food here', true),
      ];
      spectator.detectChanges();

      const footerLinkSeparators = spectator.debugElement
        .queryAll(By.css('span.separator'))
        .filter((element) => element.nativeElement.innerHTML === '|');

      expect(footerLinkSeparators.length).toEqual(2);
    });

    it('should have no separator when only version is given and empty footerLinks', () => {
      component.appVersion = '1.0.0';
      component.footerLinks = [];
      spectator.detectChanges();

      const footerLinkSeparators = spectator.debugElement
        .queryAll(By.css('div.footer-content span'))
        .filter((element) => element.nativeElement.innerHTML === '|');

      expect(footerLinkSeparators.length).toEqual(0);
    });

    it('should have no separator when only version is given', () => {
      component.appVersion = '1.0.0';
      spectator.detectChanges();

      const footerLinkSeparators = spectator.debugElement
        .queryAll(By.css('div.footer-content span'))
        .filter((element) => element.nativeElement.innerHTML === '|');

      expect(footerLinkSeparators.length).toEqual(0);
    });

    it('should have no separator when  no version and no footerLinks', () => {
      spectator.detectChanges();

      const footerLinkSeparators = spectator.debugElement
        .queryAll(By.css('div.footer-content span'))
        .filter((element) => element.nativeElement.innerHTML === '|');

      expect(footerLinkSeparators.length).toEqual(0);
    });

    it('should have a external link in the footer', () => {
      component.footerLinks = [
        new FooterLink('hothotstuff.xyz', 'XXX Content', true),
      ];
      spectator.detectChanges();
      expect(spectator.debugElement.query(By.css('a'))).toBeTruthy();
    });

    it('should have a internal link in the footer', () => {
      component.footerLinks = [
        new FooterLink('/boring-corporate-stuff', 'I am fallin asleep', false),
      ];
      spectator.detectChanges();
      expect(
        spectator.debugElement.query(By.css('.footer-link-internal'))
      ).toBeTruthy();
    });
    it('should render a custom element with the ng-content area', () => {
      const dummyComponent = TestBed.createComponent(TestHostComponent);
      const el: DebugElement = dummyComponent.debugElement.query(By.css('div'));
      expect(el.nativeElement.textContent).toEqual('Hello World');
    });
  });

  describe('trackByFn()', () => {
    it('should return the loop index to track usersArray', () => {
      const indexNum = 1337;
      const retId = component.trackByFn(indexNum);
      expect(retId).toEqual(indexNum);
    });
  });
});
