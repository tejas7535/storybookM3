import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';

import { configureTestSuite } from 'ng-bullet';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { CmEquipmentComponent } from './cm-equipment.component';

describe('ConditionMeasuringEquipmentComponent', () => {
  let component: CmEquipmentComponent;
  let fixture: ComponentFixture<CmEquipmentComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [MatCardModule, provideTranslocoTestingModule({})],
      declarations: [CmEquipmentComponent],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CmEquipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
