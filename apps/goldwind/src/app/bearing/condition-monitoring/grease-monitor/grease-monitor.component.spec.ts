import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';

import { AgGridModule } from '@ag-grid-community/angular';
import { configureTestSuite } from 'ng-bullet';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { GreaseMonitorComponent } from './grease-monitor.component';

describe('GreaseStatusComponent', () => {
  let component: GreaseMonitorComponent;
  let fixture: ComponentFixture<GreaseMonitorComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        MatCardModule,
        provideTranslocoTestingModule({}),
        AgGridModule.withComponents([]),
      ],
      declarations: [GreaseMonitorComponent],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GreaseMonitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
