import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterTestingModule } from '@angular/router/testing';

import { provideMockStore } from '@ngrx/store/testing';
import { configureTestSuite } from 'ng-bullet';

import { initialState } from '../store/reducers/sidebar.reducer';
import { SidebarElementsComponent } from './sidebar-elements.component';

describe('SidebarElementsComponent', () => {
  let component: SidebarElementsComponent;
  let fixture: ComponentFixture<SidebarElementsComponent>;
  // let store: MockStore<SidebarState>;

  configureTestSuite(() =>
    TestBed.configureTestingModule({
      imports: [MatTooltipModule, MatIconModule, RouterTestingModule],
      declarations: [SidebarElementsComponent],
      providers: [provideMockStore({ initialState })],
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarElementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // store = TestBed.inject(Store) as MockStore<SidebarState>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('trackByFn', () => {
    test('should return index', () => {
      const idx = 5;

      const result = component.trackByFn(idx, {});

      expect(result).toEqual(idx);
    });
  });
});
