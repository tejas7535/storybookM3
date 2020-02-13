import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HAMMER_LOADER } from '@angular/platform-browser';

import { Icon, IconModule } from '@schaeffler/shared/ui-components';

import { configureTestSuite } from 'ng-bullet';

import { TooltipComponent } from './tooltip.component';

describe('TooltipComponent', () => {
  let component: TooltipComponent;
  let fixture: ComponentFixture<TooltipComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [TooltipComponent],
      imports: [MatButtonModule, MatTooltipModule, IconModule],
      providers: [
        {
          provide: HAMMER_LOADER,
          useValue: async () => new Promise(() => {})
        }
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getMaterialIcon', () => {
    it('should return sth of type Icon', () => {
      const mockIcon = 'test-icon';
      const mockedComposedIcon: Icon = {
        icon: mockIcon,
        materialIcon: false
      };

      expect(component.getIcon(mockIcon)).toEqual(mockedComposedIcon);
    });
  });
});
