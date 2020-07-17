import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { configureTestSuite } from 'ng-bullet';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { BlockUiComponent } from './block-ui.component';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('BlockUiComponent', () => {
  let component: BlockUiComponent;
  let fixture: ComponentFixture<BlockUiComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [provideTranslocoTestingModule({}), MatProgressBarModule],
      declarations: [BlockUiComponent],
      providers: [],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
