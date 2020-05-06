import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { configureTestSuite } from 'ng-bullet';

import { SharedModule } from '../../../shared/shared.module';
import { RangeFilterComponent } from './range-filter.component';

describe('RangeFilterComponent', () => {
  let component: RangeFilterComponent;
  let fixture: ComponentFixture<RangeFilterComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [RangeFilterComponent],
      imports: [NoopAnimationsModule, SharedModule],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RangeFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
