import { ClipboardModule } from '@angular/cdk/clipboard';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { IconModule, SnackBarModule } from '@schaeffler/shared/ui-components';

import { ExtensionDownloadComponent } from '../extension-download/extension-download.component';
import { ExtensionDetailComponent } from './extension-detail.component';

describe('ExtensionComponent', () => {
  let component: ExtensionDetailComponent;
  let fixture: ComponentFixture<ExtensionDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ClipboardModule,
        IconModule,
        HttpClientTestingModule,
        RouterTestingModule,
        NoopAnimationsModule,
        SnackBarModule
      ],
      declarations: [ExtensionDetailComponent, ExtensionDownloadComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtensionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    component.extension = {
      name: 'Test Extension',
      description: 'Test Description',
      WIP: true,
      path: 'test-path',
      icon: 'test-icon',
      manifest: 'testfilter.trex',
      longDescription: 'test description longer text',
      howToUse: ['How to use 1', 'How to use 2'],
      notice: ['test notice 1', 'test notice 2', 'test notice 3'],
      permissions: 'none',
      screenshots: ['assets/screenshots/testfilter.PNG']
    };
    expect(component).toBeTruthy();
  });

  describe('trackByFn()', () => {
    it('should return the loop index to track usersArray', () => {
      const indexNum = 1337;
      const retId = component.trackByFn(indexNum);
      expect(retId).toEqual(indexNum);
    });
  });
});
