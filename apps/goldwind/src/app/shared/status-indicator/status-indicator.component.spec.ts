import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';

import { configureTestSuite } from 'ng-bullet';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { StatusIndicatorComponent } from './status-indicator.component';

describe('StatusIndicatorComponent', () => {
  let component: StatusIndicatorComponent;
  let fixture: ComponentFixture<StatusIndicatorComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [MatIconModule, provideTranslocoTestingModule({})],
      declarations: [StatusIndicatorComponent],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
