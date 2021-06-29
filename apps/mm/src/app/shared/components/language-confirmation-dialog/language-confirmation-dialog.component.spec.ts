import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguageConfirmationDialogComponent } from './language-confirmation-dialog.component';

describe('LanguageConfirmationDialogComponent', () => {
  let component: LanguageConfirmationDialogComponent;
  let fixture: ComponentFixture<LanguageConfirmationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LanguageConfirmationDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LanguageConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
