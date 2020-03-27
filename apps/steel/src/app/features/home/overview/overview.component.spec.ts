import { ClipboardModule } from '@angular/cdk/clipboard';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import * as transloco from '@ngneat/transloco';
import { configureTestSuite } from 'ng-bullet';

import { provideTranslocoTestingModule } from '@schaeffler/shared/transloco';

import * as en from '../../../../assets/i18n/en.json';
import { ExtensionDetailComponent } from '../extension/extension-detail/extension-detail.component';
import { ExtensionDownloadComponent } from '../extension/extension-download/extension-download.component';
import { ExtensionComponent } from '../extension/extension.component';
import { OverviewComponent } from './overview.component';

describe('OverviewComponent', () => {
  let component: OverviewComponent;
  let fixture: ComponentFixture<OverviewComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        HttpClientTestingModule,
        MatCardModule,
        RouterTestingModule,
        MatIconModule,
        ClipboardModule,
        provideTranslocoTestingModule({ en })
      ],
      declarations: [
        OverviewComponent,
        ExtensionComponent,
        ExtensionDetailComponent,
        ExtensionDownloadComponent
      ]
    });
  });

  beforeEach(() => {
    spyOn(transloco, 'translate').and.returnValue('test');
    fixture = TestBed.createComponent(OverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title', () => {
    fixture.detectChanges();

    // TODO: Use Transloco Testing Module
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain(
      'Home / Extension'
    );
  });

  describe('trackByFn()', () => {
    it('should return the loop index to track usersArray', () => {
      const indexNum = 1337;
      const retId = component.trackByFn(indexNum);
      expect(retId).toEqual(indexNum);
    });
  });
});
