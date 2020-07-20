import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTestSuite } from 'ng-bullet';

import { BomTabComponent } from './bom-tab.component';

describe('BomTabComponent', () => {
  let component: BomTabComponent;
  let fixture: ComponentFixture<BomTabComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [BomTabComponent],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BomTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
