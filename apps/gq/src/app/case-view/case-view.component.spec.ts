import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { configureTestSuite } from 'ng-bullet';

import { CaseViewComponent } from './case-view.component';
import { CreateCaseDialogComponent } from './create-case-dialog/create-case-dialog.component';

describe('CaseViewComponent', () => {
  let component: CaseViewComponent;
  let fixture: ComponentFixture<CaseViewComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [CaseViewComponent, CreateCaseDialogComponent],
      imports: [MatDialogModule, NoopAnimationsModule],
    }).overrideModule(BrowserDynamicTestingModule, {
      set: { entryComponents: [CreateCaseDialogComponent] },
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
