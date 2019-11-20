import { configureTestSuite } from 'ng-bullet';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { TranslocoModule } from '@ngneat/transloco';

import { UserMenuComponent } from './user-menu.component';

describe('UserMenuComponent', () => {
  let component: UserMenuComponent;
  let fixture: ComponentFixture<UserMenuComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [MatIconModule, MatMenuModule, TranslocoModule],
      declarations: [UserMenuComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('clickItem', () => {
    it('should emit the clicked key', () => {
      const key = 'key';
      const spy = spyOn(component.clicked, 'emit');

      component.clickItem(key);

      expect(spy).toHaveBeenCalledWith(key);
    });
  });

  describe('trackByFn', () => {
    it('should return index', () => {
      const idx = 5;

      const result = component.trackByFn(idx);

      expect(result).toEqual(idx);
    });
  });
});
