import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { configureTestSuite } from 'ng-bullet';

import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  let compiled;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [FooterComponent]
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
      expect(
        fixture.debugElement.query(By.css('.footer-version-and-copyright'))
      ).toBeTruthy();
    });
  });
});
