import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

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
        MatSlideToggleModule,
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

  describe('toggleAntenna', () => {
    test('should toggle the boolean antenna var and call an event emit', () => {
      spyOn(component.antennaChange, 'emit');

      component.toggleAntenna();
      expect(component.antennaChange.emit).toHaveBeenCalled();

      component.antenna = true;
      component.toggleAntenna();

      expect(component.antenna).toBe(false);
      expect(component.antennaChange.emit).toHaveBeenCalledWith({
        antennaName: 'edmValue1Counter',
      });
    });
  });
});
