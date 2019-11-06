import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SnackBarModule } from '@schaeffler/shared/ui-components';

import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let debugElement: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [MatSnackBarModule, SnackBarModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title 'kitchen-sink'`, () => {
    expect(component.title).toEqual('kitchen-sink');
  });

  it('should render title', () => {
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain(
      'Welcome to our kitchen-sink project!'
    );
  });

  describe('Snackbar', () => {
    it('should be opened upon openSnackbar method call', () => {
      const matSnackBar = TestBed.get(MatSnackBar);
      const spy = spyOn(matSnackBar, 'openFromComponent').and.returnValue({
        instance: { snackBarRef: {} }
      });

      component.openSnackbar();

      expect(spy).toHaveBeenCalled();
    });
  });
});
