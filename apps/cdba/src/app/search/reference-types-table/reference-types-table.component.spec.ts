import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';

import { AgGridModule } from '@ag-grid-community/angular';
import { configureTestSuite } from 'ng-bullet';

import {
  provideTranslocoTestingModule,
  SharedTranslocoModule,
} from '@schaeffler/transloco';

import { SharedModule } from '../../shared/shared.module';
import { ReferenceTypesTableComponent } from './reference-types-table.component';
import { DetailViewButtonComponent } from './status-bar/detail-view-button/detail-view-button.component';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('ReferenceTypesTableComponent', () => {
  let component: ReferenceTypesTableComponent;
  let fixture: ComponentFixture<ReferenceTypesTableComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedTranslocoModule,
        SharedModule,
        AgGridModule.withComponents([DetailViewButtonComponent]),
        MatIconModule,
        provideTranslocoTestingModule({}),
      ],
      declarations: [ReferenceTypesTableComponent, DetailViewButtonComponent],
      providers: [],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferenceTypesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
