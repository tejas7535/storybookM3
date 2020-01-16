import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';

import { TranslocoModule } from '@ngneat/transloco';

import { configureTestSuite } from 'ng-bullet';

import {
  importer,
  UnsupportedViewportComponent
} from './unsupported-viewport.component';

import * as testJson from './i18n/en.json';

describe('UnsupportedViewportComponent', () => {
  let component: UnsupportedViewportComponent;
  let fixture: ComponentFixture<UnsupportedViewportComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [UnsupportedViewportComponent],
      imports: [TranslocoModule, FlexLayoutModule]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnsupportedViewportComponent);
    component = fixture.componentInstance;
  });

  it('Should create a component', () => {
    expect(component).toBeTruthy();
  });

  describe('importer', () => {
    test('should import language from root path', async () => {
      const result = await importer('en', 'i18n');

      expect(result).toEqual(testJson);
    });
  });
});
