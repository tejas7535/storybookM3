import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { LanguageConfirmationDialogComponent } from './language-confirmation-dialog.component';

describe('LanguageConfirmationDialogComponent', () => {
  let component: LanguageConfirmationDialogComponent;
  let fixture: ComponentFixture<LanguageConfirmationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatButtonModule,
        MatDialogModule,
        provideTranslocoTestingModule({ en: {} }),
      ],
      declarations: [LanguageConfirmationDialogComponent],
      providers: [
        {
          provide: MATERIAL_SANITY_CHECKS,
          useValue: false,
        },
      ],
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
