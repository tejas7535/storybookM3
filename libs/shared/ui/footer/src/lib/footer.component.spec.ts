import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

import { configureTestSuite } from 'ng-bullet';

import { FooterComponent } from './footer.component';

import { FooterLink } from './footer-link.model';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  let compiled: HTMLElement;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, RouterTestingModule],
      declarations: [FooterComponent],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    compiled = fixture.debugElement.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('template test', () => {
    it('should display a footer', () => {
      fixture.detectChanges();
      expect(compiled.querySelector('footer')).toBeTruthy();
    });

    it('should have a div for the version within the footer', () => {
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('#version'))).toBeTruthy();
    });

    it('should have a external ink in the footer', () => {
      component.footerLinks = [
        new FooterLink('hothotstuff.xyz', 'XXX Content', true),
      ];
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('a'))).toBeTruthy();
    });

    it('should have a internal ink in the footer', () => {
      component.footerLinks = [
        new FooterLink('/boring-corporate-stuff', 'I am fallin asleep', false),
      ];
      fixture.detectChanges();
      expect(
        fixture.debugElement.query(By.css('.footer-link-internal'))
      ).toBeTruthy();
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
