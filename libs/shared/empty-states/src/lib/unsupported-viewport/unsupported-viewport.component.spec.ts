import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';

import { TranslocoModule } from '@ngneat/transloco';
import { configureTestSuite } from 'ng-bullet';

import { UnsupportedViewportComponent } from './unsupported-viewport.component';

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
});
