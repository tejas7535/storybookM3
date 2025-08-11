import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvironmentEnum } from '../models/environment-enum';
import { Stub } from '../test/stub.class';
import { DisableOnProdDirective } from './disable-on-prod.directive';

@Component({
  template: `
    <div id="test-element" d360DisableOnProd>Test Content</div>
    <div id="control-element">Control Content</div>
  `,
  standalone: true,
  imports: [DisableOnProdDirective],
})
class TestComponent {}

describe('DisableOnProdDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let testElement: HTMLElement;
  let controlElement: HTMLElement;

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  describe('when environment is not production', () => {
    beforeEach(() => {
      component = Stub.getForEffect({
        component: TestComponent,
        providers: [
          Stub.getEnvProvider({
            production: false,
            environment: EnvironmentEnum.dev,
          }),
        ],
      });

      fixture = Stub.getFixture<TestComponent>();
      testElement =
        fixture.debugElement.nativeElement.querySelector('#test-element');
      controlElement =
        fixture.debugElement.nativeElement.querySelector('#control-element');
      Stub.detectChanges();
    });

    it('should create an instance', () => {
      expect(component).toBeTruthy();
    });

    it('should not hide element when production is false', () => {
      expect(testElement.style.display).not.toBe('none');
    });
  });

  describe('when environment is production', () => {
    beforeEach(() => {
      component = Stub.getForEffect({
        component: TestComponent,
        providers: [
          Stub.getEnvProvider({
            production: true,
            environment: EnvironmentEnum.prod,
          }),
        ],
      });

      fixture = Stub.getFixture<TestComponent>();
      testElement =
        fixture.debugElement.nativeElement.querySelector('#test-element');
      controlElement =
        fixture.debugElement.nativeElement.querySelector('#control-element');
      Stub.detectChanges();
    });

    it('should hide element when production is true', () => {
      expect(testElement.style.display).toBe('none');
      expect(controlElement.style.display).not.toBe('none');
    });
  });

  describe('when environment enum is prod regardless of production flag', () => {
    beforeEach(() => {
      component = Stub.getForEffect({
        component: TestComponent,
        providers: [
          Stub.getEnvProvider({
            production: false,
            environment: EnvironmentEnum.prod,
          }),
        ],
      });

      fixture = Stub.getFixture<TestComponent>();
      testElement =
        fixture.debugElement.nativeElement.querySelector('#test-element');
      Stub.detectChanges();
    });

    it('should hide element when environment enum is prod', () => {
      expect(testElement.style.display).toBe('none');
    });
  });
});
