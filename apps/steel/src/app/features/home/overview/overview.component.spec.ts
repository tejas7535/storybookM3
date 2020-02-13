import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import * as transloco from '@ngneat/transloco';
import { provideTranslocoTestingModule } from '@schaeffler/shared/transloco';
import { IconModule } from '@schaeffler/shared/ui-components';

import { configureTestSuite } from 'ng-bullet';

import { ExtensionComponent } from '../extension/extension.component';
import { OverviewComponent } from './overview.component';

import * as en from '../../../../assets/i18n/en.json';

describe('OverviewComponent', () => {
  let component: OverviewComponent;
  let fixture: ComponentFixture<OverviewComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [OverviewComponent, ExtensionComponent],
      imports: [
        NoopAnimationsModule,
        HttpClientTestingModule,
        MatCardModule,
        RouterTestingModule,
        IconModule,
        provideTranslocoTestingModule({ en })
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
