import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';

import { configureTestSuite } from 'ng-bullet';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { CenterLoadComponent } from './center-load.component';

describe('ConditionMeasuringEquipmentComponent', () => {
  let component: CenterLoadComponent;
  let fixture: ComponentFixture<CenterLoadComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [MatCardModule, provideTranslocoTestingModule({})],
      declarations: [CenterLoadComponent],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CenterLoadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
