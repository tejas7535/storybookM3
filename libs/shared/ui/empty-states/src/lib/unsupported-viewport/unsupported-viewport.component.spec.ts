import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';

import { configureTestSuite } from 'ng-bullet';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { UnsupportedViewportComponent } from './unsupported-viewport.component';

describe('UnsupportedViewportComponent', () => {
  let component: UnsupportedViewportComponent;
  let fixture: ComponentFixture<UnsupportedViewportComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [UnsupportedViewportComponent],
      imports: [provideTranslocoTestingModule({}), FlexLayoutModule],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnsupportedViewportComponent);
    component = fixture.componentInstance;
  });

  it('Should create a component', () => {
    expect(component).toBeTruthy();
  });
});
