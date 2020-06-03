import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTestSuite } from 'ng-bullet';

import { GhostLineElementsComponent } from './ghost-line-elements.component';

describe('GhostLineElementsComponent', () => {
  let component: GhostLineElementsComponent;
  let fixture: ComponentFixture<GhostLineElementsComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [GhostLineElementsComponent],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GhostLineElementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('createArray', () => {
    test('should create empty array with correct length', () => {
      expect(component.createArray(3).length).toEqual(3);
    });
  });

  describe('trackByFn', () => {
    test('should return index', () => {
      const idx = 5;

      const result = component.trackByFn(idx, {});

      expect(result).toEqual(idx);
    });
  });
});
