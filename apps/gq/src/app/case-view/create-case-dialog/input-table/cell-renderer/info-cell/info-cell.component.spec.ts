import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';

import { configureTestSuite } from 'ng-bullet';

import { InfoCellComponent } from './info-cell.component';

describe('InfoCellComponent', () => {
  let component: InfoCellComponent;
  let fixture: ComponentFixture<InfoCellComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [InfoCellComponent],
      imports: [MatIconModule],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('agInit', () => {
    test('should set params', () => {
      const params: any = {
        value: true,
      };
      component.agInit(params);

      expect(component.valid).toBeTruthy();
    });
  });
});
