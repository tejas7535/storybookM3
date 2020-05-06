import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTestSuite } from 'ng-bullet';

import { SharedModule } from '../../shared/shared.module';
import { ReferenceTypesTableComponent } from './reference-types-table.component';

describe('ReferenceTypesTableComponent', () => {
  let component: ReferenceTypesTableComponent;
  let fixture: ComponentFixture<ReferenceTypesTableComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [ReferenceTypesTableComponent],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferenceTypesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
