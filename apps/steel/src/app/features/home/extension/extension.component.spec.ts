import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';

import { SnackBarModule } from '@schaeffler/shared/ui-components';

import { ExtensionDownloadComponent } from '../extension/extension-download/extension-download.component';
import { ExtensionComponent } from './extension.component';

describe('ExtensionComponent', () => {
  let component: ExtensionComponent;
  let fixture: ComponentFixture<ExtensionComponent>;

  const mockExtension = {
    name: 'Live Refresh',
    description:
      'Allows for continous live refresh in of live data connections in Tableau',
    WIP: false,
    path: 'liverefresh'
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatCardModule,
        RouterTestingModule,
        MatIconModule,
        SnackBarModule
      ],
      declarations: [ExtensionComponent, ExtensionDownloadComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtensionComponent);
    component = fixture.componentInstance;
    component.extension = mockExtension;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
