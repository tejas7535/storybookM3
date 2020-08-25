import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';

import { configureTestSuite } from 'ng-bullet';
import { NgxEchartsModule } from 'ngx-echarts';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { EdmMonitorComponent } from './edm-monitor.component';

describe('EdmMonitorComponent', () => {
  let component: EdmMonitorComponent;
  let fixture: ComponentFixture<EdmMonitorComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        MatCardModule,
        provideTranslocoTestingModule({}),
        NgxEchartsModule.forRoot({
          echarts: () => import('echarts'),
        }),
      ],
      declarations: [EdmMonitorComponent],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EdmMonitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
