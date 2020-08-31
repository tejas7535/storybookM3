import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

import { configureTestSuite } from 'ng-bullet';

import { UnderConstructionModule } from '@schaeffler/empty-states';
import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { SharedModule } from '../../../shared/shared.module';
import { AdditionalInformationComponent } from './additional-information.component';

describe('AdditionalInformationComponent', () => {
  let component: AdditionalInformationComponent;
  let fixture: ComponentFixture<AdditionalInformationComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [AdditionalInformationComponent],
      imports: [
        CommonModule,
        SharedModule,
        provideTranslocoTestingModule({}),
        MatIconModule,
        MatTabsModule,
        UnderConstructionModule,
      ],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionalInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onClose', () => {
    it('should emit close event', () => {
      component['closeOverlay'].emit = jest.fn();

      component.onClose();

      expect(component['closeOverlay'].emit).toHaveBeenCalled();
    });
  });
});
