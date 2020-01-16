import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTestSuite } from 'ng-bullet';

import { LegendComponent } from './legend.component';

describe('LegendComponent', () => {
  let component: LegendComponent;
  let fixture: ComponentFixture<LegendComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [LegendComponent],
      imports: []
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LegendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('trackByFn()', () => {
    it('should return the loop index to track usersArray', () => {
      const indexNum = 1337;
      const retId = component.trackByFn(indexNum);
      expect(retId).toEqual(indexNum);
    });
  });
});
